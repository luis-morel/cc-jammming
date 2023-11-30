// import logo from './logo.svg'; // create-react-app default
// import './App.css'; // create-react-app default
import React, { useState } from 'react';
import { apiData } from './utils/spotifyApi';
import Playlist from './components/Playlist/Playlist';
import SearchResults from './components/SearchResults/SearchResults';

function App() {
  const [searchResults, setSearchResults] = useState(apiData);

  const [playlistName, setPlaylistName] = useState('');
  const handlePlaylistName = (event) => {
    setPlaylistName((prevPlaylistName) => event.target.value);
  };

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const handlePlaylistAdd = (event) => setPlaylistTracks((prevTracks) => {
    const trackIndex = parseInt(event.target.dataset.trackid) - 1;
    return [...prevTracks, searchResults[trackIndex]];
  });
  const handlePlaylistDel = (event) => setPlaylistTracks((prevTracks) => {
    const trackIndex = parseInt(event.target.dataset.trackid);
    return prevTracks.filter((track) => track.id !== trackIndex);
  });
  
  return (
    <div>
      <SearchResults
        handlePlaylistAdd={handlePlaylistAdd}
        tracks={searchResults} 
      />
      <Playlist
        handlePlaylistDel={handlePlaylistDel}
        handlePlaylistName={handlePlaylistName}
        playlistName={playlistName}
        tracks={playlistTracks} 
      />
    </div>
  );

  /* create-react-app default
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  ); */

};

export default App;
