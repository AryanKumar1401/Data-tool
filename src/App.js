import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './GlobalStyles';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UploadPage from './pages/UploadPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(235,247,255,1) 50%, rgba(218,233,255,1) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  width: 97%;
  top: 0;
  left: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 10px;
  z-index: 1000;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background-image: favicon.ico;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 10px;
`;

const NavTitle = styled.h1`
  font-size: 24px;
  color: #333;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media (max-width: 670px) {
    flex-direction: column;
  }
`;

const NavItem = styled(Link)`
  color: #333;
  margin: 0 15px;
  text-decoration: none;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  

  &:hover {
    background-color: white;
    color: #333;
    text-decoration: none;
  }
`;

const SignUpButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  margin-top: 80px; // Adjust based on your header height
`;

const Footer = styled.footer`
  background-color: #000;
  color: white;
  text-align: center;
  padding: 10px 20px;
  font-size: 16px;
`;

function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header>
          <LogoContainer>
            <Logo />
            <NavTitle>DataTool</NavTitle>
          </LogoContainer>
          <NavBar>
            <NavItem to="/">Main</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/upload">Explore</NavItem>
            <NavItem to="/pricing">Pricing</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </NavBar>
          <SignUpButton>Sign Up / Log In</SignUpButton>
        </Header>
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </MainContent>
        <Footer>© 2024 DataTool. All rights reserved.</Footer>
      </AppContainer>
    </Router>
  );
}

export default App;
