import React from 'react';

function SearchButton ({ handleApiSearch }) {
    return (
      <div>
        <button onClick={handleApiSearch}>Search</button>
      </div>
    );
};

export default SearchButton;