const { body, check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");
const randToken = require("rand-token");
const sendEmail = require("../mail/send_email");
const User = require("../models").User;
const Verification = require("../models").Verification;

module.exports = {
  setSignUp: (req, res) => {
    res.render("sign-up.ejs", {
      userData: [],
    });
  },
  postSignUp: [
    [
      check(
        "user_name",
        "Username must be min 5 and max 15 characters"
      ).isLength({ min: 5, max: 15 }),
      check("email", "Email must contain valid address").isEmail(),
      body("email").custom(async (value) => {
        let emailExist = await User.findOne({ where: { email: value } });
        if (emailExist) return new Error("Email already exist");
      }),
      check(
        "password",
        `Password must be contains at least 
            one lower character, 
            one upper character, 
            one digit character, 
            one special character, 
            min 8 characters and max 15 characters`
      ).matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/,
        "i"
      ),
      check("confirmPassword").custom(async (confirmPassword, { req }) => {
        let password = req.body.password;
        if (password !== confirmPassword)
          throw new Error("Password confirmation does not match password");
      }),
    ],
    async (req, res, next) => {
      let userData = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("validation_errors", errors.array());
        return res.render("sign-up.ejs", {
          user: req.user,
          userData: userData,
        });
      }
      let name = req.body.user_name;
      let email = req.body.email;
      let password = req.body.password;
      let hash = await bcrypt.hash(password, 10);
      let user = await User.create({
        user_name: name,
        email: email,
        registration_type: "email",
        password: hash,
        is_verified: false,
      });
      console.log(`user ${user.user_name} created successfully`);
      let token = randToken.generate(30);
      let verification = await Verification.create({
        user_id: user.id,
        token: token,
      });
      console.log(`verify ${verification.id} created successfully`);
      sendEmail(email, req.headers.host, token);
      let userId = user.id;
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        else if (!user) return res.redirect(`/?not_verified&userId=${userId}`);
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.redirect("/");
        });
      })(req, res, next);
    },
  ],
};
