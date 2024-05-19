import React from 'react';
import './SearchBar.css';

function SearchBar ({ handleSearchInput }) {
    return (
      <div className='search-bar'>
        <input 
          type='text' 
          onChange={handleSearchInput}
          placeholder='Enter artist or song name'></input>
      </div>
    );
};

export default SearchBar;