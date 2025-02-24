const { sequelize } = require("../lib/sequelize")
const Author = require("../models/Author")
const Book = require("../models/Book")
const Genre = require("../models/Genre")

const authorsData = [
  {
    name: "J.K. Rowling",
    birthdate: "1965-07-31",
    email: "jkrowling@books.com",
  },
  {
    name: "George R.R. Martin",
    birthdate: "1948-09-20",
    email: "grrmartin@books.com",
  },
]

const genresData = [
  { name: "Fantasy", description: "Magical and mythical stories." },
  {
    name: "Drama",
    description: "Fiction with realistic characters and events.",
  },
]

const booksData = [
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
]

// database seeder
const seedDataBase = async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    const authors = await Author.bulkCreate(authorsData)
    const genres = await Genre.bulkCreate(genresData)
    const books = await Book.bulkCreate(booksData)

    await books[0].setGenres([genres[0]])
    await books[1].setGenres([genres[0], genres[1]])

    res.send("Database Seeded Successfully!")
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll()
    res.status(200).send({ books })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

module.exports = {
  seedDataBase,
  getAllBooks,
}
