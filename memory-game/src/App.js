import React, { Component } from 'react';
import './App.css';

class App extends Component {

    render() {
    return (
      <div className="App">
        <div className="scene scene--card">
          <div className="card">
            <div className="card__face card__face--front">front</div>
            <div className="card__face card__face--back">back</div>
          </div>
        </div>        
      </div>
    );
  }
}

export default App;
