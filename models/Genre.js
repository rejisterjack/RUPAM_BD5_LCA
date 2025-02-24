const { sequelize, DataTypes } = require("../lib/sequelize")

const Genre = sequelize.define("Genre", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
})

module.exports = Genre
