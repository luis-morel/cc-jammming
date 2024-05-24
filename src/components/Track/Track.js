import React from 'react';
import './Track.css';

function Track({ handlePlaylistAdd, handlePlaylistDel, track, type }) {
  const buttonText = type === 'playlist' ? '–' : '+';

  return (
    <div className='spotify-track-container'>
      <div className='spotify-track'>
        <p className='spotify-track-title'>{track.title}</p>
        <p className='spotify-track-artist-album'>{track.artist} | {track.album}</p>
      </div>
      {type === 'playlist'
        ?
        <div className='spotify-track-button'>
          <button data-trackindex={track.playlistTrackIndex} onClick={handlePlaylistDel}>{buttonText}</button>
        </div>
        :
        <div className='spotify-track-button'>
          <button data-trackuri={track.uri} onClick={handlePlaylistAdd}>{buttonText}</button>
        </div>
      }
    </div>
  );
};

export default Track;