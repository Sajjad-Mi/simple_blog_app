const jwt = require('jsonwebtoken');
const User = require("../models/User");

module.exports.blog_get = (req , res) =>{
    const cookieJWT = req.cookies.jwt;
    jwt.verify(cookieJWT, "sajjad", async (err, decode)=>{
        
        const user = await User.findById(decode.id)
        res.render('Blog', {data: await user.blogs})                                                            //send the user blogs 
    })
}
module.exports.main_get = (req, res) =>{                                                                            //show the blog page 
    const cookieJWT = req.cookies.jwt;
    jwt.verify(cookieJWT, "sajjad", async (err, decode)=>{  
        const user = await User.findById(decode.id)
        
          const index = user.blogs.findIndex((blog)=>{
             if(blog.title === req.params.title){
                 return true;
              }
           })
        
           res.render("Main", {content: user.blogs[index].main, subject: user.blogs[index].title});
    })
}
module.exports.blogDelete_delete = (req, res)=>{
    const cookieJWT = req.cookies.jwt;
    jwt.verify(cookieJWT, "sajjad", async (err, decode)=>{
       
        const user = await User.findById(decode.id)
        const index = user.blogs.findIndex(blog=>{
            if(blog.title === req.params.subject){                                  //find the blog for delete
                return true;
            }
        })
        
        user.blogs.splice(index, 1);                                            //remove the article from the user blogs
        await user.save()
        res.json({ redirect: '/blog' });
    })
}
module.exports.newBlog_get = (req , res) =>{
    res.render("New-Blog")
}
module.exports.create_post = (req , res) =>{
   const cookieJWT = req.cookies.jwt;
   jwt.verify(cookieJWT, "sajjad", async (err, decode)=>{
       if(err){
           console.log(err)
       } else{
           const user = await User.findById(decode.id)
           user.blogs.push({title:req.body.subject, main:req.body.main})
           user.save()
           res.redirect('Blog')
       }
   })
}
module.exports.blogEdit_put = (req, res) =>{
    const cookieJWT = req.cookies.jwt;
    jwt.verify(cookieJWT, "sajjad", async (err, decode)=>{
        if(err){
            console.log(err)
        } else{
            
            const user = await User.findById(decode.id)
            const index = user.blogs.findIndex(blog=>{                                      //find the blog for edit
                if(blog.title === req.params.subject){
                    return true;
                }
            })
            
            user.blogs[index].main = req.body.main                                              //added the changes
            await user.save()
             res.redirect(`/blog/main/${req.params.subject}`)

        }
    })
}