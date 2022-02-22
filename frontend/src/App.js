import { useState } from 'react'
import axios from 'axios'
import './index.css'
import britney from './102718556_110509810541787_5291478769340234028_n.jpg'

function App() {
  const [imageUrl, setImageUrl] = useState(britney)
  const [type, setType] = useState('britney')

  const getRandomUnsplashPhoto = async () => {
    const response = await axios.get('http://localhost:3001/unsplash')
    setImageUrl(response.data.urls.regular)
    setType('unsplash')
  }

  const getRandomArtPiece = async () => {
    let response = await axios.get('http://localhost:3001/smithsonian')
    let itWorked = false
    let tries = 0
    while (!itWorked && tries < 10) {
      try {
        setImageUrl(
          response.data.response.rows[0].content.descriptiveNonRepeating
            .online_media.media[0].content
        )
        setType('smithsonian')
        itWorked = true
      } catch (error) {
        console.log(error)
        response = await axios.get('http://localhost:3001/smithsonian')
        tries += 1
      }
    }
  }

  const getRandomWallpaperPhoto = async () => {
    const response = await axios.get('http://localhost:3001/wallpaper')
    const regexp = /<img class="d-block.+?products\/(.+?)_.+?>/g

    const images = [...response.data.matchAll(regexp)]
    const links = images.map(
      (image) =>
        `https://cdn.wallpaperdirect.com/shared-assets/images/products/${image[1]}orig.jpg`
    )
    let randomWallpaper = links[Math.floor(Math.random() * links.length)]
    let tries = 0
    while (!randomWallpaper && tries < 10) {
      randomWallpaper = links[Math.floor(Math.random() * links.length)]
      tries += 1
    }
    setImageUrl(randomWallpaper)
    setType('wallpaper')
  }

  return (
    <div className='App'>
      <div>What about this one?</div>
      {imageUrl ? <img src={imageUrl} alt='' /> : <img src={britney} alt='' />}
      <button onClick={getRandomUnsplashPhoto}>Try a random photo</button>
      <button onClick={getRandomWallpaperPhoto}>
        Try a random wallpaper pattern
      </button>
      <button onClick={getRandomArtPiece}>
        Try a random piece of art from the Smithsonian
      </button>
    </div>
  )
}

export default App
