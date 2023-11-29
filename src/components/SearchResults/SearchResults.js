import React from 'react';

function SearchResults({ songs }) {
  return (
    <div>
      {songs.map((song) => {
        return (
          <div>
            <p>{song.title}</p>
            <p>{song.artist} | {song.album}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;