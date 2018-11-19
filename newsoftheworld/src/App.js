import React, { Component } from 'react';
import './App.css';
import Header from './components/header';
import Newslist from './components/newslist';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Newslist/>
      </div>
    );
  }
}

export default App;
