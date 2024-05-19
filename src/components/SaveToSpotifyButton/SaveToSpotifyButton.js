import React from 'react';
import './SaveToSpotifyButton.css';

function SaveToSpotifyButton ({ savePlaylistToSpotify }) {

    return (
      <div className='save-to-spotify-button'>
        <button onClick={savePlaylistToSpotify}>SAVE TO SPOTIFY</button>
      </div>
    );
    
};

export default SaveToSpotifyButton;