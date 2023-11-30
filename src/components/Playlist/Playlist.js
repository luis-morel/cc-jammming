import React from 'react';
import SaveToSpotifyButton from '../SaveToSpotifyButton/SaveToSpotifyButton';

function Playlist(props) {
  const { handlePlaylistDel, handlePlaylistName, playlistName, tracks } = props;
  let playlistTrackKey = 1;

  return (
    <div>
      <input type="text" value={playlistName} onChange={handlePlaylistName}/>
      {tracks.length === 0 ? <p></p> : tracks.map((track) => {
        return (
          <div key={`playlistTrackKey${playlistTrackKey++}`}>
            <p>{track.title}</p>
            <p>{track.artist} | {track.album}</p>
            <button data-trackid={track.id} onClick={handlePlaylistDel}>-</button>
          </div>
        );
      })}
      <SaveToSpotifyButton title={playlistName} tracks={tracks}/>
    </div>
  );
};

export default Playlist;