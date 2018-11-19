import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (            
            <nav className="navbar navbar-default yamm navbar-fixed-top" role="navigation" id="inheadlines-navbar">
            <div className="container">            
            <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar top-bar"></span>
            <span className="icon-bar middle-bar"></span>
            <span className="icon-bar bottom-bar"></span>
            </button>            
            </div>
            
            
            <div className="collapse navbar-collapse navbar-ex1-collapse" id="navbar">
            
            
            <ul className="nav navbar-nav">
            <li className="dropdown yamm-fw">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" id="categories">Categories</a>
            <ul className="dropdown-menu">
            <div className="container narrow-container">
            <li><a href="#">all news</a></li>
            <li><a href="#">top stories</a></li>
            <li><a href="#">trending</a></li>
            <li><a href="#">national</a></li>
            <li><a href="#">captial</a></li>
            
            <li><a href="#">nepse</a></li>
            <li><a href="#">politics</a></li>
            <li><a href="#">business</a></li>
            <li><a href="#">economy</a></li>
            
            <li><a href="#">sports</a></li>
            <li><a href="#">technology</a></li>
            <li><a href="#">startups</a></li>
            <li><a href="#">energy</a></li>
            <li><a href="#">science</a></li>
            <li><a href="#">entertainment</a></li>
            <li><a href="#">travel</a></li>
            <li><a href="#">world</a></li>
            <li><a href="#">miscellaneous</a></li>
            </div>
            </ul>
            </li>
            </ul>
            
            <ul className="nav navbar-nav navbar-right">
            <li>
            <a href="https://play.google.com/store/apps/details?id=com.inheadline.news" target="_blank">
            <img src="images/googleplay.png" alt="" />
            </a>
            <a href="#" className="no-padding">
            company
            </a>
            </li>
            <li>
            <a href="https://itunes.apple.com/np/app/inheadline/id1115151854?mt=8" target="_blank">
            <img src="images/appstore.png" alt="Click to enlarge" />                  
            </a>
            <a href="#" className="no-padding">
            contact
            </a>
            </li>
            </ul>                        
            </div>
            </div>
            </nav>
            )
        }
    }
export default Header;