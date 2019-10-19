const db = require("../models");
const middleware = require("../config/middleware/index");
const Op = db.Sequelize.Op

module.exports = function (app) {

  app.get("/", function (req, res) {
    if (!req.user) {
      res.render("index")
    }
    else {
      db.Event.findAll({
        where: {
          UserId: req.user.id
        },
        include: [db.User]
      }).then(function (dbEvents) {
        console.log(dbEvents);
        res.render("userHome", {
          events: dbEvents
        });
      });
    }
  });

  // user homepage
  app.get("/home", middleware.isLoggedIn, function (req, res) {
    let currentUserId = req.user.id;

    db.Event.findAll({
      where: {
        [Op.or]: [{
          UserId: currentUserId
        }]
      },
      order : ["eventDate"],         
      include : [{
        model: db.Invite,
        where: {
          UserId: currentUserId,
          status: 'accepted'
        },
        required: false
      }]
    })
      .then(function(userEvt){
        
        res.render("userHome", {
          msg: "Welcome Back",
          userEvents: userEvt,
          // acceptedInv: acceptedEvt
        })     
    });

  });

  // create event page
  app.get("/addevent", middleware.isLoggedIn, function (req, res) {
    db.Event.findAll({
      where: {
        UserId: req.user.id,

      }
    }).then(function (dbEvents) {
      console.log(dbEvents);
      res.render("addEvent", {
        msg: "Welcome!",
        events: dbEvents
      });
    });
  });

  // load event page and pass in an event by id
  app.get("/events/:id", function (req, res) {
    db.Event.findOne({
      where: {
        uuid: req.params.id
      }
    }).then(function (dbEvent) {
      res.render("event", {
        event: dbEvent
      });
    });
  });

  // Create request page
  app.get("/request", middleware.isLoggedIn, function (req, res) {
    let user = req.user;
    db.User.findAll({
      where: {
        id: {
          [Op.not]: req.user.id
        }
      }
    }).then(function (dbUsers) {

      res.render("request", { users: dbUsers })
    })
  });

  app.get("/inbox", middleware.isLoggedIn, function (req, res) {
    db.Invite.findAll({
      where: {
        status: "pending",
        UserId: req.user.id,
      },
      include: [{
        model: db.Event,
        include: [db.User]
      }, {
        model: db.User
      }, {
        model: db.Request,
        include: [db.User]
      }]
    }).then(function (dbInvites) {
      console.log(dbInvites);
      res.render("inbox", {
        invites: dbInvites
      });
    }).catch(console.log("Error!"))
  })

  app.get("/invite/:id/event/:eventId", function (req, res) {
    db.Invite.findOne({
      where: {
        id: req.params.id,
        EventUuid: req.params.eventId
      },
      include: [{
        model: db.Event,
        include: [db.User]
      }, {
        model: db.User
      }, {
        model: db.Request,
        include: [db.User]
      }]
    }).then(function (dbInvites) {
      console.log(dbInvites.Event.dataValues.eventTitle);
      res.render("eventInvite", { invites: dbInvites })
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });

};
