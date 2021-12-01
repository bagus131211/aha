const passport = require("passport");

module.exports = {
  setFBSignIn: [passport.authenticate("facebook")],
  handleFBSignIn: [
    passport.authenticate("facebook", {
      failureRedirect: "/sign-in?signin_failed",
    }),
    (req, res) => {
      res.redirect("/");
    },
  ],
};
