import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CarouselPage from '../components/Carousel.js';

// Styled button component
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

const HomePage = () => {
  const navigate = useNavigate();

  // Function to handle button click and navigate to another route
  const navigateToExplore = () => {
    navigate('/upload');
  };

  return (
    <PageContainer>
      <SubHeader>
        <div>Your Personal</div>
        <CarouselPage />
      </SubHeader>
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
