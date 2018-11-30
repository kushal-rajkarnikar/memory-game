import React, { Component } from 'react';
import './App.css';
import MemoryBlock from './components/memoryblock';
import LiveChat from 'react-livechat'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

class App extends Component {
  
  constructor (props){    
    
    super(props);
    this.state = {
      initializeGame: false,
      numberofBlocks: 8,
      icons: ["ad","address-book","address-card","adjust","air-freshener","align-center","align-justify","align-left","align-right","allergies","ambulance","american-sign-language-interpreting","anchor","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","angry","ankh","apple-alt","archive","archway","arrow-alt-circle-down","arrow-alt-circle-left","arrow-alt-circle-right","arrow-alt-circle-up","arrow-circle-down","arrow-circle-left"],
      pair: [],      
      memoryBlocks: []
    }

    this.setNumberofBlocks = this.setNumberofBlocks.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  setNumberofBlocks(event){

    let memoryBlocks = this.state.memoryBlocks;

    let arrayOfRandomNumbers = [];
        
    for (let counter = 0; counter < this.state.numberofBlocks; counter++) {
      
      let iconSet=[];

      if (counter >= this.state.numberofBlocks/2){
        iconSet = { id: counter, status: "back", icon: this.state.icons[counter - this.state.numberofBlocks / 2] };
      }
      else{
          iconSet = { id: counter, status: "back", icon: this.state.icons[counter] };
      }
            

      let randomNumber = Math.floor((Math.random() * this.state.numberofBlocks) + 1) - 1;

      // let checkifRandom = () => {
      //   if (arrayOfRandomNumbers.includes(randomNumber)){
      //     arrayOfRandomNumbers.push(randomNumber);
      //   }
      // }

      

      console.log(randomNumber);

      if (memoryBlocks[randomNumber] == null){
          memoryBlocks[randomNumber] = iconSet;
      }

      

      // memoryBlocks.push(iconSet);
    }   

    this.setState({ initializeGame: true, memoryBlocks: memoryBlocks });     
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({numberofBlocks: parseInt(event.target.value)});
  }
  
  
  flipCard = (idofCard) =>{
    

    
    let memoryBlocks = [...this.state.memoryBlocks];
       
    console.log(idofCard);
    
    if (this.state.memoryBlocks[idofCard].status === "front") {
      memoryBlocks[idofCard].status = "back";   
    }
    else {
      memoryBlocks[idofCard].status = "front";
    }
    
    this.setState({ memoryBlocks });
    
    if (this.state.pair.length < 2) {
      let pair = this.state.pair;
      
      pair.push(idofCard)
      
      this.setState({ pair: pair }); 
      
      if (this.state.pair.length === 2){
        
        if (memoryBlocks[this.state.pair[0] - 1] != memoryBlocks[this.state.pair[1] - 1]){
          
          let memoryBlocks = this.state.memoryBlocks;
          
          if (this.state.memoryBlocks[this.state.pair[0]].icon === this.state.memoryBlocks[this.state.pair[1]].icon){        
            setTimeout(() => {
              memoryBlocks[this.state.pair[0]].status = "matched";
              memoryBlocks[this.state.pair[1]].status = "matched";
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
      
      memoryBlocks[idofCard].status = "front";
      
      
      
      
      let pair = this.state.pair;
      pair.shift();
      pair.shift();
      pair.push(idofCard);
      
      
      this.setState({memoryBlocks, pair});        
      
    }
    
    
    
    
    
  }
  
  
  render() {

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
      