import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import OpenAI from 'openai';
import storage from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


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


const getPrompt = (fileStatus) => {
    return fileStatus ? "tell the user that the dataset has been processed and they will be directed to a new page" : "greet the user, respond to any of their questions, and after that ask them to upload a dataset";
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


const UploadPageAfterUploading = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
    const [msg, setMsg] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [fileStatus, setFileStatus] = useState(false);
    const [percent, setPercent] = useState(0);

return(
    <PageContainer>
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
)


   

}
