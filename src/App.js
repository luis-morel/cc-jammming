import React, { useEffect, useState } from 'react';
import spotifyApi from './utils/spotifyApi';
import Playlist from './components/Playlist/Playlist';
import SearchBar from './components/SearchBar/SearchBar';
import SearchButton from './components/SearchButton/SearchButton';
import SearchResults from './components/SearchResults/SearchResults';

function App() {

  const spotifyAuthStateKey = 'spotifyAuthState';
  let spotifyAuthState = sessionStorage.getItem(spotifyAuthStateKey);
  const spotifySearchInputKey = 'spotifySearchInput';
  let spotifySearchInput = sessionStorage.getItem(spotifySearchInputKey);
  const spotifyTokenExpiresAtKey = 'spotifyTokenExpiresAt';
  let spotifyTokenExpiresAt = sessionStorage.getItem(spotifyTokenExpiresAtKey);

  function getUrlHashParams() {
    let regEx = /([^&;=]+)=?([^&;]*)/g;
    let results;
    let urlHash = window.location.hash.substring(1);
    let urlHashParams = {};

    while (results = regEx.exec(urlHash)) {
      urlHashParams[results[1]] = decodeURIComponent(results[2]);
    };

    return urlHashParams;
  };

  function verifySpotifyToken(spotifyToken) {
    if (spotifyToken.access_token) {
      if (spotifyAuthState === spotifyToken.state) {
        const currentTime = Date.now();
        if (!spotifyTokenExpiresAt) {
          console.log('Setting Spotify access token expiration timestamp.');
          const requestedAt = currentTime - 2000;
          sessionStorage.setItem(spotifyTokenExpiresAtKey, requestedAt + spotifyToken.expires_in * 1000);
          return true;
        } else if (currentTime < spotifyTokenExpiresAt) {
          return true;
        } else {
          console.log('Spotify access token expired.');
          return false;
        }
      } else {
        console.log('Spotify access token state verification failed.');
        return false;
      };
    };
    return false;
  };

  const spotifyToken = getUrlHashParams();

  const [searchInput, setSearchInput] = useState('');
  function handleSearchInput(event) {
    setSearchInput((prevSearchInput) => event.target.value);
  };

  const [searchResults, setSearchResults] = useState(spotifyApi.apiData);
  
  useEffect(() => {
    if (spotifySearchInput) {
      updateSearch();
    };
  }, []);

  async function updateSearch () {
    if (spotifySearchInput) {
      if (verifySpotifyToken(spotifyToken)) {
        const newSpotifyTracks = await spotifyApi.search(spotifySearchInput, spotifyToken.access_token);
        console.log('newSpotifyTracks:\n', newSpotifyTracks);
        setSearchResults((prevSearchResults) => newSpotifyTracks ? newSpotifyTracks : spotifyApi.apiData);
        // Save tracks to sessionStorage?
      } else {
        console.log('Requesting Spotify user authorization');
        spotifyApi.requestUserAuth(spotifyAuthStateKey);
      };
    };
  };

  function handleApiSearch (event) {
    if (searchInput) {
      spotifySearchInput = searchInput;
      sessionStorage.setItem(spotifySearchInputKey, searchInput);
      updateSearch();
    } else {
      console.log('Spotify search input is required.');
      alert('Spotify search input is required.');
    };
  };

  const [playlistName, setPlaylistName] = useState('');
  function handlePlaylistName(event) {
    setPlaylistName((prevPlaylistName) => event.target.value);
  };

  const [playlistTracks, setPlaylistTracks] = useState([]);
  function handlePlaylistAdd(event) {
    setPlaylistTracks((prevPlaylistTracks) => {
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
  };
  function handlePlaylistDel(event) {
    setPlaylistTracks((prevPlaylistTracks) => {
      const playlistTrackIndex = parseInt(event.target.dataset.trackindex);
      const newPlaylist = prevPlaylistTracks.filter((track) => track.playlistTrackIndex !== playlistTrackIndex);
      return newPlaylist;
    });
  };

  function handlePlaylistSaveToSpotify(event) {
    const trackCount = playlistTracks.length;

    if (trackCount > 0) {
      const playlistTrackUris = playlistTracks.map((track) => track.uri);

      console.log('Playlist Track URIs:', playlistTrackUris);

      if (playlistName === '') {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();

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

  return (
    <div>
      <SearchBar
        handleSearchInput={handleSearchInput}
      />
      <SearchButton
        handleApiSearch={handleApiSearch}
      />
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

}; // end of function App()

export default App;
