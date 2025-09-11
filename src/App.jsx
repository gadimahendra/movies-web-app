import React, { useState } from 'react'
import Search from './components/Search'

const App = () => {

  const [search, setSearch] = useState('Spiderman')



  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero-img.png' />
          <h1> Find <span className='text-gradient'>Moivies</span> You'll Enjoy without the Hassle</h1>
        </header>
        <Search search={search} setSearch={setSearch} />
      </div>
    </main>
  )
}

export default App