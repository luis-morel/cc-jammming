import React from 'react';
import SaveToSpotifyButton from '../SaveToSpotifyButton/SaveToSpotifyButton';

function Playlist(props) {

  const { 
    handlePlaylistDel,
    handlePlaylistName,
    handlePlaylistSaveToSpotify,
    playlistName,
    tracks
  } = props;
  
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
      <SaveToSpotifyButton savePlaylistToSpotify={handlePlaylistSaveToSpotify} title={playlistName} tracks={tracks}/>
    </div>
  );
  
};

export default Playlist;