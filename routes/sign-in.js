const passport = require("passport");

module.exports = {
  setSignIn: (req, res) => {
    let isFailed = typeof req.query.signin_failed !== "undefined";
    if (isFailed) req.flash("validation_errors", [{ msg: "Fail to sign-in." }]);
    res.render("sign-in.ejs", {
      user: req.user,
    });
  },
  postSignIn: [
    passport.authenticate("local", {
      failureRedirect: "/sign-in?signin_failed",
    }),
    (req, res) => res.redirect("/"),
  ],
  handleLogout: (req, res) => {
    req.logout();
    res.redirect("/");
  },
};
