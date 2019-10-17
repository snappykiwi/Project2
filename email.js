require("dotenv").config();
const nodemailer  = require("nodemailer"),
      hbs         = require("nodemailer-express-handlebars"),
      { google }  = require("googleapis"),
      OAuth2      = google.auth.OAuth2;

function sendEmail(email, link) {

  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.refresh_token
  });
  
  const accessToken = oauth2Client.getAccessToken();
  
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "schedulingapp742@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.refresh_token,
      accessToken: accessToken
    }
  });
  
  const mailOptions = {
    from: "schedulingapp742@gmail.com",
    to: `${email}`,
    subject: "You're Invited!",
    generateTextFromHTML: true,
    html: `<b>Hey! If you're interested in coming to this event, click this link. <a>${link}</a></b>`
  };
  
  smtpTransport.sendMail(mailOptions, (error, response) => {
     error ? console.log(error) : console.log(response);
     smtpTransport.close();
  });

};

module.exports = sendEmail;
