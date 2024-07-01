import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatBox from '../components/ChatBox';
import axios from 'axios';
import AssistantAPIKeyFunctions from '../components/AssistantAPIKeyFunctions';
import { fileContentExporter, imageSrcExport } from './UploadPage';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const UploadPageAfterLoadingVisualization = ({ fileUrl }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const {
    handleFileChange,
    handleUpload,
    returnProgress,
    returnMsg,
    returnfileUploadSuccess,
    returnThreadNotifier,
    imageSrcExport,
    imageSrcReturn,
    cleanFileUrlExport,
    cleanFileUrlReturn,
    returnInput,
    fileContentExporter,
  } = AssistantAPIKeyFunctions();


  let flag = 0;

  const handleChatSubmit = async () => {
    if (flag === 0) {
      const response = await axios.post('/api/get-response');
      const botMessages = response.data.messages.map(message => ({
        text: message.content.find(content => content.type === 'text').text,
        isUser: false,
      }));
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
      flag = 1;
    }
    if (!input.trim()) return;

    const newMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/get-response', { input, fileContentExporter });

      const botMessages = response.data.messages.map(message => ({
        text: message.content.find(content => content.type === 'text').text,
        isUser: false,
      }));
      console.log(botMessages);
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    }
  };

  const [threadNotifier, setThreadNotifier] = useState(false);
  const [imgSRCReturnLocal, setimgSRCReturnLocal] = useState(null);
  const [cleanFileUrlLocal, setCleanFileUrlLocal] = useState(null);

  useEffect(() => {
    const notifier = returnThreadNotifier();
    setThreadNotifier(notifier);
  }, []);

  useEffect(() => {
    const imgSrc = imageSrcReturn();
    setimgSRCReturnLocal(imgSrc);
  }, []);

  useEffect(() => {
    const cleanFileUrl = cleanFileUrlReturn();
    setCleanFileUrlLocal(cleanFileUrl);
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
      {imageSrcExport && <img src={imageSrcExport} alt="Uploaded Visualization" />}
      {fileUrl && (
        <a href={fileUrl} download className="mt-3 text-blue-500 hover:underline">
          Download File
        </a>
      )}
      </div>
      <ChatBox
        messages={messages}  
        input={input}
        setInput={setInput}
        handleChatSubmit={handleChatSubmit}
      />
    </PageContainer>
  );
};

export default UploadPageAfterLoadingVisualization;
