import AssistantAPIKeyFunctions from '../components/AssistantAPIKeyFunctions';
import React, { useState, useEffect } from 'react';
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

  const [inputReturnLocal, setInputReturnLocal] = useState('');
  const [threadNotifier, setThreadNotifier] = useState(false);
  const [imgSRCReturnLocal, setimgSRCReturnLocal] = useState(null);
  const [msgReturnLocal, setMsgReturnLocal] = useState([]);

  useEffect(() => {
    const input = returnInput();
    console.log('inputReturnLocal:', input);
    setInputReturnLocal(input);
  }, [returnInput]);

  useEffect(() => {
    const notifier = returnThreadNotifier();
  }, [returnThreadNotifier]);

  useEffect(() => {
    const imgSrc = imageSrcReturn();
    console.log('imgSRCReturnLocal:', imgSrc);
    setimgSRCReturnLocal(imgSrc);
  }, [imageSrcReturn]);

  useEffect(() => {
    const msg = returnMsg();
    console.log('msgReturnLocal:', msg);
    setMsgReturnLocal(msg);
  }, [returnMsg]);

  return (
    <PageContainer>
      <ChatBox
          messages={msgReturnLocal}
          input={inputReturnLocal}
          setInput={setInputReturnLocal}
          handleChatSubmit={handleChatSubmit}
        />
      <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
        <img src={imgSRCReturnLocal} alt="Uploaded Visualization" />
      </div>
    </PageContainer>
  );
};

export default UploadPageAfterLoadingVisualization;
