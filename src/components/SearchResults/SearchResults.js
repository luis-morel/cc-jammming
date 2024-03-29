import React from 'react';

function SearchResults({ handlePlaylistAdd, tracks }) {
  
  return (
    <div>
      <p>Results</p>
      {tracks.map((track) => {
        return (
          <div key={track.uri}>
            <p>{track.title}</p>
            <p>{track.artist} | {track.album}</p>
            <button data-trackuri={track.uri} onClick={handlePlaylistAdd}>+</button>
          </div>
        );
      })}
    </div>
  );
  
};

export default SearchResults;