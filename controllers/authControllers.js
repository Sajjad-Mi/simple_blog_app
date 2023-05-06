const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const db = require("../model");
const User = db.users;
const createToken = (user_id, name) => {
  return jwt.sign({ user_id, name }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });
};
const pre = async function (pass) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(pass, salt);
};
const validpass = (password) => {
  if (password.length < 6) {
    throw Error("Your password shoud be at least 6 char");
  }
};
const validEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw Error("You don't enter a valid email");
  } 
};
module.exports.signup_get = (req, res) => {
  res.render("SignUp");
};

module.exports.signup_post = async (req, res) => {
  try {
    validEmail(req.body.email);
    validpass(req.body.password); 
    const hashedPass = await pre(JSON.stringify(req.body.password)); 

    const user = {
      name: req.body.username,
      email: req.body.email,
      password: hashedPass,
    };
    const newUser = await User.create(user);
    console.log(newUser.toJSON());
    const token = createToken(newUser.user_id, newUser.name);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    const userEmail = newUser.email;
    res.status(201).json({ user: userEmail, error: "" });
  } catch (error) {
    console.log(error.message);
    error = error.message;
    res.status(400).json({ error });
  }
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user != null) {
      const isValid = await bcrypt.compare(
        JSON.stringify(req.body.password),
        user.password
      ); 
      if (isValid) {
        console.log("your email and password is correct");
        const token = createToken(user.user_id, user.name);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ user: user.email, error: "" });
      } else {
        throw Error("your password or email is wrong");
      }
    } else {
      throw Error("your password or email is wrong");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
