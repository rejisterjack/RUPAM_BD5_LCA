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
    res.status(500).json({ message: err.message })
  }
}

// get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{ model: Author }, { model: Genre }],
    })
    res.status(200).json({ books })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// books by author
const booksByAuthor = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        authorId: req.params.authorId,
      },
      include: [{ model: Genre }],
    })
    if (!books.length)
      return res.status(404).json({ message: "No books found for this author" })
    res.status(200).json({
      books,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// books by genre
const booksByGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.genreId)
    if (!genre) return res.status(404).json({ message: "genre not found" })

    const books = await Book.findAll({
      include: [
        { model: Author },
        { model: Genre, where: { id: req.params.genreId } },
      ],
    })

    if (!books.length)
      return res.status(200).json({
        message: "no books found",
      })
    res.status(200).json({ books })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const addBook = async (req, res) => {
  try {
    const { title, description, publicationYear, authorId, genreIds } = req.body

    if (!title || !description || !publicationYear || !authorId || !genreIds)
      return res.status(400).json({
        message: "missing required fields",
      })

    const author = await Author.findByPk(authorId)
    if (!author)
      return res.status(400).json({
        message: "Author not found",
      })

    const genres = await Genre.findAll({
      where: { id: genreIds },
    })

    if (genres.length !== genreIds.length) {
      return res.status(404).json({ error: "One or more genres not found" })
    }

    const book = await Book.create({
      title,
      description,
      publicationYear,
      authorId,
    })

    await book.setGenres(genres)

    const completeBook = await Book.findByPk(book.id, {
      include: [{ model: Author }, { model: Genre }],
    })

    res.status(201).json({ book: completeBook })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.message,
      errors: err.errors,
    })
  }
}

// add a author
const addAuthor = async (req, res) => {
  try {
    const { name, birthdate, email } = req.body

    if (!name || !birthdate || !email) {
      return res.status(400).json({ message: "missing required fields" })
    }

    const newAuthor = await Author.create({
      name,
      birthdate,
      email,
    })

    res
      .status(201)
      .json({ message: "New author created successfully", author: newAuthor })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// get authors by genre
const authorsByGenre = async (req, res) => {
  try {
    const genreId = req.params.genreId

    const genre = await Genre.findByPk(genreId)

    if (!genre) return res.status(400).json({ message: "No genre found" })

    const books = await Book.findAll({
      include: [
        {
          model: Genre,
          where: {
            id: genreId,
          },
        },
      ],
    })

    const authorIds = Array.from(
      new Set(books.flatMap((item) => item.authorId))
    )

    const authors = await Author.findAll({
      where: {
        id: authorIds,
      },
    })

    res.status(200).json({ authors })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  seedDataBase,
  getAllBooks,
  booksByAuthor,
  booksByGenre,
  addBook,
  addAuthor,
  authorsByGenre,
}
