import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import axios from 'axios';
import UploadPageAfterUploading from './UploadPageAfterUploading';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;
export let imageSrcExport = '';
let fileContentExporter = '';
export let cleanFileUrlExport = '';
const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [imageSrc, setImageSrc] = useState(null); // State for storing imageSrc
  const [cleanFileUrl, setCleanFileUrl] = useState(null); // State for storing clean CSV file URL
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [threadFinishNotifier, setThreadFinishNotifier] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      fileContentExporter = fileContent;
      
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        
        onUploadProgress: (progressEvent) => {
          const percentageCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress({ started: true, percentageCompleted });
        },
        
      }
      );

      const fileId = response.data.fileId;
      console.log('File uploaded with ID:', fileId);
      setFileUploadSuccess(true);

      

      const assistant = await axios.post('/api/create-assistant', { fileId });
      console.log('Assistant created with ID:', assistant.data.id);

      const thread = await axios.post('/api/create-thread', { fileId, assistantId: assistant.data.id });
      console.log('Thread created with ID:', thread.data.id);
      

      const responseFromThread = await axios.post('/api/run-thread');
      const { imageUrl, messages, fileContent } = responseFromThread.data;
      console.log('Image ID:', imageUrl);
      console.log('Messages:', messages);
      console.log('file content: ', fileContent);
      setImageSrc(imageUrl); // Update state with the image src
      imageSrcExport = imageUrl;
      setThreadFinishNotifier(true);     
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileUploadSuccess(false);
    }
  };


  const returnfileUploadSuccess = () => fileUploadSuccess;
  const returnThreadNotifier = () => threadFinishNotifier;
  const imageSrcReturn = () => imageSrc;
  const returnProgress = () => progress;
  const cleanFileUrlReturn = () => cleanFileUrl;



// DIVISION

















  
  


 

  

  


  const [msgStatus, setMsgStatus] = useState(null);
  let flag = 0;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

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

  const renderContentAfterVizualization = () => {
    return(
    <PageContainer>
      <ChatBox
        messages={messages}  
        input={input}
        setInput={setInput}
        handleChatSubmit={handleChatSubmit}
      />
      <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
      {
        imageSrcExport && <img src={imageSrcExport} alt="Uploaded Visualization" />
      }
        <img src={imageSrcExport} alt="Uploaded Visualization" />
      </div>
    </PageContainer>
    )
  }



  //LOAD VIZUALIZATION SECTION END
  const renderContentUpload = () => {
    if (fileUploadSuccess && !threadFinishNotifier) {
      return <UploadPageAfterUploading />;
    } else if (fileUploadSuccess && threadFinishNotifier) {
      return (<PageContainer>
        <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
        {
          imageSrcExport && <img src={imageSrcExport} alt="Uploaded Visualization" />
        }
        </div>
        <ChatBox
          messages={messages}  
          input={input}
          setInput={setInput}
          handleChatSubmit={handleChatSubmit}
        />
      </PageContainer>);
    } else {
      return (
        
        <PageContainer>
          <FileUpload
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            progress={progress}
            msg={msgStatus}
          />
        </PageContainer>
      );
    }
  };

  

  return (
    
    <div>
      {renderContentUpload()}
    </div>
  );
  
};

export default UploadPage;
