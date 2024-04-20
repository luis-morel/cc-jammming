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
  apiData: [
    {
      uri: 'spotify:track:101',
      album: 'Jordi',
      title: 'Memories',
      artist: 'Maroon 5'
    },
    {
      uri: 'spotify:track:102',
      album: 'Rave & Roses',
      title: 'Calm Down',
      artist: 'Rema'
    },
    {
      uri: 'spotify:track:103',
      album: 'Speak Now (Taylor\'s Version)',
      title: 'Back To December',
      artist: 'Taylor Swift'
    },
    {
      uri: 'spotify:track:104',
      album: 'Lover',
      title: 'Lover',
      artist: 'Taylor Swift'
    },
    {
      uri: 'spotify:track:105',
      album: 'Promises and Lies',
      title: '(I Can\'t Help) Falling In Love With You',
      artist: 'UB40'
    },
    {
      uri: 'spotify:track:106',
      album: 'Labour of Love',
      title: 'Red Red Wine',
      artist: 'UB40'
    }
  ],
  requestUserAuth: (spotifyAuthStateKey) => {
    const baseUrl = 'https://accounts.spotify.com/authorize';
    const clientId = '126cea50d70246a089f8210a36bc82f0';
    const redirectUri = 'http://localhost:3000/';
    const scope = 'playlist-modify-private playlist-modify-public';

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