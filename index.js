const express = require("express")
const { resolve } = require("path")
const cors = require("cors")
const {
  seedDataBase,
  getAllBooks,
  booksByAuthor,
  booksByGenre,
  addBook,
} = require("./controller/libController")

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("static"))

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"))
})

app.get("/seed_db", seedDataBase)
app.get("/books", getAllBooks)
app.get("/authors/:authorId/books", booksByAuthor)
app.get("/genres/:genreId/books", booksByGenre)
app.post("/books", addBook)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
