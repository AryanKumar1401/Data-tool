import AssistantAPIKeyFunctions from '../components/AssistantAPIKeyFunctions';

import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import Papa from 'papaparse';
import axios from 'axios';
import UploadPageAfterUploading from './UploadPageAfterUploading';
import AboutPage from './AboutPage';



import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;






const UploadPageAfterLoadingVisualization = () => {

  const {
    handleFileChange,
    handleUpload,
    handleChatSubmit,
    returnProgress,
    returnMsg,
    returnfileUploadSuccess,
    returnThreadNotifier,
    imageSrcReturn,
    returnInput,
  
  } = AssistantAPIKeyFunctions();


  const [inputReturnLocal, setInputReturnLocal] = useState(false);

  useEffect(() => {
    setInputReturnLocal(returnInput());
  }, [returnInput()]);

  const [threadNotifier, setThreadNotifier] = useState(false);

  useEffect(() => {
    setThreadNotifier(returnThreadNotifier());
  }, [returnThreadNotifier()]);


  const [imgSRCReturnLocal, setimgSRCReturnLocal] = useState(null);

  useEffect(() => {
    setimgSRCReturnLocal(imageSrcReturn());
  }, [imageSrcReturn()]);



  const [msgReturnLocal, setMsgReturnLocal] = useState(null);

  useEffect(() => {
    setMsgReturnLocal(returnMsg());
  }, [{returnMsg}]);

    

    return(
      <PageContainer>
        <ChatBox
            messages={{msgReturnLocal}}
            input={{inputReturnLocal}}
            setInput={{inputReturnLocal}}
            handleChatSubmit={handleChatSubmit}
          />
          <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
            <img src={{imgSRCReturnLocal}} alt="Uploaded Visualization" />
          </div>
      </PageContainer>
        
    
       
       
       
    );
    
    
       
    
    };
    
    export default UploadPageAfterLoadingVisualization;