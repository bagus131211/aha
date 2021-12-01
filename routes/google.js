const passport = require("passport");

module.exports = {
  setGoogleSignIn: [
    passport.authenticate("google", { scope: ["profile", "email"] }),
  ],
  handleGoogleSignIn: [
    passport.authenticate("google", {
      failureRedirect: "/sign-in?signin_failed",
    }),
    (req, res) => {
      res.redirect("/");
    },
  ],
};
