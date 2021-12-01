module.exports = {
  setHomePage: (req, res) => {
    let isVerified =
      typeof req.query.not_verified !== "undefined" ? false : true;
    let userId = req?.query?.userId;
    res.render("index.ejs", {
      user: req.user,
      isVerified: isVerified,
      user_id: userId,
    });
  },
};
