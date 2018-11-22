import React, { Component } from 'react';
import './App.css';
import Header from './components/header';
import Newslist from './components/newslist';

const API = 'https://newsapi.org/v2/';
const KEY = '&apiKey=f0c7756f333948cf8fe88ae2896cc1f3'; 

let DEFAULT_QUERY = 'top-headlines?q=world';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      news: []
    }
  }

  componentDidMount(){
    fetch(API + DEFAULT_QUERY + KEY)
    .then(response => response.json())
    .then(data => this.setState({news: data.articles}));
  }

  render() {

   const { news} = this.state;

    console.log(this.state.news);
    return (
      <div className="App">
        <Header/>
        <Newslist news={news}/>
      </div>
    );
  }
}

export default App;
