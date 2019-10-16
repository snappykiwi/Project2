const db = require("../models");
const passport = require("passport");

module.exports = function (app) {

  // AUTH API ROUTES

  app.post('/api/login',
    passport.authenticate("local", {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
    }),
    function (req, res) {
      console.log(req.user);
      res.json(req.user);
    }
  );

  app.post("/api/signup", function (req, res) {

    db.User.create({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  //gives back some user data
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {

      res.json({});
    } else {

      res.json({
        name: req.user.name,
        username: req.user.email,
        id: req.user.id
      });
    }
  });

  // EVENT API ROUTES 
  //get all events
  app.get("/api/events", function (req, res) {
    db.Event.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function (dbEvent) {

      res.json(dbEvent);
    });
  });

  app.get("/api/events/:id", function (req, res) {
    db.Event.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbEvent) {

      res.json(dbEvent);
    });
  });


  //create new event
  app.post("/api/events", function (req, res) {

    db.Event.create({
      eventTitle: req.body.eventTitle,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      eventDate: req.body.eventDate,
      description: req.body.description,
      UserId: req.user.id
    })
      .then(function (result) {
        console.log("sent data to db")
        res.json(result);
      })
      .catch(function (err) {
        console.log("failed")
        console.log(err);
        res.status(err).json(err);
      })
  });



  //Delete an event by id
  app.delete("/api/events/:id", function (req, res) {
    db.Event.destroy({ where: { id: req.params.id } }).then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  // USER API ROUTES
  //get all users
  app.get("/api/users", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  //Delete user by id
  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    });
  });


  //REQUEST ROUTES
  app.post("/api/request", (req, res) => {
    db.Request.create({
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      startTime: req.body.starTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      reason: req.body.reason,
      status: req.body.status,
      UserId: req.user.id

    }).then(function (dbRequest) {
      console.log(dbRequest);
      res.json(dbRequest);
    });
  });


  //add new user
  app.post("/api/users", function (req, res) {
    db.User.create(req.body).then(function (dbUser) {
      console.log("Firing Api Users!")
      console.log(dbUser);
      res.json(dbUser);

    });
  });

  //Delete user by id
  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    });
  });


  //REQUEST ROUTES
  app.post("/api/request", (req, res) => {
    db.Request.create({
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      startTime: req.body.starTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      reason: req.body.reason,
      status: req.body.status,
      UserId: req.user.id

    }).then(function (dbRequest) {
      console.log(dbRequest);
      res.json(dbRequest);
    });
  });



  //INVITE ROUTE

  app.get("/api/invite/:id", function (req, res) {
    db.Invite.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Event]
    }).then(function (dbInvites) {
      res.json(dbInvites);
    });
  });

  app.get("/api/invite/events/:eventId?/:userId?", function (req, res) {
    if(req.params.eventId) {
      db.Invite.findAll({
        where: {
          EventId: req.params.eventId,
          UserId: req.params.userId
        }
      })
    }
    else {
      db.Invite.findAll({
        where: {
          UserId: req.user.id
        }
      }).then(function(dbInvites) {
        res.json(dbInvites);
      })
    }
  });

  app.get("/api/invite/:id", (req, res) => {
    res.json([
      {
        name: "bob",
        date: 1570817096319,
        times: [
          1570817044814, 1570817095477, 1570817096319
        ],
        reason: "code",
        invite_id: "bskdfai032"
      }
    ]);
  });

  app.post("/api/invite", function (req, res) {
    db.Invite.create({
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      status: "pending",
      EventId: req.body.eventId,
      UserId: req.user.id
    }).then(function (data) {
      console.log(data);
    });
  });

  app.put("/api/invite/:id", function (req, res) {
    db.Invite.update({
      status: req.body.status
    }, {
      where: {
        id: req.params.id
      }
    });
  });

  //Edit event
  app.put("/api/posts", function (req, res) {
    db.Event.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbEvent) {
        res.json(dbPost);
      });
  });

};
