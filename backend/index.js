const express = require('express')
const http = require('http')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

app.get('/unsplash', async (req, res) => {
  axios
    .get(
      `http://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    )
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      console.log('oh no!')
      console.log(error)
    })
})

app.get('/smithsonian', async (req, res) => {
  axios
    .get(
      `https://api.si.edu/openaccess/api/v1.0/category/art_design/search?api_key=${process.env.SMITHSONIAN_API_KEY}&q=art&rows=1&sort=random`
    )
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      console.log('oh no')
      console.log(error)
    })
})

app.get('/wallpaper', async (req, res) => {
  const page = Math.floor(Math.random() * 278)

  console.log(page)

  axios
    .get(
      `https://www.wallpaperdirect.com/us/search?type%5B%5D=Wallpapers&pageNum=${page}`
    )
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      console.log('oh no!')
      console.log(error)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
