import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import Papa from 'papaparse';
import axios from 'axios';
import UploadPageAfterUploading from './UploadPageAfterUploading';
import AboutPage from './AboutPage';

import UploadPageAfterLoadingVisualization from './UploadPageAfterLoadingVisualization';

import AssistantAPIKeyFunctions from '../components/AssistantAPIKeyFunctions';

import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const UploadPage = () => {

  const {
    handleFileChange,
    handleUpload,
    handleChatSubmit,
    returnProgress,
    returnMsg,
    returnfileUploadSuccess,
    returnThreadNotifier,
    imageSrcReturn,
  } = AssistantAPIKeyFunctions();
  


  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  useEffect(() => {
    setFileUploadSuccess(returnfileUploadSuccess);
  }, [returnfileUploadSuccess]);


  const [progressStatus, setProgressStatus] = useState({started: false, percentageCompleted: 0});

  useEffect(() => {
    setProgressStatus({returnProgress});
  }, [{returnProgress}]);


  const [msgStatus, setMsgStatus] = useState(null);

  // useEffect(() => {
  //   setMsgStatus(returnMsg());
  // }, [returnMsg]);


  const [threadNotifier, setThreadNotifier] = useState(false);

  useEffect(() => {
    setThreadNotifier(returnThreadNotifier());
  }, [returnThreadNotifier]);


  const [imgSRCReturnLocal, setimgSRCReturnLocal] = useState(null);

  useEffect(() => {
    setimgSRCReturnLocal(imageSrcReturn());
  }, [imageSrcReturn]);

  const renderContent = () => {
    if (fileUploadSuccess && !threadNotifier) {
      return <UploadPageAfterUploading />;
    } else if (fileUploadSuccess && threadNotifier) {
      return <UploadPageAfterLoadingVisualization />;
    } else {
      return (
        
        <PageContainer>
          <FileUpload
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            progress={progressStatus}
            msg={msgStatus}
          />
        </PageContainer>
      );
    }
  };

  

  return (
    <div>
      {renderContent()}
    </div>
  );
  
};

export default UploadPage;
