const jwt = require('jsonwebtoken');
const User = require("../models/User");


const authMiddle = (req, res , next)=>{                                         //check the cookie validation
    const cookieJWT = req.cookies.jwt;
    if(cookieJWT){
        jwt.verify(cookieJWT, "sajjad", (err, decode)=>{
            if(err){
                console.log(err)
                res.redirect("/log-in")
            } else{
                next();
            }
        })
    } else{
        res.redirect("/log-in");
    }
}

const checkUser = (req, res, next) => {                                           //check the cookie and send the user name for nav
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'sajjad', async (err, decodedToken) => {
        if (err) {
          res.locals.name = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.name = user.name;
          next();
        }
      });
    } else {
      res.locals.name = null;
      next();
    }
  };
module.exports = {authMiddle, checkUser}