const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require("../models/User");

const createToken = (id)=>{
    return jwt.sign({ id}, 'sajjad', {
        expiresIn: "2 days"
      });
}
const pre = async function(pass){                                               //function for hashing the password
    const salt = await bcrypt.genSalt();
    const data = await bcrypt.hash(pass, salt);
    return data;
}
const checkEmailError = (error)=>{
    let errorMessage = ""
    if(error.code === 11000){
        errorMessage = "This email is already sign up"
    }
    console.log(error.code)
    if(error.message.includes("enter a valid")){
        errorMessage = "Please enter a valid email"
    }
    return errorMessage
}
const checkPassError = (error)=>{
    let errorMessage = ""
    if(error.includes("char")){
        errorMessage = "Your password should be atleast 6 char"
    }

    return errorMessage
}

module.exports.signup_get = (req , res) =>{
    res.render("SignUp")
}

module.exports.signup_post = async(req , res) =>{
  
    try {
        const user = await  User.create({name: req.body.username, email:req.body.email, password: req.body.password });     //if there is no error save the user
        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxAge: 2* 24 *60 *60* 1000 });
        res.status(201).json({ user: req.body.email });
    } catch (err) {
        console.log(err.message)
        let error = {passwordError:checkPassError(err.message), emailError: checkEmailError(err)};
        res.status(400).json({ error });
    }
}

module.exports.login_get = (req , res) =>{
    res.render("login")
}

module.exports.login_post =async (req , res) =>{
    try {
        const user = await User.login(req.body.email, req.body.password)          
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: user.email, error: "" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
     
}

module.exports.logout_get = (req , res) =>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}