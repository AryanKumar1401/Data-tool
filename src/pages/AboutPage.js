import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Content = styled.p`
  color: #333;
`;

const AboutPage = () => {
  return (
    <PageContainer>
      <Content>
        Welcome to Data Tool. Here you can learn more about our project and team.
      </Content>
    </PageContainer>
  );
};

export default AboutPage;
