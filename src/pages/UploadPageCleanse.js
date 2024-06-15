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



  






const UploadPageCleanse = () => {

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target.result);
        //   fileContentExporter = fileContent; REMEMBER YOU CAN NOW USE FILECONTENT DIRECTLY INSTEAD OF THIS
        };
        reader.readAsText(selectedFile);
      };

     


      const [uploadFlag, setUploadFlag] = useState(false);


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
          });
    
    
          const fileId = response.data.fileId;
          console.log('File uploaded with ID:', fileId);
          
          setUploadFlag(true)
    
          setFileUploadSuccess(true);
    
          const assistant = await axios.post('/api/create-assistantClean', { fileId });
          console.log('Assistant created with ID:', assistant.data.id);
    
          const thread = await axios.post('/api/create-threadClean', { fileId, assistantId: assistant.data.id });
          console.log('Thread created with ID:', thread.data.id);
    
          const responseFromThread = await axios.post('/api/run-threadClean');
          const { imageUrl, messages, fileContent } = responseFromThread.data;
          console.log('Image ID:', imageUrl);
          console.log('Messages:', messages);
          console.log('file content: ',fileContent);
          setImageSrc(imageUrl); // Update state with the image src
        //   imageSrcExport = imageUrl;
          console.log("imageSrc: ", imageSrc);
        //   console.log("imagesrcexport: ", imageSrcExport); REMEMBER YOU CAN NOW USE IT LOCALLY
          console.log("imageURL:" , imageUrl);
          setThreadFinishNotifier(true);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };

    const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  // const [messages, setMessages] = useState([]);
  // const [input, setInput] = useState('');
  const [imageSrc, setImageSrc] = useState(null); // State for storing imageSrc
  const returnfileUploadSuccess = () => fileUploadSuccess;
  const returnThreadNotifier = () => threadFinishNotifier;
  const imageSrcReturn = () => imageSrc;
  const returnProgress = () => progress;
  const [threadFinishNotifier, setThreadFinishNotifier] = useState(false);

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


  const renderContentCleanse = () => {
    if(uploadFlag) {
      return <UploadPageAfterUploading />
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
      )
    }
  }

  return(
    
   <div>{renderContentCleanse()}</div>
  )  
}


export default UploadPageCleanse;




  

  



