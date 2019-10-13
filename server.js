require("dotenv").config();
const express     = require("express"),
      exphbs      = require("express-handlebars"),
      passport    = require("./config/passport"),
      session     = require("express-session"),
      bodyParser  = require("body-parser"),
      authRoutes  = require("./routes/authRoutes.js"),
      profRoutes  = require("./routes/profileRoutes.js"),
      nodemailer  = require("nodemailer"),
      hbs         = require("nodemailer-handlebars");

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

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS
//   }
// });

// transporter.use('compile', hbs({
//   viewEngine: 'express-handlebars',
//   viewPath: 'views/'
// }));

// let options = {
//   from: 'schedulingapp742@gmail.com',
//   to: 'kpoole133@gmail.com',
//   subject: 'Test',
//   text: 'does this work?',
//   template: 'email',
//   context: {
//       name: 'testtesttest'
//   }
// };

// transporter.sendMail(options, (err, data) => {
//   if (err) {
//       return console.log('Error ' + err);
//   }
//   return console.log('Email sent!');
// });

// ********************

// const options = {
//   viewEngine: {
//     extName: '.hbs',
//     partialsDir: './views',
//     layoutsDir: './views',
//     defaultLayout: 'email.hbs',
//   },
//   viewPath: './views',
//   extName: '.hbs',
// };

// transporter.use('compile', hbs(options));
// let mail = {
//    from: 'schedulingapp742@gmail.com',
//    to: 'kpoole133@gmail.com',
//    subject: 'Test',
//    template: 'email',
//    context: {
//        name: 'Name'
//    },
//    text: 'Did this really send?'
// }
// transporter.sendMail(mail, function(err, info) {
//   if (err) {
//     console.log("error " + err);
//   } else {
//     console.log("Message sent");
//   }
// });

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

// app.use("./auth", authRoutes);
// app.use("./profile", profRoutes);

app.get("/", (req, res) => {
  res.render("index");
})

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// db.sequelize.sync({force: true}).then( function() {
//   console.log(`connected to db`);
// }).catch(function() {
//   console.log(`Error!`);
// })
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync({force: true}).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
