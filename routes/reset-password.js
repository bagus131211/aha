const { body, check, validationResult } = require("express-validator");
const User = require("../models").User;
const bcrypt = require("bcrypt");
let oldData = [];
module.exports = {
  setReset: (req, res) => {
    oldData = req.user;
    res.render("reset.ejs", {
      userData: req.user,
      resetData: [],
    });
  },
  postReset: [
    [
      body("oldPassword").custom((val) => {
        return bcrypt.compare(val, oldData.password).then((isSame) => {
          if (isSame == false) return Promise.reject("Wrong password");
        });
      }),
      check(
        "password",
        `Password must be contains at least 
      one lower character, 
      one upper character, 
      one digit character, 
      one special character, 
      min 8 characters and max 15 characters`
      )
        .isStrongPassword({
          minLength: 8,
          minNumbers: 1,
          minLowercase: 1,
          minSymbols: 1,
          minUppercase: 1,
        })
        .isLength({ max: 15 }),
      check("confirmPassword").custom(async (confirmPassword, { req }) => {
        let password = req.body.password;
        if (password !== confirmPassword)
          throw new Error("Password confirmation does not match password");
      }),
    ],
    async (req, res, next) => {
      let resetData = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("validation_errors", errors.array({ onlyFirstError: true }));
        return res.render("reset.ejs", {
          resetData: resetData,
          userData: req.user,
        });
      }
      let hash = await bcrypt.hash(resetData.password, 10);
      let user = await User.update(
        {
          password: hash,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      console.log(`user ${req.user.user_name} updated successfully`);
      req.logout();
      res.redirect("/sign-in");
    },
  ],
};
