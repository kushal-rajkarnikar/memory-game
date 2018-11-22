import React, { Component } from 'react';
import News from './news';
import Masonry from 'react-masonry-component';


const masonryOptions = {
    // transitionDuration: 0,
    gutter: 30,
    itemSelector: '.news-block',
    percentPosition: false,
    columnWidth: '.news-block',    
    fitWidth: true
};

class Newslist extends Component {
    render() {

        const {news} = this.props;

        let counter = 1;

        return (
            <section className="news-container">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="current-category">
                                <h1 align="center">
                                    ALL NEWS
              </h1>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            
                            <Masonry
                                className={'news-columns'} // default ''                    
                                options={masonryOptions} // default {}
                                disableImagesLoaded={false} // default false
                                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false

                            >                            

                            {news.map(news_single =>
                                    <News news_single={news_single} key={counter}>   
                                    {counter++}
                                    </News>
                            )}

                            

                                </Masonry>                            


                            
                        </div>
                    </div>

                    </div>
                </section>                            
                                )
                            }
                        }
                        

export default Newslist;