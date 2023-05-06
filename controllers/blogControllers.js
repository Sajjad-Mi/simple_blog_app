const db = require("../model");
const Blog = db.blogs;

module.exports.blog_get = async (req, res) => {
  try {
    const titlesDb = await Blog.findAll({
      attributes: ["title"],
      where: {
        user_id: req.cookies.user_id,
      },
    });

    const titles = JSON.parse(JSON.stringify(titlesDb, null, 2));
    res.render("Blog", { titles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.main_get = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { user_id: req.cookies.user_id, title: req.params.subject },
    });

    res.render("Main", { content: blog.body, subject: blog.title });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.blogDelete_delete = async (req, res) => {
  try {
    await Blog.destroy({
      where: { user_id: req.cookies.user_id, title: req.params.subject },
    });

    res.json({ redirect: "/blog" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.newBlog_get = (req, res) => {
  res.render("New-Blog");
};

module.exports.create_post = async (req, res) => {
  try {
    const blog = {
      user_id: req.cookies.user_id,
      title: req.body.subject,
      body: req.body.main,
    };
    const newBlog = await Blog.create(blog);
    console.log(newBlog.toJSON());
    res.redirect("Blog");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.blogEdit_put = async (req, res) => {
  try {
    await Blog.update(
      { body: req.body.main },
      {
        where: {
          user_id: req.cookies.user_id,
          title: req.params.subject,
        },
      }
    );
    res.redirect(`/blog/main/${req.params.subject}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
