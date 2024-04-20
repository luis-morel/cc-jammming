import React from 'react';

function SearchBar ({ handleSearchInput }) {
    return (
      <div>
        <input type='text' onChange={handleSearchInput}></input>
      </div>
    );
};

export default SearchBar;