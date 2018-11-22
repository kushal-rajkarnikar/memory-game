 import React, { Component } from 'react';

class Counter extends Component {    
    // state = {
    //     count: this.props.counter.value        
    // };

    styles = {
        fontSize: 24,
        fontWeight: "bold", // css properties in camelcase notations        
        border: "1px solid #ddd",
        padding: "15px",
        maxWidth: "360px",
        marginBottom: "10px",
        marginTop: "10px",
        marginLeft: "auto",
        marginRight: "auto"        
    };

    // constructor(){
    //     super();
    //     this.handleIncrement = this.handleIncrement.bind(this);
    // }

    // handleIncrement = () => {
    //     // console.log(product)
    //     // console.log('Increment Clicked!', ++this.state.count);
    //     this.setState({ count: this.state.count + 1 });
    //     // this.state.count++;
    // }

    // dohandleIncrement = () =>{
    //     this.handleIncrement({ id: 1});
    // }

    // handleDecrement = () => {
    //     this.setState({ count: this.state.count -  1});
    // }
    

    render() {         

        return (
            <div style={ this.styles }>            
                                             
                <h4>
                { this.props.counter.title }
                    <span className={this.getBadgeClasses()} style={{marginLeft: "10px"}}> {this.formatCount()}</span>
                </h4>
                
                <h5>
                    Rs. {this.props.counter.price}
                </h5>                
                
            
            <button onClick={() => this.props.doIncrement(this.props.counter)} className="btn btn-secondary btn-success btn-sm" style = {{ marginRight: 10}}>Increment</button>            
            <button onClick={() => this.props.doDecrement(this.props.counter)} className="btn btn-dark btn- btn-sm">Decrement</button>
            <button onClick={() => this.props.onDelete(this.props.counter.id)} className="btn btn-danger btn-sm m-2">Delete</button>
            </div>
        );
    }

    getBadgeClasses() {
        let classes = "badge m2 badge-";
        classes += (this.props.counter.value === 0 ? "warning" : "primary");
        return classes;
    }

    formatCount(){        
        const count = this.props.counter.value;        
        return count === 0 ? 'Zero' : count;
    }
}
export default Counter;