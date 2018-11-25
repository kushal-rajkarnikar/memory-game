import React, { Component } from 'react';
import './App.css';
import MemoryBlock from './components/memoryblock';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

class App extends Component {
  
  constructor (props){    
    
    super(props);
    this.state = {
      initializeGame: false,
      numberofBlocks: 8,
      icons: ["ad","address-book","address-card","adjust","air-freshener","align-center","align-justify","align-left","align-right","allergies","ambulance","american-sign-language-interpreting","anchor","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","angry","ankh","apple-alt","archive","archway","arrow-alt-circle-down","arrow-alt-circle-left","arrow-alt-circle-right","arrow-alt-circle-up","arrow-circle-down","arrow-circle-left","arrow-circle-right","arrow-circle-up","arrow-down","arrow-left","arrow-right","arrow-up","arrows-alt","arrows-alt-h","arrows-alt-v","assistive-listening-systems","asterisk","at","atlas","atom","audio-description","award","backspace","backward","balance-scale","ban","band-aid","barcode","bars","baseball-ball","basketball-ball","bath","battery-empty","battery-full","battery-half","battery-quarter","battery-three-quarters"],
      pair: [],      
      memoryBlocks: [
        { id: 1, status: "back", icon: "bicycle" },
        { id: 2, status: "back", icon: "battery-quarter" },
        { id: 3, status: "back", icon: "anchor" },
        { id: 4, status: "back", icon: "anchor" },
        { id: 5, status: "back", icon: "atom" },
        { id: 6, status: "back", icon: "battery-quarter" },
        { id: 7, status: "back", icon: "bicycle" },
        { id: 8, status: "back", icon: "atom" },
      ]
    }

    this.setNumberofBlocks = this.setNumberofBlocks.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setNumberofBlocks(event){
    
    this.setState({initializeGame: true });
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({numberofBlocks: parseInt(event.target.value)});
  }
  
  
  flipCard = (idofCard) =>{
    
    
    const memoryBlocks = [...this.state.memoryBlocks];
    
    
    
    
    if (this.state.memoryBlocks[idofCard - 1].status === "front") {
      memoryBlocks[idofCard - 1].status = "back";   
    }
    else {
      memoryBlocks[idofCard - 1].status = "front";
    }
    
    
    if (this.state.pair.length < 2) {
      let pair = this.state.pair;
      
      pair.push(idofCard)
      
      this.setState({ pair: pair }); 
      
      if (this.state.pair.length === 2){
        
        if (memoryBlocks[this.state.pair[0] - 1] != memoryBlocks[this.state.pair[1] - 1]){
          
          let memoryBlocks = this.state.memoryBlocks;
          
          if (this.state.memoryBlocks[this.state.pair[0] - 1].icon === this.state.memoryBlocks[this.state.pair[1] - 1].icon){        
            setTimeout(() => {
              memoryBlocks[this.state.pair[0] - 1].status = "matched";
              memoryBlocks[this.state.pair[1] - 1].status = "matched";
              let pair = this.state.pair;
              pair.length = 0;
              this.setState({pair});  
              
              let gameOver = memoryBlocks.every(areAllBlocksMatched);
              
              function areAllBlocksMatched(currentMemoryBlock){
                return currentMemoryBlock.status === "matched";
              }
              
              if (gameOver){
                setTimeout(() => {
                  alert("Game Over");
                }, 100)
              }
              
            },1000)
            
          }
        }
      }
      
      //  if (this.state.pair[0] === this.state.pair[1]){
      //   memoryBlocks[this.state.pair[0] - 1].
      //  }
      
    }
    
    else {
      
      
      
      let memoryBlocks = this.state.memoryBlocks;
      memoryBlocks.map(memoryBlock=>{
        if (memoryBlock.status!="matched"){
          memoryBlock.status = "back"
        }
      }
      
      );
      
      memoryBlocks[idofCard - 1].status = "front";
      
      
      
      
      let pair = this.state.pair;
      pair.shift();
      pair.shift();
      pair.push(idofCard);
      
      
      this.setState({memoryBlocks, pair});        
      
    }
    
    this.setState({ memoryBlocks });
    
    
    
  }
  
  
  render() {
    
    console.log("The icons are: " + this.state.icons);
    
    const { memoryBlocks, pair} = this.state;
    
    if (this.state.initializeGame){
      
      return (
        <div className="App">
        <div className="canvas">
        
        {memoryBlocks.map(memoryBlock=>
          <MemoryBlock memoryBlocks={memoryBlocks} id={memoryBlock.id} status={memoryBlock.status} key={memoryBlock.id} pair={pair} flipCard={this.flipCard} icon={memoryBlock.icon}/>
          )}
          </div>
          
          </div>
          );
          
        }
        
        else {
          return (
            <div className="home">
            <h1>Memory Game</h1>
            <br/><br/>
            <form onSubmit={this.setNumberofBlocks}>
            <label>
            <span>Select number of blocks:</span>
            <select value={this.state.numberofBlocks} onChange={this.handleChange}>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64</option>
            </select>
            <br/><br/>
            <input type="submit" value="START GAME"></input>
            </label>
            </form>           
            </div> 
            );
          }
        }
      }
      
      export default App;
      