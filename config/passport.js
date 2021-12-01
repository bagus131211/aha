const User = require("../models").User;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { Op } = require("sequelize");
const dotenvConfig = require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FBStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (username, password, done) => {
        console.log(`log in as ${username}`);
        let user = await User.findOne({
          where: {
            [Op.and]: [{ email: username }, { is_verified: true }],
          },
        });
        if (!user) return done(null, false);
        else if (user.is_verified === false) return done(null, user);
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            console.log("sign in successfully");
            return done(null, user);
          } else return done(null, false);
        });
      }
    )
  );
};

passport.use(
  new FBStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_APP_CALLBACK_URI,
      profileFields: ["id", "displayName", "email"],
    },
    async (accToken, refToken, profile, cb) => {
      let [user, status] = await User.findOrCreate({
        where: {
          user_name: profile.displayName,
          email: profile.emails[0].value,
          registration_type: "facebook",
          is_verified: true,
        },
      });
      cb(null, user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: process.env.GOOGLE_APP_CALLBACK_URI,
    },
    async (accToken, refToken, profile, cb) => {
      let [user, status] = await User.findOrCreate({
        where: {
          user_name: profile.displayName,
          email: profile.emails[0].value,
          registration_type: "google",
          is_verified: true,
        },
      });
      cb(null, user);
    }
  )
);
