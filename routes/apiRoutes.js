const db = require("../models");
const passport = require("passport");
const email = require("../email.js");
const moment = require('moment');
const Op = db.Sequelize.Op

const getDateArray = function (start, end) {

  let
    arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;

}


module.exports = function (app) {

  // ***** AUTH API ROUTES *****

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // gives back some user data
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

  // ***** USER API ROUTES *****

  // get all users
  app.get("/api/users", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // add new user
  app.post("/api/users", function (req, res) {
    db.User.create(req.body).then(function (dbUser) {
      console.log("Firing Api Users!")
      console.log(dbUser);
      res.json(dbUser);

    });
  });

  // Delete user by id
  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // ***** EVENT API ROUTES *****

  // get all events
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
        uuid: req.params.id
      }
    }).then(function (dbEvent) {

      res.json(dbEvent);
    });
  });

  // create new event
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

  //update event

  app.put("/api/events/:id", function (req, res) {
    db.Event.update(
      req.body,
      {
        where: {
          uuid: req.params.id
        }
      }).then(function (dbEvent) {
        res.json(dbEvent);
      })
  })

  // Edit event
  app.put("/api/posts", function (req, res) {
    db.Event.update(
      req.body,
      {
        where: {
          id: req.body.uuid
        }
      }).then(function (dbEvent) {
        res.json(dbPost);
      });
  });

  // Delete an event by id
  app.delete("/api/events/:id", function (req, res) {
    db.Event.destroy({ where: { uuid: req.params.id } }).then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  // ***** INVITE ROUTE *****

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
    if (req.params.eventId) {
      db.Invite.findAll({
        where: {
          EventUuid: req.params.eventId,
          UserId: req.params.userId
        }
      })
    }
    else {
      db.Invite.findAll({
        where: {
          UserId: req.user.id
        }
      }).then(function (dbInvites) {
        res.json(dbInvites);
      })
    }
  });

  app.post("/api/invite", function (req, res) {
    db.Invite.create({
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      status: "pending",
      EventUuid: req.body.eventId,
      UserId: req.user.id
    })
      .then(function (inviteData) {
        console.log(inviteData);
        db.User.findOne({
          where: {
            id: inviteData.UserId
          }
        }).then(function (userData) {
          email(userData.username, `localhost:3000/invite/${inviteData.id}/event/${inviteData.EventUuid}`);
        })
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

  // ***** REQUEST ROUTES *****

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

      db.Event.findAll({
        where: {
          UserId: req.user.id,
          eventDate: {
            [Op.between]: [dbRequest.dateStart, dbRequest.dateEnd]
          },
          [Op.or]: {
            startTime: {
              [Op.between]: [dbRequest.startTime, dbRequest.endTime]
            },
            endTime: {
              [Op.between]: [dbRequest.startTime, dbRequest.endTime]
            },
            // [Op.and]: [
            //   {
            //     startTime: {
            //       [Op.lte]: dbRequest.startTime
            //     },
            //   },
            //   {
            //     endTime: {
            //       [Op.gte]: dbRequest.endTime
            //     },
            //   }
            // ]
          }
        }
      }).then(function (sendingUserEvents) {

        db.Event.findAll({
          where: {
            UserId: req.body.friend,
            eventDate: {
              [Op.between]: [dbRequest.dateStart, dbRequest.dateEnd]
            },
            [Op.or]: {
              startTime: {
                [Op.between]: [dbRequest.startTime, dbRequest.endTime]
              },
              endTime: {
                [Op.between]: [dbRequest.startTime, dbRequest.endTime]
              },
              // [Op.and]: [
              //   {
              //     startTime: {
              //       [Op.lte]: dbRequest.startTime
              //     },
              //   },
              //   {
              //     endTime: {
              //       [Op.gte]: dbRequest.endTime
              //     },
              //   }
              // ]
            }
          }
        }).then(function (recUserEvents) {

          console.log(`Sending Events: ${sendingUserEvents}`);
          console.log(`Receiving Events: ${recUserEvents}`);
          let allEvents = [...sendingUserEvents, ...recUserEvents];

          let dateRange = getDateArray(dbRequest.dateStart, dbRequest.dateEnd);


          console.log(`StartTime:: ${dbRequest.startTime}`)
          console.log(`Duration:: ${dbRequest.duration}`)



          // let endTm = moment(dbRequest.startTime).add(parseInt(dbRequest.duration), 'hours');
          // console.log(`endTm: ${endTm}`)

          let userData;
          let inviteData;

          dateRange.forEach(el => {

            let foundDate = [];

            if (allEvents[0]) {

              allEvents.forEach(event => {

                console.log(`eventDate: ${event.eventDate}`);
                console.log(`el: ${el}`);


                if (moment(event.eventDate).isSame(el, 'day')) {

                  console.log("match");
                  foundDate.push(el);
                  console.log(foundDate);
                }
                else {

                  console.log("not a match");

                  db.Invite.create({

                    date: el,
                    startTime: dbRequest.startTime,
                    endTime: dbRequest.endTime,
                    status: "pending",
                    RequestUuid: dbRequest.uuid,
                    UserId: req.body.friend
                  })
                    .then(function (inviteData) {

                      inviteData = inviteData
                      db.User.findOne({
                        where: {
                          id: inviteData.UserId
                        }
                      }).then(function (userData) {

                        email(userData.username, `localhost:3000/invite/${userData.id}/request/${inviteData.RequestUuid}`);

                      })
                    });

                }
              })
            }
            else {

              db.Invite.create({

                date: el,
                startTime: dbRequest.startTime,
                endTime: dbRequest.endTime,
                status: "pending",
                RequestUuid: dbRequest.uuid,
                UserId: req.body.friend
              })
                .then(function (inviteData) {
    
                  inviteData = inviteData
                  db.User.findOne({
                    where: {
                      id: inviteData.UserId
                    }
                  }).then(function (userData) {
    
                    email(userData.username, `localhost:3000/invite/${userData.id}/request/${inviteData.RequestUuid}`);
    
                  })
                });


            }


          })


        })

      })
    });
  });

};
