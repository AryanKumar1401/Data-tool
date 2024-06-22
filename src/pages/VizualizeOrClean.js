import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { ButtonToolbar } from 'react-bootstrap';

 // display: flex;
  // justify-content: center;
  // align-items: center;

const PageContainer = styled.div`
 
  height: 100vh;
  background-color: #f0f0f0;
  display: block;
  align-items: center;
  justify-content: center;
`;
const PageContainter2 = styled.div `
  height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`


const WhatToDo = styled.div `
  
  padding-top: 10vh;
  align-items: center;
  justify-content: center;
  width: 100vh;
  margin: auto

`

const StyledButton = styled(Button)`
  margin: 0 50px; /* Adjust the margin value as needed */
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

     
     
      
      <WhatToDo>
      <h1>What would you like to do today?</h1>
      </WhatToDo>

      <WhatToDo>
      
     


     
      
        {/* <ButtonToolbar size='lg' className='mb-2'> */}

        <PageContainter2>
          <div>
          <StyledButton variant='dark' size='lg' onClick={goToNewPage2}>Clean your dataset</StyledButton>
          </div>
          <div>
          <StyledButton variant='dark' size='lg' onClick={gotToNewPage}>Visualize your dataset</StyledButton>
          </div>
         
        
       
        

        </PageContainter2>
        {/* </ButtonToolbar> */}
      </WhatToDo>
    </PageContainer>
  );
};

export default VizualizeOrClean;
