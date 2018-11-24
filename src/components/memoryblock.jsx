import React, { Component } from 'react'

class MemoryBlock extends Component {

    constructor(props){
        super(props);
    }

    state = {
        isFront: this.props.isFront,
    }

    getClass (){
        // console.log("this is " + this.props.isFront);
        if (this.props.isFront === true) {
            return "card"
        }
        else {
            return "card is-flipped"
        }
    }

    flipCard = (idofCard) => {
      
        this.props.flipCard(idofCard);


        if (this.state.isFront === true) {
            let isFront = false;
            this.setState({ isFront });                   
        }
        else {
            let isFront = true;
            this.setState({ isFront });            
        }
    }
     
  render() {
    return (

        <div className="scene scene--card">
            <div onClick={()=>this.flipCard(this.props.id)} className={this.getClass()}>
                <div className="card__face card__face--front">front {this.props.id}</div>
                <div className="card__face card__face--back">back {this.props.id}</div>
            </div>
        </div>
    )
  }
}

export default MemoryBlock;