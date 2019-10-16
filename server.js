require("dotenv").config();
const express     = require("express"),
      exphbs      = require("express-handlebars"),
      passport    = require("./config/passport"),
      session     = require("express-session"),
      bodyParser  = require("body-parser"),
      authRoutes  = require("./routes/authRoutes.js"),
      profRoutes  = require("./routes/profileRoutes.js"),
      nodemailer  = require("nodemailer"),
      hbs         = require("nodemailer-express-handlebars"),
      { google }  = require("googleapis"),
      OAuth2      = google.auth.OAuth2;


//requiring routes
const db = require("./models");

let app = express();
const PORT = process.env.PORT || 3000;

// Middleware

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({ 
  secret: "dogs are great", 
  resave: true, 
  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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
  to: "schedulingapp742@gmail.com",
  subject: "This is a test Email with OAuth",
  generateTextFromHTML: true,
  html: "<b>test</b>"
};

// smtpTransport.sendMail(mailOptions, (error, response) => {
//   error ? console.log(error) : console.log(response);
//   smtpTransport.close();
// })

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions.force).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
