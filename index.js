const express = require("express")
const { resolve } = require("path")
const cors = require("cors")

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("static"))

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
