import React, { Component } from 'react';


class News extends Component {

    render() {

        const { title, description, urlToImage, source, author, url } = this.props.news_single;

        return (     
            
            

                
            <article className="news-block" data-toggle="modal" href='#news-popup'>


                <figure className="news-image">
                    <div className="skewed-div"></div>
                    <img src={urlToImage} alt={title}/>                    
                </figure>

                <br/>

                {/*<div className="news-headlines">
                    {title}
                </div>
                <div className="news-author">
                    by {author}
                </div> */}

                    <div className="news-text">
                        <div className="news-headlines">
                            {title}
                  </div>
                        <div className="news-author">
                            by { author }
                  </div>
                        <div className="news-details">
                            <div className="news-content">
                                {description}
                   </div>
                            {/* <div className="facebook">
                                <iframe src="https://www.facebook.com/v2.6/plugins/like.php?action=like&app_id=&channel=http%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2Fbz-D0tzmBsw.js%3Fversion%3D42%23cb%3Df11c111b15517c%26domain%3Dwww.inheadline.com%26origin%3Dhttp%253A%252F%252Fwww.inheadline.com%252Ff3512a6880dec1c%26relation%3Dparent.parent&container_width=635&href=http%3A%2F%2Finheadline.com%2Fnews%2FNepali-Lawmakers-urge-India-to-expedite-projects%2F3357&layout=standard&locale=en_US&sdk=joey&share=true&show_faces=true&size=small" height="20px"></iframe>


                            </div> */}
                            <div className="read-more">
                                Read more at <a href={url}>{source.name}</a>
                            </div>
                        </div>
                    </div>
             </article>
           
                    
               

        )
    }
}

export default News;