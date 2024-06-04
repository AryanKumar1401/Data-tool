import React, { useState } from 'react';
import axios from 'axios';

let imageSrcExport = '';
let fileContentExporter = '';

const AssistantAPIKeyFunctions = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  // const [messages, setMessages] = useState([]);
  // const [input, setInput] = useState('');
  const [imageSrc, setImageSrc] = useState(null); // State for storing imageSrc
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
      });


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
      console.log('file content: ',fileContent);
      setImageSrc(imageUrl); // Update state with the image src
      imageSrcExport = imageUrl;
      console.log("imageSrc: ", imageSrc);
      console.log("imagesrcexport: ", imageSrcExport);
      console.log("imageURL:" , imageUrl);
      setThreadFinishNotifier(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

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

  const returnfileUploadSuccess = () => fileUploadSuccess;
  const returnThreadNotifier = () => threadFinishNotifier;
  const imageSrcReturn = () => imageSrc;
  const returnProgress = () => progress;
  // const returnMsg = () => messages;
  // const returnInput = () => input;

  return {
    
    handleFileChange,
    handleUpload,
    // handleChatSubmit,
    returnProgress,
    // returnMsg,
    returnfileUploadSuccess,
    returnThreadNotifier,
    imageSrcReturn,
    // returnInput,
    imageSrcExport,
    fileContentExporter,
  };
};



export default AssistantAPIKeyFunctions;
