import React from 'react'

const Search = ({ search, setSearch }) => {
    return (
        <div className='search'>
            <div>
                <img src='./search.png' alt="search" />
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