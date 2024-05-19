// Front-End Spotify API

let generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default {
  addTracksToPlaylist: async (tracks, playlistId, token) => {
    const baseUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    let playlistUpdated = false;

    await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: tracks
      })
    }).then((response) => {
      if (response.ok) {
        return response.json();
      };
      throw new Error('Failed to add tracks to Spotify playlist.');
    }).then((data) => {
      console.log(`Spotify playlist snapshot id: ${data.snapshot_id}`);
      playlistUpdated = true;
    }).catch((error) => {
      console.log(error);
    });

    return playlistUpdated;
  },
  createPlaylist: async (playlistName, userId, token) => {
    const baseUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;

    let spotifyPlaylistId = '';

    await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playlistName,
        description: playlistName,
        public: false
      })
    }).then((response) => {
      if (response.ok) {
        return response.json();
      };
      throw new Error('Failed to create Spotify playlist.');
    }).then((data) => {
      console.log(`Spotify playlist id: ${data.id}`);
      spotifyPlaylistId = data.id;
    }).catch((error) => {
      console.log(error);
    });

    return spotifyPlaylistId;
  },
  getUserId: async (token) => {
    const baseUrl = 'https://api.spotify.com/v1/me'

    let spotifyUserId = '';

    await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      };
      throw new Error('Failed to get Spotify user id.');
    }).then((data) => {
      console.log(`Spotify user id: ${data.id}`);
      spotifyUserId = data.id;
    }).catch((error) => {
      console.log(error);
    });

    return spotifyUserId;
  },
  requestUserAuth: (spotifyAuthStateKey) => {
    const baseUrl = 'https://accounts.spotify.com/authorize';
    const clientId = '126cea50d70246a089f8210a36bc82f0';
    const redirectUri = 'http://localhost:3000/';
    const scope = 'playlist-modify-private playlist-modify-public user-read-email user-read-private';

    const state = generateRandomString(16);
    sessionStorage.setItem(spotifyAuthStateKey, state);

    let queryUrl = baseUrl;
    queryUrl += '?response_type=token';
    queryUrl += '&client_id=' + encodeURIComponent(clientId);
    queryUrl += '&scope=' + encodeURIComponent(scope);
    queryUrl += '&redirect_uri=' + encodeURIComponent(redirectUri);
    queryUrl += '&state=' + encodeURIComponent(state);

    window.location = queryUrl;
  },
  search: async (query, token) => {
    const baseUrl = 'https://api.spotify.com/v1/search?';    
    let queryUrl = baseUrl;
    queryUrl += `q=${encodeURIComponent(query)}`;
    queryUrl += '&type=track';

    const spotifyTracks = [];

    await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      };
      throw new Error('Spotify search API call failed.');
    }).then((data) => {
      console.log('Spotify search API response data:\n\n', data);      
      data.tracks.items.forEach(track => {
        const artists = track.artists.map(artist => artist.name).join(", ");
        spotifyTracks.push({
          uri: track.uri,
          album: track.album.name,
          title: track.name,
          artist: artists
        }); 
      });
    }).catch((error) => {
      console.log(error);
    });

    return spotifyTracks;
  }
};