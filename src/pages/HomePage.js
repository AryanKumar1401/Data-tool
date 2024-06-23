import {React, Fragment, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CarouselPage from '../components/Carousel.js';




//Functions

const ScrollButton = () => {
 
  const [visible, setVisible] = useState(true)

  const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 0) {
          setVisible(false)
      }
      else if (scrolled <= 0) {
          setVisible(true)
      }
  };

  const scrollToBottom = () => {
      window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'auto'
          /* you can also use 'auto' behaviour 
             in place of 'smooth' */
      });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
      <Button>
       <FontAwesomeIcon icon="fa-solid fa-arrow-down" onClick = {scrollToBottom} />
      </Button>
  );
}


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
    <PageContainer>
      <SubHeader>
        <YourPersonal>Your Personal</YourPersonal>
        <CarouselPage />
      </SubHeader>

      <Fragment>
            <Header>GeeksForGeeks Scroll To Bottom</Header>
            <ScrollButton />
            <Content />
            <Header>Thanks for visiting</Header>
        </Fragment>





      <Section>
        <h2>What we do</h2>
        <p>DataTool takes your dataset and cleanses and analyzes it to return stunning visualizations.</p>
        <p>
          <strong>We do the brunt work, so you can get cracking on the real stuff.</strong>
        </p>
      
        <MainButtonRock onClick={navigateToExplore}>Ready to Rock?</MainButtonRock>
      </Section>
    </PageContainer>
  );
};

export default HomePage;
