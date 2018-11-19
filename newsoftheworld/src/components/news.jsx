import React, { Component } from 'react';

class News extends Component {
    render() {
        return (            
            <article class="news-block" data-toggle="modal" href='#news-popup'>


                <figure class="news-image">
                    <div class="skewed-div"></div>
                    <img src="images/i1.png">                    
                </figure>

                    <div class="news-text">
                        <div class="news-headlines">
                            Solar Impulse 2 lands after historic round-the-world trip
                  </div>
                        <div class="news-author">
                            By Prashant Ghimire / Today
                  </div>
                        <div class="news-details">
                            <div class="news-content">
                                Solar Impulse 2, solar-powered flight, landed at 4am on Tuesday in Abu Dhabi, after flying around the world. Bertrand Piccard piloted the plane for final time, steering it safely from Egyptian capital Cairo to UAE. The voyage that began on March last year to show possibilities of solar energy, covered 42,000km, taking in four continents, three seas and two oceans.
                   </div>
                            <div class="facebook">
                                <iframe src="https://www.facebook.com/v2.6/plugins/like.php?action=like&app_id=&channel=http%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2Fbz-D0tzmBsw.js%3Fversion%3D42%23cb%3Df11c111b15517c%26domain%3Dwww.inheadline.com%26origin%3Dhttp%253A%252F%252Fwww.inheadline.com%252Ff3512a6880dec1c%26relation%3Dparent.parent&container_width=635&href=http%3A%2F%2Finheadline.com%2Fnews%2FNepali-Lawmakers-urge-India-to-expedite-projects%2F3357&layout=standard&locale=en_US&sdk=joey&share=true&show_faces=true&size=small" height="20px"></iframe>


                            </div>
                            <div class="read-more">
                                Read more at <a href="#">The National</a>
                            </div>
                        </div>
                    </div>
             </article>


        )
    }
}

export default News;