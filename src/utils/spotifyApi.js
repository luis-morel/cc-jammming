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
  requestUserAuth: () => {
    const baseUrl = 'https://accounts.spotify.com/authorize';
    const clientId = '126cea50d70246a089f8210a36bc82f0';
    const redirectUri = 'http://localhost:3000/';
    const scope = 'playlist-modify-private playlist-modify-public';
    const stateKey = 'spotifyAuthState';

    const state = generateRandomString(16);
    localStorage.setItem(stateKey, state);

    let queryUrl = baseUrl;
    queryUrl += '?response_type=token';
    queryUrl += '&client_id=' + encodeURIComponent(clientId);
    queryUrl += '&scope=' + encodeURIComponent(scope);
    queryUrl += '&redirect_uri=' + encodeURIComponent(redirectUri);
    queryUrl += '&state=' + encodeURIComponent(state);

    window.location = queryUrl;
  }
}