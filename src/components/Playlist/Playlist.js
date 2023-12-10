import React from 'react';
import SaveToSpotifyButton from '../SaveToSpotifyButton/SaveToSpotifyButton';

function Playlist({ handlePlaylistDel, handlePlaylistName, playlistName, tracks }) {
  
  return (
    <div>
      <input type="text" value={playlistName} onChange={handlePlaylistName}/>
      {tracks.length === 0 ? <p></p> : tracks.map((track) => {
        return (
          <div key={track.playlistTrackIndex}>
            <p>{track.title}</p>
            <p>{track.artist} | {track.album}</p>
            <button data-trackindex={track.playlistTrackIndex} onClick={handlePlaylistDel}>-</button>
          </div>
        );
      })}
      <SaveToSpotifyButton title={playlistName} tracks={tracks}/>
    </div>
  );
};

export default Playlist;