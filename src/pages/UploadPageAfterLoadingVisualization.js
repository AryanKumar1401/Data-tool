import AssistantAPIKeyFunctions from '../components/AssistantAPIKeyFunctions';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatBox from '../components/ChatBox';
import axios from 'axios';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const UploadPageAfterLoadingVisualization = () => {
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
    returnInput,
    fileContentExporter,
  } = AssistantAPIKeyFunctions();

  const handleChatSubmit = async () => {
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

  const [inputReturnLocal, setInputReturnLocal] = useState('');
  const [threadNotifier, setThreadNotifier] = useState(false);
  const [imgSRCReturnLocal, setimgSRCReturnLocal] = useState(null);
  const [msgReturnLocal, setMsgReturnLocal] = useState([]);

  // useEffect(() => {
  //   const input = returnInput();
  //   setInputReturnLocal(input);
  // }, []);

  useEffect(() => {
    const notifier = returnThreadNotifier();
    setThreadNotifier(notifier);
  }, []);

  useEffect(() => {
    const imgSrc = imageSrcReturn();
    setimgSRCReturnLocal(imgSrc);
  }, []);


  return (
    <PageContainer>
      <ChatBox
        messages={messages}  
        input={input}
        setInput={setInput}
        handleChatSubmit={handleChatSubmit}
      />
      <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
        <img src={imageSrcExport} alt="Uploaded Visualization" />
      </div>
    </PageContainer>
  );
};

export default UploadPageAfterLoadingVisualization;


