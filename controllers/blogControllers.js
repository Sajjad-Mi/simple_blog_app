const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validator = require('validator');

module.exports.blog_get = (req , res) =>{
    const cookieJWT = req.cookies.jwt;
    const user = jwt.verify(cookieJWT, "sajjad", async (err, decode)=>{
        if(err){
            console.log(err)
        } else{
            const data = await new Promise((resolve, reject)=>{                              //for reading all file of the dir of data  
                fs.readdir(`./data/${decode.userName}`, (err, data)=>{
                    let index = data.indexOf("info.txt")
                    if (index > -1) {
                        data.splice(index, 1);                              //remove the info txt file form array 
                    }
                    data.forEach(file => {                                  
                        if(!data.includes(file)){                       //if a new blog is added add that to home page 
                            data.push(file);
                        }
                    });                   
                    resolve(data);
                });
            })
            res.render('Blog', { data });

        }
    })
}
module.exports.main_get = (req, res) =>{                                                            //for showing the article
    const cookieJWT = req.cookies.jwt;
    const user = jwt.verify(cookieJWT, "sajjad", (err, decode)=>{

        new Promise((resolve, reject)=>{
            fs.readFile(`./data/${decode.userName}/${req.params.subject}.txt`, "utf8", (err, blogData)=>{              //read the content of the article
                    resolve(blogData);
            });
        }).then((blogData)=>{
            res.render("Main", {content:blogData, subject: req.params.subject});

        });
    })
}
module.exports.blogDelete_delete = (req, res)=>{
    const cookieJWT = req.cookies.jwt;
    const user = jwt.verify(cookieJWT, "sajjad", (err, decode)=>{
        fs.unlink(`./data/${decode.userName}/${req.params.subject}.txt`, (err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("file deleted");
            }
        })
        res.json({ redirect: '/blog' });
    })
}
module.exports.newBlog_get = (req , res) =>{
    res.render("New-Blog")

}
module.exports.create_post = (req , res) =>{
   const cookieJWT = req.cookies.jwt;
   const user = jwt.verify(cookieJWT, "sajjad", (err, decode)=>{
       if(err){
           console.log(err)
       } else{
           fs.writeFile(`./data/${decode.userName}/${req.body.subject}.txt`, JSON.stringify(req.body.main), (err)=>{
               console.log(err)
           })
           res.redirect("Blog")
       }
   })
}
module.exports.blogEdit_put = (req, res) =>{
    const cookieJWT = req.cookies.jwt;
    const user = jwt.verify(cookieJWT, "sajjad", (err, decode)=>{
        if(err){
            console.log(err)
        } else{
            console.log(req.body.subject)
            fs.writeFile(`./data/${decode.userName}/${req.params.subject}.txt`, JSON.stringify(req.body.main), (err)=>{
                console.log(err)
            })
            res.redirect(`/blog/main/${req.params.subject}`)
        }
    })
}