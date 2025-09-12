import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import { Loader } from './components/Loader'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSeacrchCount } from './appwrite';


const BASE_URL = "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [search, setSearch] = useState()

  const [errMsg, setErrMsg] = useState()

  const [moviesList, setMovieList] = useState([])

  const [loading, setLoading] = useState(false)

  const [debounceST, setDebounceST] = useState('')

  useDebounce(() => setDebounceST(search), 500, [search])

  const getMovies = async (quary) => {
    setLoading(true)
    setErrMsg('')
    try {
      const endPoint =
        search ? `${BASE_URL}/search/movie?query=${encodeURIComponent(search)}`
          :
          `${BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endPoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('failed to fetch movies')
      }

      const data = await response.json()

      if (data.response === 'False') {
        setErrMsg(data.Error || 'failed to fetch movies')
        setMovieList([])
        return;
      }

      setMovieList(data.results || [])

      updateSeacrchCount()

    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrMsg('Error fetching movies. Please try agin later.')
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getMovies()
  }, [debounceST])



  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero-img.png' />
          <h1> Find <span className='text-gradient'>Moivies</span> You'll Enjoy without the Hassle</h1>
          <Search search={search} setSearch={setSearch} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {loading ?
            (<Loader />) :
            errMsg ?
              (<p className='text-red-500'>{errMsg}</p>) :
              (
                <ul>
                  {
                    moviesList.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))
                  }
                </ul>
              )
          }


        </section>
      </div>
    </main>
  )
}

export default App