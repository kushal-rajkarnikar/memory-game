import React, { Component } from 'react';
import NavBar from './components/navbar';
import Counters from './components/counters';

class App extends Component {

  state = {
    counters: [
      { id: 1, value: 4, title: 'Samsung Galaxy Note 9', price: '105000' },
      { id: 2, value: 0, title: 'One Plus 6T', price: '70000' },
      { id: 3, value: 1, title: 'iPhone X', price: '167000' },
      { id: 4, value: 2, title: 'Xiaomi Mi A2', price: '30999' },
    ]
  }

  handledelete = (counterId) => {
    const counters = this.state.counters.filter(c => c.id !== counterId);
    this.setState({ counters: counters });

    console.log('Event Handler has been succesfully called: ' + counterId);
  }

  handleDecrement = counter => {
    const counters = [ ...this.state.counters];
    const index = counters.indexOf(counter);

    counters[index] = {...counter};

    if (counters[index].value > 0){
      counters[index].value--;
    }
    else{
      alert("Product Quantity can't be less than zero duh!");
    }

    this.setState({ counters });

  }

  handleIncrement = counter => {    

    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);

    counters[index] = { ...counter };
    counters[index].value++;

    this.setState({ counters });
    
  }

  addNewCounter = () => {
    // console.log("Add new");
    const counters = this.state.counters;
    counters.push({ id: counters.length, value: 2, title: "adsf" });
    this.setState({ counters });
  }

  resetAllCounters = () => {
    // console.log("reset");
    const counters = this.state.counters.map(c => {
      c.value = 0;
      return c;
    });

    this.setState({ counters });

  }

  render() {
    const {counters} =  this.state;
      
    let total = counters.map(c=>c.value).reduce((a, b) => a + b, 0);

    let price = counters.map(c=>c.value * c.price).reduce((a,b) => a + b, 0);     
     
    return (
      <React.Fragment>
        <NavBar totalNumberofItemsInCart = {total} totalPrice = { price }/>
        <main class="container">
        <Counters counters = {this.state.counters} onDelete={this.handledelete} doIncrement={this.handleIncrement} doDecrement={this.handleDecrement} onReset={this.resetAllCounters}/>        
        </main>
      </React.Fragment>
    );
  }
}

export default App;
