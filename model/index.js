const dbConfig = require("../config/db.config.js");
//const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.blogs = require("./blog.model.js")(sequelize, Sequelize);

db.users.hasMany(db.blogs, {
  foreignKey: 'user_id'
});
db.blogs.belongsTo(db.users);
module.exports = db;