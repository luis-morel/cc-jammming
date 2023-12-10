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
  const handlePlaylistAdd = (event) => setPlaylistTracks((prevPlaylistTracks) => {
    const playlistTrackId = parseInt(event.target.dataset.trackid);
    const playlistTrack = { ...searchResults.filter((track) => track.id === playlistTrackId)[0] };
    playlistTrack.playlistTrackIndex = prevPlaylistTracks.length;
    let newPlaylist = prevPlaylistTracks.map((track, i) => {
      track.playlistTrackIndex = i;
      return track;
    });    
    newPlaylist = [...prevPlaylistTracks, playlistTrack];
    return newPlaylist;
  });
  const handlePlaylistDel = (event) => setPlaylistTracks((prevPlaylistTracks) => {
    const playlistTrackIndex = parseInt(event.target.dataset.trackindex);
    const newPlaylist = prevPlaylistTracks.filter((track) => track.playlistTrackIndex !== playlistTrackIndex);
    return newPlaylist;
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
