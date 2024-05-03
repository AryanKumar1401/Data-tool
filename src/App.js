import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import HomePage from './pages/HomePage';

const AppContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
