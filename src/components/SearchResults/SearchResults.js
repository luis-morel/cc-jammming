import React from 'react';

function SearchResults(props) {
  const { handlePlaylistAdd, tracks } = props;
  return (
    <div>
      <p>Results</p>
      {tracks.map((track, i) => {
        return (
          <div key={track.id}>
            <p>{track.title}</p>
            <p>{track.artist} | {track.album}</p>
            <button data-trackid={track.id} onClick={handlePlaylistAdd}>+</button>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;