const randToken = require("rand-token");
const passport = require("passport");
const sendEmail = require("../mail/send_email");
const User = require("../models").User;
const Verification = require("../models").Verification;

module.exports = {
  resend: async (req, res, next) => {
    let user = await User.findByPk(req.params.user_id);
    let token = randToken.generate(30);
    await Verification.destroy({
      where: { user_id: user.id },
    });
    let verification = await Verification.create({
      user_id: user.id,
      token: token,
    });
    console.log(`verify ${verification.id} created successfully`);
    sendEmail(user.email, req.headers.host, token);
    return res.redirect(`/?not_verified&userId=${user.id}`);
  },
  confirmation: async (req, res, next) => {
    let verification = await Verification.findOne({
      where: { token: req.params.token },
    });
    if (!verification) return console.log("Invalid link");
    let user = await User.findByPk(verification.user_id);
    if (!user) return console.log("User not found");
    user.is_verified = true;
    user.save();
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  },
};
