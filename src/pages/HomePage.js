import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import CarouselPage from "../components/Carousel.js";

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
  display: flex;
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

const Footer = styled.footer`
  margin-top: 50px;
  font-size: 1.2em;
`;

{/* <div className="home">
<div className="headerContainer">
  <h4 className="personal">Your Personal</h4>
  <CarouselPage />
  <p className="whatwedo">What we do</p>
  <p className="whatwedoDescription">
    DataTool takes your dataset and cleanses and analyzes it to return
    stunning visualizations
  </p>
  <p className="whatwedohook">
    We do the brunt work, so you can get cracking on the real stuff
  </p>
  <button type="button" onClick={handleClick}>
    Ready to rock?
  </button>
</div>
</div> */}
const HomePage = () => {
  return (




    <PageContainer>
      <SubHeader>
        <div>Your Personal</div>
        <CarouselPage />
      </SubHeader>
      <Section>
        <h2>What we do</h2>
        <p>
          DataTool takes your dataset and cleanses and analyzes it to return stunning visualizations.
        </p>
        <p> 
          <strong>We do the brunt work, so you can get cracking on the real stuff.</strong>
        </p>
      </Section>
      <Footer>Ready to Rock?</Footer>
    </PageContainer>
  );
};

export default HomePage;
