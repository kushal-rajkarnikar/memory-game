import React, {Component} from 'react';

// Stateless Functional Component

const NavBar = ({ totalNumberofItemsInCart, totalPrice}) => {
    return(
    <div className="navbar navbar-dark fixed-top bg-dark shadow-sm" style={{paddingLeft: 0, paddingRight: 0}}>
        <div className="container">
            
                <strong className="navbar-brand d-flex align-items-center" style={{ fontSize: "16px", marginRight: "5px"}}>Cart</strong>
                <span className="badge badge-danger badge-pill" style={{ fontWeight: "bold", marginRight: "auto" }}>{totalNumberofItemsInCart}</span>            

                <div class="d-flex" style={{marginLeft: "auto"}}>
                    <strong className="navbar-brand d-flex" style={{ fontSize: "16px", marginRight: 0 }}>Total Price: Rs.{totalPrice}</strong>                    
                </div>

        </div>
    </div>
    );
};

// Class Definiftion for a component with no state or other functions 

// class NavBar extends Component {
//     render(){
//         console.log("the total is : " + this.props.totalCounters);
                
//         return(
//             <div className="navbar navbar-dark bg-dark shadow-sm">
//                 <div className="container">                    
//                         <strong className="navbar-brand d-flex align-items-center">Cart</strong>
//                         <span className="badge badge-danger badge-pill" style={{fontWeight: "bold", marginRight: "auto"}}>0</span>                    
//                 </div>
//             </div>
//         );
//     }
// }

export default NavBar;