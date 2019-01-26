import React, { Component } from 'react';
import SignUp from './pages/signup/SingUp';
import NewPost from './pages/posts/NewPost';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>welcome to world wide!</h1>
        </header>
        <SignUp />
        <NewPost />
      </div>
    );
  }
}

export default App;
