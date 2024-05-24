import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import OpenAI from 'openai';
import storage from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const PageContainer = styled.div`
  display: flex;
  flex-direction: row; 
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  border-radius: 40px;
  background: linear-gradient(135deg, #00fafa, #00c3c3);
  
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  display: none;
 

`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin-left: 20px;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  height: 80vh;
  overflow-y: auto;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 20px;
`;

const MessageInput = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
`;

const Message = styled.div`
  background-color: ${(props) => (props.isUser ? '#007bff' : '#eee')};
  color: ${(props) => (props.isUser ? '#fff' : '#000')};
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
`;

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [fileStatus, setFileStatus] = useState(false);
  const [percent, setPercent] = useState(0);

  const getPrompt = (fileStatus) => {
    return fileStatus ? "tell the user that the dataset has been processed and they will be directed to a new page" : "greet the user, respond to any of their questions, and after that ask them to upload a dataset";
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        setProgress({ started: true, percentageCompleted: percent });
        setFileStatus(true);
      },
      (error) => {
        console.error("Error uploading file:", error);
        setMsg("Error uploading file");
      },
      () => {
        // Upload completed
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log("File uploaded successfully. Download URL:", url);
            setMsg("File uploaded successfully");
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setMsg("Error getting download URL");
          });
      }
    );
  };

  const handleChatSubmit = async () => {
    if (!input.trim()) return;
    const prompt = getPrompt(fileStatus);

    const newMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const botMessage = { text: response.choices[0].message.content.trim(), isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <h1>Drag, drop, or upload file</h1>

        <label for="file-upload" class="custom-file-upload">
        Custom Upload
    </label>
        <Input id="file-upload" onChange={handleFileChange} type="file" />
        <Button onClick={handleUpload}>Upload here</Button>
        {progress.started && <progress max="100" value={progress.percentageCompleted}></progress>}
        {msg && <span>{msg}</span>}
      </FormContainer>

      <ChatContainer>
        <ChatBox>
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.isUser}>
              {msg.text}
            </Message>
          ))}
        </ChatBox>
        <MessageInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="3"
        />
        <Button onClick={handleChatSubmit}>Send</Button>
      </ChatContainer>
    </PageContainer>
  );
};

export default UploadPage;
