import React from 'react';
import './SearchButton.css';

function SearchButton ({ handleApiSearch }) {
    return (
      <div className='search-button'>
        <button onClick={handleApiSearch}>SEARCH</button>
      </div>
    );
};

export default SearchButton;