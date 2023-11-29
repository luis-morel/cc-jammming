// import logo from './logo.svg'; // create-react-app default
// import './App.css'; // create-react-app default
import React from 'react';
import SearchResults from './components/SearchResults/SearchResults';

function App() {
  const songs = [{
    album: 'Jordi',
    title: 'Memories',
    artist: 'Maroon 5'
  },
  {
    album: 'Rave & Roses',
    title: 'Calm Down',
    artist: 'Rema'
  },
  {
    album: 'Speak Now (Taylor\'s Version)',
    title: 'Back To December',
    artist: 'Taylor Swift'
  },
  {
    album: 'Lover',
    title: 'Lover',
    artist: 'Taylor Swift'
  },
  {
    album: 'Promises and Lies',
    title: '(I Can\'t Help) Falling In Love With You',
    artist: 'UB40'
  },
  {
    album: 'Labour of Love',
    title: 'Red Red Wine',
    artist: 'UB40'
  }];

  return (
    <div>
      <SearchResults songs={songs} />
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
  );
  */
};

export default App;
