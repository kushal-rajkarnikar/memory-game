import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class MemoryBlock extends Component {

    state = {
        status: this.props.status,
    }

    getClass (){
        
        if (this.props.status === "front") {
            return "card"
        }
        else if (this.props.status === "back") {
            return "card is-flipped"
        }
        else if (this.props.status === "matched") {
            return "card matched"
        }
    }

    flipCard = (idofCard) => {
      
        this.props.flipCard(idofCard);


        if (this.state.status === "front") {
            let status = "back";
            this.setState({ status });                   
        }
        else {
            let status = "front";
            this.setState({ status });            
        }
    }
     
  render() {
    return (

        <div className="scene scene--card">
            <div onClick={()=>this.flipCard(this.props.id)} className={this.getClass()}>
                <div className="card__face card__face--front">
                <FontAwesomeIcon icon={this.props.icon} />
                </div>
                <div className="card__face card__face--back">
                   
                </div>
            </div>
        </div>
    )
  }
}

export default MemoryBlock;