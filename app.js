const express = require("express");
//const https = require("https");
//const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash-messages");

const db = require("./models/index");
const passportConfig = require("./config/passport")(passport);
const { setHomePage } = require("./routes/index");
const { resend, confirmation } = require("./routes/verify");
const { setSignIn, postSignIn, handleLogout } = require("./routes/sign-in");
const { setSignUp, postSignUp } = require("./routes/sign-up");
const { setFBSignIn, handleFBSignIn } = require("./routes/facebook");
const { setGoogleSignIn, handleGoogleSignIn } = require("./routes/google");
const { setReset, postReset } = require("./routes/reset-password");

const app = express();
const port = process.env.PORT;

//https - not work on heroku, work on local
// const httpsOpt = {
//   key: fs.readFileSync("./secure/cert.key"),
//   cert: fs.readFileSync("./secure/cert.pem"),
// };

// app.enable("trust proxy");

// if (process.env.NODE_ENV === "production") {
//   app.use((req, res, next) => {
//     if (req.header("x-forwarded-proto") !== "https")
//       res.redirect(`https://${req.header("host")}${req.url}`);
//     else next();
//   });
// }

// const server = https.createServer(httpsOpt, app).listen(port, () => {
//   console.log("server running at " + port);
// });
//end of https

app.set("port", port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "testlogin",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

db.sequelize.sync({ force: true }).then(() => console.log("Resync db"));

app.get("/", setHomePage);
app.get("/sign-in", setSignIn);
app.post("/sign-in", postSignIn);
app.get("/logout", handleLogout);
app.get("/sign-up", setSignUp);
app.post("/sign-up", postSignUp);
app.get("/auth/facebook", setFBSignIn);
app.get("/auth/facebook/callback", handleFBSignIn);
app.get("/auth/google", setGoogleSignIn);
app.get("/auth/google/callback", handleGoogleSignIn);
app.get("/confirmation/:token", confirmation);
app.get("/resend/:user_id", resend);
app.get("/reset", setReset);
app.post("/reset", postReset);

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
