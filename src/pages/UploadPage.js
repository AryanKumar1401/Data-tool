import React, { useState } from 'react';
import { uploadFileToFirebase } from '../utils/firebaseUpload';
import { getOpenAIResponse } from '../utils/openai';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [, setFileURL] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }
    uploadFileToFirebase(file, setProgress, setFileURL, setMsg, setMessages);
  };

  const handleChatSubmit = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await getOpenAIResponse(input, fileContent);
      const botMessage = { text: response, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    }
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
    </div>
  );
};

export default UploadPage;
