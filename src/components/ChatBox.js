// src/components/ChatBot.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChatLog = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const Message = styled.div`
  margin-bottom: 10px;
  &.user {
    text-align: right;
  }
  &.bot {
    text-align: left;
  }
`;

const ChatInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const ChatBot = ({ fileId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await axios.post('/api/get-initial-response', { fileId });
        const botMessages = response.data.messages.map(message => ({
          text: message.content.find(content => content.type === 'text').text,
          isUser: false,
        }));
        console.log(botMessages);
        setMessages((prevMessages) => [...prevMessages, ...botMessages]);
        console.log(messages);
      } catch (error) {
        console.error('Error fetching initial message:', error);
      }
    };

    fetchInitialMessage();
  }, [fileId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/send-message', { message: input });
      const botMsgs = response.data.messages.map(message => ({
        text: message.content.find(content => content.type === 'text').text,
        isUser: false,
      }));
      console.log(botMsgs);
      setMessages((prevMessages) => [...prevMessages, ...botMsgs]);
      console.log(messages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
      <div className="flex flex-col items-start w-full mt-5">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded my-1 ${msg.isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
            {msg.isUser && msg.text.value}
            {!msg.isUser && msg.text.value}
          </div>
        ))}
      </div>
      <textarea
        className="w-full p-2 mt-2 border border-gray-300"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="3"
      />
      <button className="bg-gray-800 text-white font-bold p-2 rounded hover:bg-gray-600 mt-4" onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBot;
