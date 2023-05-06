module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define("blog", {
    user_id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
      primaryKey: true,
    },
    desc: {
      type: Sequelize.DataTypes.STRING,
    },
    body: {
      type: Sequelize.DataTypes.STRING,
    },
  });

  return Blog;
};
