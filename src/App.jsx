import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import { Loader } from './components/Loader'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSeacrchCount, getTrendingMovies } from './appwrite';
import heroBgIcon from './assets/hero-img.png';


const BASE_URL = "https://api.themoviedb.org/3"
const TRENDING_M_URL = import.meta.env.VITE_APPWRITE_ENDPOINT

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [search, setSearch] = useState("")

  const [trendingMovies, setTrendingMovies] = useState([])

  const [errMsg, setErrMsg] = useState()

  const [searchedMovie, setSearchedMovie] = useState(false)

  const [moviesList, setMovieList] = useState([])

  const [loading, setLoading] = useState(false)

  const [debounceST, setDebounceST] = useState('')

  useDebounce(() => setDebounceST(search), 500, [search])

  const getMovies = async (quary) => {
    setLoading(true)
    setSearchedMovie(false)
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

      if (quary && data.results.length == 0) {
        console.log('event triggered2', data.results.length);
        setSearchedMovie(true)
        setErrMsg(`Can't find any movies with the name ${quary}`)
      }

      if (quary && data.results.length > 0) {
        await updateSeacrchCount(quary, data.results[0])
      }


    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrMsg('Error fetching movies. Please try agin later.')
    } finally {
      setLoading(false)
    }

  }


  const getTrendingMvs = async () => {

    try {
      console.log('ghjhgf');
      const res = await getTrendingMovies()
      setTrendingMovies(res || [])
    } catch (error) {
      console.error(`Error fetching trending movies;${error}`)

    }


  }

  useEffect(() => {
    getMovies(search)
  }, [debounceST])

  useEffect(() => {
    getTrendingMvs()
  }, [])



  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src={heroBgIcon} />
          <h1> Find <span className='text-gradient'>Moivies</span> You'll Enjoy without the Hassle</h1>

          <Search search={search} setSearch={setSearch} />
        </header>

        {
          trendingMovies.length > 0 && search == '' && (
            <section className='trending'>
              <h2>Trending Movies</h2>

              <ul>
                {
                  trendingMovies.map((movie, index) => (
                    <li key={movie.id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))
                }
              </ul>
            </section>
          )
        }

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {loading ?
            (<Loader />) :
            errMsg || moviesList.length == 0 || searchedMovie ?
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