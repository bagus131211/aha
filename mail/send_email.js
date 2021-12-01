const nodemailer = require("nodemailer");

const sendEmail = (email, host, token) => {
  let mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_ACCOUNT_USER,
      pass: process.env.NODEMAILER_ACCOUNT_PASS,
    },
  });
  let mailOpt = {
    from: "no-reply@testlogin.com",
    to: email,
    subject: "Verify your sign-up mail",
    html: `Hello, \n\nPlease verify your account by clicking this link:\n <a href="https:\/\/${host}\/confirmation\/${token}">https:\/\/${host}\/confirmation\/${token}</a>.\n`,
  };
  mail.sendMail(mailOpt, (err, info) => {
    if (err) return 1;
    else return 0;
  });
};

module.exports = sendEmail;
