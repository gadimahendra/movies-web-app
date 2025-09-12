import React from 'react'
import searchIcon from '../assets/search.png';

const Search = ({ search, setSearch }) => {
    return (
        <div className='search'>
            <div>
                <img src={searchIcon} alt="search" />
                <input
                    type='text' placeholder='Search here thousands of movies'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>
        </div>
    )
}

export default Search