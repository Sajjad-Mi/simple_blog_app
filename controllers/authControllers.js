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
const validpass = (password)=>{
    if(password.length < 6){
        throw Error("Your password shoud be at least 6 char")
    }
}
const validEmail = (email)=>{
    if(!validator.isEmail(email)){
        throw Error("You don't enter a valid email")
    } else{
        if(fs.existsSync(`./data/${email}`)){
            throw Error("This email is already sign up")
        }
    }
    
}
module.exports.signup_get = (req , res) =>{
    res.render("SignUp")
}

module.exports.signup_post = async(req , res) =>{
  /*  try {
        validEmail(req.body.email)
        validpass(req.body.password)                                                //throw an error if the input isn't valid
        const pass =await pre(JSON.stringify(req.body.password));                   //hashing
                                                      
        const user={username: req.body.username, email:req.body.email, password:pass};
        await new Promise((resolve, reject)=>{            
            if(!fs.existsSync('./data')){
                fs.mkdir('./data', (err)=>{
                    console.log(err)
                })
            }
            fs.mkdir(`./data/${req.body.email}`, (err)=>{
                console.log(err)
                if(!err){
                    resolve("made")
                }
            })
       })
        
        fs.writeFile(`./data/${req.body.email}/info.txt`, JSON.stringify(user), (err)=>{          //save the hash value email in a file
            console.log(err);
        })
        const token = createToken(req.body.email, req.body.username);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 2* 24 *60 *60* 1000 });
        const userEmail = req.body.email;
        res.status(201).json({ user: userEmail , error: ""});
    } catch (error) {
        console.log(error.message);
        error = error.message;
        res.status(400).json({ error });
    }*/
    try {
        //const user={username: req.body.username, email:req.body.email, password:pass};
        const user = await  User.create({name: req.body.username, email:req.body.email, password: req.body.password });
        const token = createToken(user._id);
       // user.save()
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
    console.log(req.body)
    try {
        if(fs.existsSync(`./data/${req.body.email}`)){                                           //check if the user exist else throw error
            const user = JSON.parse(await new Promise((resolve, reject)=>{
                fs.readFile(`./data/${req.body.email}/info.txt`, "utf8", (err, data)=>{                  //read the user info and save it in user const
                    if(data){
                        resolve(data);
                    } 
                    if(err){
                        console.log(err);
                    }
                })
            }))
            const isValid = await bcrypt.compare(JSON.stringify(req.body.password), user.password);                         //check the enterd password with database
            if(isValid){
                console.log("your email and password is correct")
                const token = createToken(user.email, user.username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: user.email, error: "" });
        
            }else{
                throw Error("your password or email is wrong")
            } 
        } else {
            throw Error("your password or email is wrong")
        }          
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
     
}

module.exports.logout_get = (req , res) =>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}