require("dotenv").config();
const express     = require("express"),
      exphbs      = require("express-handlebars"),
      passport    = require("./config/passport"),
      session     = require("express-session"),
      bodyParser  = require("body-parser"),
      authRoutes  = require("./routes/authRoutes.js"),
      profRoutes  = require("./routes/profileRoutes.js");

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
