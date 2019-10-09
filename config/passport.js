const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const db = require("../models");

passport.use(new LocalStrategy(

  function(username, password, done) {

    db.User.findOne({ 
      where: {
        username: username 
      }
    }).then(function (err, user) {

      if (err) { return done(err); }

      if (!user) {

        return done(null, false, { message: 'Incorrect username.' });

      }
      if (!user.validPassword(password)) {

        return done(null, false, { message: 'Incorrect password.' });

      }

      return done(null, user);
    });
  }
));

passport.use(new GoogleStrategy({

  clientID: process.env.GOOGLE_CLIENT_ID,

  clientSecret: process.env.GOOGLE_CLIENT_SECRET,

  callbackURL: "http://localhost:3000/auth/google/redirect"

},
function(accessToken, refreshToken, profile, done) {

     User.findOrCreate({ googleId: profile.id }, function (err, user) {

      console.log(profile);
      return done(err, user);

     });

  }

));

passport.serializeUser(function(user, done) {

  done(null, user.id);

});

passport.deserializeUser(function(id, done) {
  
  db.User.findById(id, function(err, user) {

    done(err, user);

  });

});

module.exports = passport;