var db = require("../models");


  
module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Event.findAll({}).then(function (dbEvent) {
      res.render("index", {
        msg: "The Home Page!",
        events: dbEvent
      });
    });
  });

  //user homepage

  app.get("/home", function (req, res) {
    db.Event.findAll({}).then(function (dbResponse) {
      res.render("userHome", {
        msg: "Welcome Back",
        homepage: dbResponse
      })
    })
  })

  //add event

  app.get("/addevent", function (req, res) {
    db.Event.findAll({}).then(function (dbEvents) {
      res.render("addEvent", {
        msg: "Welcome!",
        events: dbEvents
      });
    });
  });

  //add user
  app.get("/adduser", function (req, res) {
    db.User.findAll({}).then(function (dbUsers) {
      res.render("addUser", {
        msg: "Add User",
        user: dbUsers
      });

    });
  });

  
  app.get("/request", function(req, res) {
    res.render("request")
  });


  //load event page and pass in an event by id
  app.get("/events/:id", function (req, res) {
    db.Event.findOne({ where: { id: req.params.id } }).then(function (dbEvent) {
      res.render("event", {
        event: dbEvent
      })
    })
  })

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
