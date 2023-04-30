require('dotenv').config();
const express = require("express");
const methodOverride = require("method-override");
const authRoutes = require("./routes/AuthRoutes");
const blogRoutes = require("./routes/BlogRoutes");
const cookieParser = require("cookie-parser");
const { authMiddle, checkUser } = require("./middleware/authMiddle.js");

const app = express();


const db = require("./model");
db.sequelize.sync();

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.listen(3000);

app.get("*", checkUser);
app.get("/", (req, res) => res.render("Home"));
app.get("/about", (req, res) => res.render("About"));
app.use(authRoutes);
app.use(authMiddle, blogRoutes);
app.use((req, res) => {
  res.status(404).render("404");
});
