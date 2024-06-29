import {React, Fragment, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CarouselPage from '../components/Carousel.js';
import WordPullUp from '../components/magicui/WordPullup.tsx';
import ShimmerButton from '../components/magicui/shiny-button.tsx';
import ShinyButton from '../components/magicui/shiny-button.tsx';
import AnimatedGridPattern, { GridPattern } from '../components/magicui/background.tsx';
import { cn } from '../lib/utils.ts';
import { VelocityScroll } from '../components/magicui/scroll-based-velocity.tsx';
import GradualSpacing from '../components/magicui/gradual-spacing.tsx';
import AnimatedGradientText from '../components/magicui/animated-gradient-text.tsx';
import Calendar from 'react-calendar';
import { BentoCard, BentoGrid } from '../components/magicui/bento-grid.tsx';
import Meteors from '../components/magicui/meteors.tsx';
import WordFadeIn from '../components/magicui/word-fade-in.tsx';
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";


//FUNCTION FOR BENTOGRID

const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];


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
 
const Button = styled.div` 
   position: fixed;  
   width: 100%; 
   left: 50%; 
   height: 20px; 
   font-size: 3rem; 
   z-index: 1; 
   cursor: pointer; 
   color: green; 

`


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
       
       <GradualSpacing
      className="font-display text-center text-4xl font-bold tracking-[-0.1em]  text-white dark:text-white md:text-7xl md:leading-[5rem]"
      text="Elegant. Simple. Quick."
    />

<div className="z-10 flex min-h-[16rem] items-center justify-center">
      <AnimatedGradientText>
       
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Welcome to DataTool
        </span>
      
      </AnimatedGradientText>



    </div>

    <WordFadeIn words="DataTool automatically cleanses and visualizes the data that you provide it." />;


    <ShinyButton text="Unlock Your Data Power" />;





   
    

    </div>
  );
};

export default HomePage;
