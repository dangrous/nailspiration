import { useState } from 'react'
import axios from 'axios'
import './index.css'
import britney from './images/britney.jpg'
import loader from './images/loader.gif'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [imageUrl, setImageUrl] = useState(britney)
  const [type, setType] = useState('britney')
  const [unsplashRequests, setUnsplashRequests] = useState(null)

  const getRandomUnsplashPhoto = async () => {
    setImageUrl(loader)
    const response = await axios.get('/unsplash')
    setImageUrl(response.data.urls.regular || britney)
    setType('unsplash')
    setUnsplashRequests(response.data.remaining)
  }

  const getRandomArtPiece = async () => {
    setImageUrl(loader)
    let response = await axios.get('/smithsonian')
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
        response = await axios.get('/smithsonian')
        tries += 1
      }
    }

    if (!itWorked) {
      setImageUrl('britney')
    }
  }

  const getRandomWallpaperPhoto = async () => {
    setImageUrl(loader)
    const response = await axios.get('/wallpaper')
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
    setImageUrl(randomWallpaper || britney)

    setType('wallpaper')
  }

  return (
    <div className='App text-center m-3'>
      <div className='row justify-content-md-center'>
        <h1 className='display-1 col-sm-10'>
          Need some inspiration for your next nail design?
        </h1>
        <p className='lead'>
          Britney's here to help! Click any button below to find your muse.
        </p>
      </div>
      <div className='row mb-3'>
        <div className='container col-sm-5'>
          <button
            type='button'
            className='btn btn-primary m-1'
            onClick={getRandomUnsplashPhoto}
            disabled={unsplashRequests !== null && unsplashRequests === 0}
          >
            {unsplashRequests !== null && unsplashRequests === 0
              ? 'Sorry, wait for the next hour!'
              : 'Try a random photo'}
          </button>
          <button
            type='button'
            className='btn btn-primary m-1'
            onClick={getRandomWallpaperPhoto}
          >
            Try a wallpaper pattern
          </button>
          <button
            type='button'
            className='btn btn-primary m-1'
            onClick={getRandomArtPiece}
          >
            Try something from the Smithsonian
          </button>
          <button
            type='button'
            className='btn btn-primary m-1'
            onClick={() => {
              setImageUrl(britney)
            }}
          >
            Back to Britney
          </button>
        </div>
      </div>
      <div className='row text-center'>
        <div className='container col-lg-5 text-center'>
          <img src={imageUrl} className='col-sm-12 mb-3 shadow p-auto' alt='' />
          <p className='fw-lighter fst-italic'>
            The "Try a random photo" button can only be clicked 50 times an
            hour, due to something something tech tech tech. You've got{' '}
            {unsplashRequests || 'an unknown amount of'}{' '}
            {unsplashRequests === 1 ? 'click' : 'clicks'} left. If the button is
            greyed out, just wait until the top of the hour!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
