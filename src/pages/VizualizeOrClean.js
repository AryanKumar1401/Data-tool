import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { ButtonToolbar } from 'react-bootstrap';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const divHoldingWhat = styled.div `

  float: top;
`

const StyledButton = styled(Button)`
  margin: 0 20px; /* Adjust the margin value as needed */
`;

const VizualizeOrClean = () => {
  const navigate = useNavigate();

  const gotToNewPage = () => {
    navigate("/upload");
  };

  const goToNewPage2 = () => {
    navigate("/cleanse");
  };

  return (

   
    <PageContainer>

     
     
      
      <div>
      <h1>What would you like to do today?</h1>
      
     


     
      
        <ButtonToolbar size='lg' className='mb-2'>
          <StyledButton variant='dark' size='lg' onClick={goToNewPage2}>Clean your dataset</StyledButton>
          <StyledButton variant='dark' size='lg' onClick={gotToNewPage}>Visualize your dataset</StyledButton>
        </ButtonToolbar>
      </div>
    </PageContainer>
  );
};

export default VizualizeOrClean;
