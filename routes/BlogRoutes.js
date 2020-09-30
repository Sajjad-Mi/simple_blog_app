const {Router} = require("express");
const blogControllers = require("../controllers/blogControllers");

const router = Router();

router.get("/blog", blogControllers.blog_get);
router.get("/blog/main/:title", blogControllers.main_get);
router.delete('/blog/delete/:subject', blogControllers.blogDelete_delete);
router.put('/blog/edit/:subject', blogControllers.blogEdit_put)
router.get("/new-Blog", blogControllers.newBlog_get);
router.post("/create", blogControllers.create_post);

module.exports = router;