import {React, Fragment, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CarouselPage from '../components/Carousel.js';
import WordPullUp from '../components/magicui/WordPullup.tsx';
import ShimmerButton from '../components/magicui/shiny-button.tsx';
import ShinyButton from '../components/magicui/shiny-button.tsx';
import AnimatedGridPattern, { GridPattern } from '../components/magicui/background.tsx';
import { cn } from '../lib/utils.ts';
import BoxReveal from '../components/magicui/box-reveal.tsx';



// Styled button component


const Header = styled.h1` 
   text-align: center; 
   left: 50%;
   color: green; 
`;
 
const Content = styled.div` 
   overflowY: scroll; 
   height: 2500px; 
`;
 


const MainButtonRock = styled.button`
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #121619;
  height: 50px;
  width: 180px;
  font-size: 20px;
  margin-top: 20px;

  /* Hover effect */
  &:hover {
    background-color: #0a1013;
  }
`;

// Styled components for the page layout
const PageContainer = styled.div`
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
`;

const SubHeader = styled.div`
  
  justify-content: center;
  margin: 20px 0;
  font-size: 2em;
  flex-wrap: wrap;

  & > div {
    margin: 0 20px;
  }
`;


const YourPersonal = styled.div `
  font-size: 1.5em;
  font-weight: bold;
`

const Section = styled.section`
  margin: 50px 0;

  h2 {
    font-size: 2.5em;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.5em;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const HorizontalContainer = styled.div `
  display: flex;
`

const HomePage = () => {
  const navigate = useNavigate();

  // Function to handle button click and navigate to another route
  const navigateToExplore = () => {
    navigate('/upload');
  };

  return (
    <div className="h-screen w-screen items-center justify-center overflow-hidden bg-background md:shadow-xl">
      <GridPattern numSquares={200} className='w-screen h-screen' maxOpacity={0.75}
      />
      {/* <h2 className='relative text-center text-white'>Your Personal</h2>
       
        <WordPullUp className='relative text-center text-white' words='Data Tool'></WordPullUp> */}
            <BoxReveal boxColor={"white"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold text-white">
          Data Tool<span className="text-white">.</span>
        </p>
      </BoxReveal>
 
      <BoxReveal boxColor={"white"} duration={0.5}>
        {/* <h2 className="mt-[.5rem] text-[1rem]">
          UI library for{" "}
          <span className="text-white">Design Engineers</span>
        </h2> */}
      </BoxReveal>
 
      <BoxReveal boxColor={"white"} duration={0.5}>
        <div className="mt-[1.5rem]">
          <p className='text-white'>
            -&gt; DataTool takes your dataset and cleanses and analyzes it to return stunning visualizations. <br />
            -&gt; We do the brunt work, so you can get cracking on the real stuff. <br />
          </p>
        </div>
      </BoxReveal>
 
      <BoxReveal boxColor={"white"} duration={0.5}>
      <button
  class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-100 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
  type="button"
  onClick={navigateToExplore}
>
  Explore
</button>      </BoxReveal>

    </div>
    
  );
};

export default HomePage;
