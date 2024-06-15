import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import OpenAI from 'openai';
import storage from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ReactLoading from "react-loading";
import ReactDOM from 'react-dom';
// import { handleFileChange, handleUpload, handleChatSubmit, returnProgress, returnMsg} from '../components/AssistantAPIKeyFunctions';


const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const innerDiv = styled.div `

  width: 100%;
  text-align: center;

  `



const UploadPageAfterUploading = () => {
    

return(
  <PageContainer>
    <innerDiv>
    <ReactLoading center type='cylon' color = '#0000FF' />
    <h1>Your File is Being Processed. Sit Tight!</h1>
    </innerDiv>
     
    

  </PageContainer>

   
   
   
);


   

};

export default UploadPageAfterUploading;
