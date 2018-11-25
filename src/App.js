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

      let memoryBlocks = this.state.memoryBlocks;

      if (this.state.memoryBlocks[this.state.pair[0] - 1].icon === this.state.memoryBlocks[this.state.pair[1] - 1].icon){        
        setTimeout(() => {
          memoryBlocks[this.state.pair[0] - 1].status = "matched";
          memoryBlocks[this.state.pair[1] - 1].status = "matched";
          let pair = this.state.pair;
          pair.length = 0;
          this.setState({pair});  
        },1000)
        
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

    const { memoryBlocks, pair} = this.state;


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
}

export default App;
