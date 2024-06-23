import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "../componentstyles/Carousel.css";




const CarouselPage = () => {
  return ( 
    <Carousel 
      autoPlay={true} 
      infiniteLoop={true} 
      showArrows={false} 
      showIndicators={false} 
      showThumbs={false} 
      showStatus={false} 
      className='CarouselMainPage'
    >
      <div className="carousel-slide">
        <h4 style={{fontSize: "1em"}}>Data Cleanser</h4>
      </div>
      <div className="carousel-slide">
        <h4 style={{fontSize: "1em"}}>Data Analyzer</h4>
      </div>
      <div className="carousel-slide">
        <h4 style={{fontSize: "1em"}}>Data Visualizer</h4>
      </div>
    </Carousel>
  );
};

export default CarouselPage;