import React from 'react';
import SaveToSpotifyButton from '../SaveToSpotifyButton/SaveToSpotifyButton';
import Track from '../Track/Track.js';
import './Playlist.css';

function Playlist(props) {

  const {
    handlePlaylistDel,
    handlePlaylistName,
    handlePlaylistSaveToSpotify,
    playlistName,
    tracks
  } = props;

  return (
    <div className='playlist-container'>
      <div className='playlist-input'>
        <input
          onChange={handlePlaylistName}
          placeholder='Name your playlist'
          type="text"
          value={playlistName}
        />
      </div>
      <div className='playlist-track-container'>
        {tracks.length === 0 ? <p></p>
          :
          tracks.map((track) => {
            return (
              <Track
                handlePlaylistDel={handlePlaylistDel}
                key={`${track.uri}-${Math.floor(Math.random() * 10000000)}`}
                track={track}
                type={'playlist'}
              />
            )
          })
        }
      </div>
      <SaveToSpotifyButton savePlaylistToSpotify={handlePlaylistSaveToSpotify} title={playlistName} tracks={tracks} />
    </div>
  );

};

export default Playlist;