import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import Papa from 'papaparse';
import axios from 'axios';




const AssistantAPIKeyFunctions = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chartData, setChartData] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // State for storing imageSrc
  const [imageError, setImageError] = useState(false); // State for handling image error
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [threadFinishNotifier, setThreadFinishNotifier] = useState(false);


 

   const generateChartData = (data) => {
    const labels = Object.keys(data[0]);
    const datasets = labels.map((label, index) => {
      const values = data.map((row) => row[label]);
      return {
        label: label,
        data: values,
        backgroundColor: `rgba(${75 + index * 40}, 192, 192, 0.4)`,
        borderColor: `rgba(${75 + index * 40}, 192, 192, 1)`,
        borderWidth: 1,
      };
    });

    const chartData = {
      labels: data.map((_, index) => `Row ${index + 1}`),
      datasets: datasets,
    };

    setChartData(chartData);
  };
 

  

  const parseCSV = (content) => {
    Papa.parse(content, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        const data = results.data;
        generateChartData(data);
      },
    });
  };

  const returnfileUploadSuccess = () => {
    return fileUploadSuccess;
  }

  const returnThreadNotifier = () => {
    return threadFinishNotifier;
  }

  const imageSrcReturn = () => {
    return imageSrc;
  }

  const returnProgress = () => {
    return progress;
  }

  const returnMsg = () => {
    return msg;
  }

  const returnInput = () => {
    return input;
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      parseCSV(e.target.result);
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
      setMsg(response.data.message);

      const fileId = response.data.fileId;
      console.log('File uploaded with ID:', fileId);

      setFileUploadSuccess(true);

      const assistant = await axios.post('/api/create-assistant', { fileId });
      console.log('Assistant created with ID:', assistant.data.id);

      const thread = await axios.post('/api/create-thread', { fileId, assistantId: assistant.data.id });
      console.log('Thread created with ID:', thread.data.id);

      const responseFromThread = await axios.post('/api/run-thread');
      const { imageUrl, messages } = responseFromThread.data;
      console.log('Image ID:', imageUrl);
      console.log('Messages:', messages);
      setImageSrc(imageUrl); // Update state with the image src
      setThreadFinishNotifier(true);
      setImageError(false); // Reset image error state
    } catch (error) {
      console.error('Error uploading file:', error);
      setMsg('Failed to upload file.');
    }
  };

  const handleChatSubmit = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/get-response', { input, fileContent });
      const botMessage = { text: response.data.message, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    }
  };

  return {
    handleFileChange,
    handleUpload,
    handleChatSubmit,
    returnProgress,
    returnMsg,
    returnfileUploadSuccess,
  };
};

export default AssistantAPIKeyFunctions;
