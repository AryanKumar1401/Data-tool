import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const WelcomeText = styled.h1`
  color: #333;
`;

const HomePage = () => {
  return (
    <PageContainer>
      <WelcomeText>Welcome to Data Tool!</WelcomeText>
    </PageContainer>
  );
};

export default HomePage;
