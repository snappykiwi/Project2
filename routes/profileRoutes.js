const router = require("express").Router();
const middleware = require("../config/middleware/index.js");

router.get("/", middleware.isLoggedIn, (req, res) => {
  res.render("profile", {
    user : req.user
  });
});

module.exports = router;