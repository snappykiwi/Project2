const router = require("express").Router();
const checkLogin = require("../config/middleware/index.js");

router.get("/", checkLogin.isLoggedIn, (req, res) => {
  res.render("profile", {
    user : req.user
  });
});

module.exports = router;