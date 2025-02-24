const { sequelize, DataTypes } = require("../lib/sequelize")

const Author = sequelize.define(
  "Author",
  {
    name: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    email: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
)

module.exports = Author
