const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const dotenv = require("dotenv").config();

const db = require("../models");

passport.use(new LocalStrategy(

  function (username, password, done) {

    db.User.findOne({
      where: {
        username: username
      }
    }).then(function (dbUser) {

      if (!dbUser) {
        return done(null, false, {
          message: "incorrect email"
        });
      }

      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "incorrect password"
        });
      }
      return done(null, dbUser);

    });
  }
));

//     .then(function (err, user) {

//       if (err) { return done(err); }

//       if (!user) {

//         return done(null, false, { message: 'Incorrect username.' });

//       }
//       if (!user.validPassword(password)) {

//         return done(null, false, { message: 'Incorrect password.' });

//       }

//       return done(null, user);
//     });
//   }
// ));

passport.use(new GoogleStrategy({

  clientID: process.env.GOOGLE_CLIENT_ID,

  clientSecret: process.env.GOOGLE_CLIENT_SECRET,

  callbackURL: "http://localhost:3000/auth/google/"

},
  function (accessToken, refreshToken, profile, done) {

    User.findOrCreate({ googleId: profile.id }, function (err, user) {

      console.log(profile);
      return done(err, user);

    });

  }

));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;