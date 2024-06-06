import AssistantAPIKeyFunctions from '../components/AssistantAPIKeyFunctions';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChatBox from '../components/ChatBox';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import UploadPage from './UploadPage';





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


const VizualizeOrClean = () => {


  const navigate = useNavigate();

  const gotToNewPage=()=>{
    navigate("/upload");
  }
    return (

        <PageContainer>
            <div>
            <h1>
  What would you like to do today?
</h1>

      

        <ButtonToolbar size='lg' className='mb-2'>
            <Button variant='dark' size='lg'>Clean your dataset</Button>
            <Button variant='dark' size='lg' onClick={() => gotToNewPage()}>Visualize your dataset</Button>
        </ButtonToolbar>
       
            </div>
      
    </PageContainer>
    //     <PageContainer>
    //     <h1>What Would You Like to Do?</h1>

    //     <div></div>
    // </PageContainer>

    )

   


}

export default VizualizeOrClean;