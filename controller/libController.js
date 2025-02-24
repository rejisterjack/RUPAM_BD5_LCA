const { sequelize } = require("../lib/sequelize")
const Book = require("../models/Book")

const seedDataBase = async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    await Book.bulkCreate([
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "A young wizard's journey begins.",
        publicationYear: 1997,
        authorId: 1,
      },
      {
        title: "Game of Thrones",
        description: "A medieval fantasy saga.",
        publicationYear: 1996,
        authorId: 2,
      },
    ])
    res.send("Database Seeded Successfully!")
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

module.exports = {
  seedDataBase,
}
