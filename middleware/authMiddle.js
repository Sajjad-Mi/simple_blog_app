const jwt = require("jsonwebtoken");

const authMiddle = (req, res, next) => {
  const cookieJWT = req.cookies.jwt;
  if (cookieJWT) {
    const user = jwt.verify(
      cookieJWT,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.redirect("/log-in");
        } else {
          req.cookies = decodedToken;
          next();
        }
      }
    );
  } else {
    res.redirect("/log-in");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err)
        cosnole.log(process.env.JWT_SECRET)
        res.locals.name = null;
        next();
      } else {
        res.locals.name = decodedToken.name;
        next();
      }
    });
  } else {
    res.locals.name = null;
    next();
  }
};
module.exports = { authMiddle, checkUser };
