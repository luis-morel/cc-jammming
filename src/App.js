// import logo from './logo.svg'; // create-react-app default
// import './App.css'; // create-react-app default
import React, { useState } from 'react';
import spotifyApi from './utils/spotifyApi';
import Playlist from './components/Playlist/Playlist';
import SearchResults from './components/SearchResults/SearchResults';

function App() {

  const getUrlHashParams = () => {
    let regEx = /([^&;=]+)=?([^&;]*)/g;
    let results;
    let urlHash = window.location.hash.substring(1);
    let urlHashParams = {};

    while (results = regEx.exec(urlHash)) {
      urlHashParams[results[1]] = decodeURIComponent(results[2]);
    };

    return urlHashParams;
  };

  const [searchResults, setSearchResults] = useState(spotifyApi.apiData);

  const [playlistName, setPlaylistName] = useState('');
  const handlePlaylistName = (event) => {
    setPlaylistName((prevPlaylistName) => event.target.value);
  };

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const handlePlaylistAdd = (event) => setPlaylistTracks((prevPlaylistTracks) => {
    const playlistTrackUri = event.target.dataset.trackuri;
    const playlistTrack = { ...searchResults.filter((track) => track.uri === playlistTrackUri)[0] };
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
  const handlePlaylistSaveToSpotify = (event) => {
    const trackCount = playlistTracks.length;

    if (trackCount > 0) {
      const playlistTrackUris = playlistTracks.map((track) => track.uri);

      console.log('Playlist Track URIs:', playlistTrackUris);

      if (playlistName === '') {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();

        if (hour < 10) { hour = `0${hour}`; };
        if (minute < 10) { minute = `0${minute}`; };

        const newPlaylistName = `Playlist-${year}-${month}-${day}-${hour}-${minute}`;

        setPlaylistName((prevPlaylistName) => newPlaylistName);
      };

      if (Date.now() > spotifyToken.expiresAt) { spotifyApi.requestUserAuth(spotifyAuthStateKey); }
      else {
        // Spotify API call: Add playlist to Spotify
        setPlaylistName((prevPlaylistName) => '');
        setPlaylistTracks((prevPlaylistTracks) => []);
      };
    };
  };

  let currentTime = Date.now();
  let spotifyToken = getUrlHashParams();
  let spotifyAuthStateKey = 'spotifyAuthState';
  let spotifyAuthState = localStorage.getItem(spotifyAuthStateKey);

  if (spotifyToken.access_token) {
    if (spotifyAuthState === spotifyToken.state) {
      spotifyToken.expiresAt = currentTime + ((spotifyToken.expires_in - 5) * 1000);
      handlePlaylistSaveToSpotify();
    } else {
      console.log('Spotify authorization error; reauthorizing');
      spotifyApi.requestUserAuth(spotifyAuthStateKey);
    };
  };

  return (
    <div>
      <SearchResults
        handlePlaylistAdd={handlePlaylistAdd}
        tracks={searchResults}
      />
      <Playlist
        handlePlaylistDel={handlePlaylistDel}
        handlePlaylistName={handlePlaylistName}
        handlePlaylistSaveToSpotify={handlePlaylistSaveToSpotify}
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
