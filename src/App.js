import React, { useEffect, useState } from 'react';
import spotifyApi from './utils/spotifyApi';
import Playlist from './components/Playlist/Playlist';
import SearchBar from './components/SearchBar/SearchBar';
import SearchButton from './components/SearchButton/SearchButton';
import SearchResults from './components/SearchResults/SearchResults';
import './App.css';

function App() {

  const spotifyAuthStateKey = 'spotifyAuthState';
  const spotifyPlaylistNameKey = 'spotifyPlaylistName';
  const spotifyPlaylistTracksUrisKey = 'spotifyPlaylistTracksUris';
  const spotifySearchInputKey = 'spotifySearchInput';
  const spotifyTokenExpiresAtKey = 'spotifyTokenExpiresAt';
  let spotifyAuthState = sessionStorage.getItem(spotifyAuthStateKey);
  let spotifyPlaylistName = sessionStorage.getItem(spotifyPlaylistNameKey);
  let spotifyPlaylistTracksUris = sessionStorage.getItem(spotifyPlaylistTracksUrisKey);
  let spotifySearchInput = sessionStorage.getItem(spotifySearchInputKey);
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

  const [searchResults, setSearchResults] = useState([]);

  async function updateSearch() {
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

  useEffect(() => {
    if (spotifySearchInput) {
      updateSearch();
    };
  }, []);

  function handleApiSearch(event) {
    event.preventDefault();
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
    event.preventDefault();
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
    event.preventDefault();
    setPlaylistTracks((prevPlaylistTracks) => {
      const playlistTrackIndex = parseInt(event.target.dataset.trackindex);
      const newPlaylist = prevPlaylistTracks.filter((track) => track.playlistTrackIndex !== playlistTrackIndex);
      return newPlaylist;
    });
  };

  async function savePlaylistToSpotify(playlistName, playlistTrackUris) {
    const spotifyUserId = await spotifyApi.getUserId(spotifyToken.access_token);
    let spotifyPlaylistId;
    let spotifyPlaylistUpdated;

    if (spotifyUserId) {
      spotifyPlaylistId = await spotifyApi.createPlaylist(playlistName, spotifyUserId, spotifyToken.access_token);
      if (spotifyPlaylistId) {
        spotifyPlaylistUpdated = await spotifyApi.addTracksToPlaylist(playlistTrackUris, spotifyPlaylistId, spotifyToken.access_token);
        if (spotifyPlaylistUpdated) {
          console.log(`Playlist saved to Spotify.`);
          setPlaylistName((prevPlaylistName) => '');
          setPlaylistTracks((prevPlaylistTracks) => []);
          sessionStorage.setItem(spotifyPlaylistNameKey, '');
          sessionStorage.setItem(spotifyPlaylistTracksUrisKey, []);
        };
      };
    };
  };

  useEffect(() => {
    if (spotifyPlaylistName) {
      savePlaylistToSpotify(spotifyPlaylistName, spotifyPlaylistTracksUris);
    };
  }, []);

  function handlePlaylistSaveToSpotify(event) {
    event.preventDefault();

    if (playlistTracks.length > 0) {
      const playlistTrackUris = playlistTracks.map((track) => track.uri);
      sessionStorage.setItem(spotifyPlaylistTracksUrisKey, playlistTrackUris);
      console.log('Playlist Track URIs:', playlistTrackUris);

      let newPlaylistName = '';
      if (playlistName === '') {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();

        if (month < 10) { month = `0${month}` };
        if (day < 10) { day = `0${day}` };
        if (hour < 10) { hour = `0${hour}`; };
        if (minute < 10) { minute = `0${minute}`; };

        newPlaylistName = `Playlist-${year}${month}${day}-${hour}${minute}`;
      } else {
        newPlaylistName = playlistName;
      };

      sessionStorage.setItem(spotifyPlaylistNameKey, newPlaylistName);
      console.log(`Playlist name: ${newPlaylistName}`);

      if (verifySpotifyToken(spotifyToken)) {
        savePlaylistToSpotify(newPlaylistName, playlistTrackUris);
      } else {
        spotifyApi.requestUserAuth(spotifyAuthStateKey);
      }
    } else {
      alert('Please add tracks to your playlist');
    };;

  };

  return (
    <div>
      <header className='app-title'>
        <h1>ja<span>mmm</span>ing</h1>
      </header>
      <div>
        <SearchBar
          handleSearchInput={handleSearchInput}
        />
        <SearchButton
          handleApiSearch={handleApiSearch}
        />
      </div>
      <div className='search-playlist-container'>
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
      <footer><p>Background image by <a href="https://www.freepik.com/free-vector/gradient-karaoke-background_82457131.htm#query=music%20background&position=2&from_view=keyword&track=ais&uuid=f835707f-db50-4816-8f81-c44854e60050">Freepik</a></p>
      </footer>
    </div>
  );

}; // end of function App()

export default App;
