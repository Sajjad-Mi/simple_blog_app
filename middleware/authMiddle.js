const jwt = require('jsonwebtoken');

const authMiddle = (req, res , next)=>{
    const cookieJWT = req.cookies.jwt;
    if(cookieJWT){
        const user = jwt.verify(cookieJWT, "sajjad", (err, decode)=>{
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

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'sajjad', async (err, decodedToken) => {
        if (err) {
          res.locals.name = null;
          next();
        } else {
          //let user = await User.findById(decodedToken.id);
          res.locals.name = decodedToken.name;
          next();
        }
      });
    } else {
      res.locals.name = null;
      next();
    }
  };
module.exports = {authMiddle, checkUser}