import React, { Component } from "react";
import Counter from './counter';

class Counters extends Component {

    formStyles = {        
        border: "1px solid #ddd",
        padding: "15px",
        maxWidth: "360px",
        marginBottom: "10px",
        marginTop: "10px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    };


    render(){        

        const { counters, addNewCounter, onReset, onDelete, doIncrement, doDecrement} = this.props;

        return (<div>

            <form style={this.formStyles}>
                {/* <input type="number" className="form-control"/>
                <input type="text" className="form-control" /> */}
                {/* <a style={{ color: "white" }} onClick={addNewCounter} className="btn btn-secondary btn-danger btn-sm m-2">Add</a> */}
                <a style={{ color: "white"}} onClick={onReset} className="btn btn-info btn-sm m-2">Clear All Items</a>
            </form>
            
            
            { counters.map(counter=>                
                <Counter key={counter.id} counter={counter} onDelete={onDelete} doIncrement={doIncrement} doDecrement={doDecrement}>
                {/* <h4>{counter.title}</h4> */}
            </Counter>)}
            </div>);
        }
    }
    
    export default Counters;