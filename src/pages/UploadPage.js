import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import ChartComponent from '../components/ChartComponent';
import Papa from 'papaparse';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chartData, setChartData] = useState(null);

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

      // Handle the assistant creation and thread creation here if needed
      const fileId = response.data.fileId;
      const assistant = await axios.post('/api/create-assistant', { fileId });
      const thread = await axios.post('/api/create-thread', { fileId, assistantId: assistant.data.id });
      console.log(`Assistant and thread created successfully! Assistant ID: ${assistant.data.id}, Thread ID: ${thread.data.id}`);
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

  // Make visualization charts
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

  return (
    <div className="flex flex-row items-start justify-center h-screen bg-gray-100">
      <FileUpload
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
        progress={progress}
        msg={msg}
      />
      <ChatBox
        messages={messages}
        input={input}
        setInput={setInput}
        handleChatSubmit={handleChatSubmit}
      />
      <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
        {chartData && <ChartComponent chartData={chartData} />}
      </div>
    </div>
  );
};

export default UploadPage;
