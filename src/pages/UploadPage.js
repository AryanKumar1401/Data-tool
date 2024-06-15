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
  

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   setFile(selectedFile);

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     setFileContent(e.target.result);
  //     parseCSV(e.target.result);
  //   };
  //   reader.readAsText(selectedFile);
  // };

  // const handleUpload = async () => {
  //   if (!file) {
  //     alert('Please choose a file first!');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const percentageCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //         setProgress({ started: true, percentageCompleted });
  //       },
  //     });
  //     setMsg(response.data.message);

  //     const fileId = response.data.fileId;
  //     console.log('File uploaded with ID:', fileId);

  //     setFileUploadSuccess(true);

  //     const assistant = await axios.post('/api/create-assistant', { fileId });
  //     console.log('Assistant created with ID:', assistant.data.id);

  //     const thread = await axios.post('/api/create-thread', { fileId, assistantId: assistant.data.id });
  //     console.log('Thread created with ID:', thread.data.id);

  //     const responseFromThread = await axios.post('/api/run-thread');
  //     const { imageUrl, messages } = responseFromThread.data;
  //     console.log('Image ID:', imageUrl);
  //     console.log('Messages:', messages);
  //     setImageSrc(imageUrl); // Update state with the image src
  //     setImageError(false); // Reset image error state
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     setMsg('Failed to upload file.');
  //   }
  // };

  // const handleChatSubmit = async () => {
  //   if (!input.trim()) return;

  //   const newMessage = { text: input, isUser: true };
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   setInput('');

  //   try {
  //     const response = await axios.post('/api/get-response', { input, fileContent });
  //     const botMessage = { text: response.data.message, isUser: false };
  //     setMessages((prevMessages) => [...prevMessages, botMessage]);
  //   } catch (error) {
  //     console.error('Error with OpenAI API:', error);
  //   }
  // };

  // const parseCSV = (content) => {
  //   Papa.parse(content, {
  //     header: true,
  //     dynamicTyping: true,
  //     complete: function (results) {
  //       const data = results.data;
  //       generateChartData(data);
  //     },
  //   });
  // };

  // const generateChartData = (data) => {
  //   const labels = Object.keys(data[0]);
  //   const datasets = labels.map((label, index) => {
  //     const values = data.map((row) => row[label]);
  //     return {
  //       label: label,
  //       data: values,
  //       backgroundColor: `rgba(${75 + index * 40}, 192, 192, 0.4)`,
  //       borderColor: `rgba(${75 + index * 40}, 192, 192, 1)`,
  //       borderWidth: 1,
  //     };
  //   });

  //   const chartData = {
  //     labels: data.map((_, index) => `Row ${index + 1}`),
  //     datasets: datasets,
  //   };

  //   setChartData(chartData);
  // };


  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  useEffect(() => {
    setFileUploadSuccess(returnfileUploadSuccess());
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
    //return <UploadPageAfterLoadingVisualization />;
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
