import React, { Component } from 'react';
import './App.css';
import MemoryBlock from './components/memoryblock';

class App extends Component {

  constructor (props){
    super(props);
    this.state = {
      pair: [],      
      memoryBlocks: [
        { id: 1, isFront: false },
        { id: 2, isFront: false },
        { id: 3, isFront: false },
        { id: 4, isFront: false },
        { id: 5, isFront: false },
        { id: 6, isFront: true },
        { id: 7, isFront: false },
        { id: 8, isFront: false },
      ]
    }
  }

 flipCard = (idofCard) =>{

   
   
  const memoryBlocks = [...this.state.memoryBlocks];

   
  

   if (this.state.memoryBlocks[idofCard - 1].isFront === true) {
      memoryBlocks[idofCard - 1].isFront = false;   
   }
   else {
     memoryBlocks[idofCard - 1].isFront = true;
   }

   
   
   
   if (this.state.pair.length < 2) {
     let pair = this.state.pair;
     console.log(this.state.pair.length);
     if (this.state.pair.length === 1) {

      pair[1] = idofCard;
     }

    else {
      pair[0] = idofCard;
    }
     this.setState({ pair: pair });                     
     
   }
   else {
     console.log("third click",idofCard, this.state.pair[0]);
     this.state.pair[0] = this.state.pair[1]; 
     this.state.pair[1] = idofCard;          
     let memoryBlocks = this.state.memoryBlocks;
     console.log("milan bhai help " + this.state.pair[0]);
     memoryBlocks[this.state.pair[0] - 1].isFront = false;
    
     let newValue = memoryBlocks[this.state.pair[0] - 1].isFront;
     let valuee = this.state.memoryBlocks[this.state.pair[0] - 1];
     let oldvalue = memoryBlocks[idofCard - 1];
   console.log("new value is " + newValue);
     this.setState({ oldvalue: valuee });                     

    
     
   }

   this.setState({ memoryBlocks });
    
 }
  
  render() {

    const { memoryBlocks, pair} = this.state;


    return (
      <div className="App">
        <div className="canvas">

        {memoryBlocks.map(memoryBlock=>
            <MemoryBlock memoryBlocks={memoryBlocks} id={memoryBlock.id} isFront={memoryBlock.isFront} key={memoryBlock.id} pair={pair} flipCard={this.flipCard}/>
        )}
        </div>
        
      </div>
    );
  }
}

export default App;
