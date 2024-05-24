import React from 'react';
import './SearchResults.css';
import Track from '../Track/Track.js';

function SearchResults({ handlePlaylistAdd, tracks }) {

  return (
    <div className='search-results-container'>
      <div className='search-results-header'>
        <h2 className='search-results-title'>Results</h2>
      </div>
      <div className='search-results-track-container'>
        {tracks.map((track) => {
          return (
            <Track
              handlePlaylistAdd={handlePlaylistAdd}
              key={track.uri}
              track={track}
              type={'search'}
            />
          );
        })}
      </div>
    </div>
  );

};

export default SearchResults;