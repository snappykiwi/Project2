const passport = require("passport");
const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("login");
});

// authenticate user login
router.get('/google',
  passport.authenticate('google', { 

    scope: ['profile'] 

  }));

// redirect route for google
router.get('/google/redirect', 
  passport.authenticate('google'), (req, res) => {

    res.redirect('/profile');

  });

  module.exports = router;