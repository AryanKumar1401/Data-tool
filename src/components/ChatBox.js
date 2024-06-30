// src/components/ChatBot.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';


const ChatBot = ({ fileId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await axios.post('/api/get-initial-response', { fileId });
        // const botMessages = response.data.messages.map(message => ({
        //   text: message.content.find(content => content.type === 'text').text,
        //   isUser: false,
        // }));
        const runId = response.data.run_id;
        const botMessages = response.data.messages
        .filter(message => message.role === "assistant" && message.run_id === runId)
        .map(message => ({
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
    const newMessage = { text: input, isUser: true };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/send-message', { message: input });
      const runId = response.data.run_id;
      const botMsgs = response.data.messages
      .filter(message => message.role === "assistant" && message.run_id === runId)
      .map(message => ({
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
    <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto rounded-lg shadow-lg">
      <div className="flex flex-col items-start w-full mt-5">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded my-1 ${msg.isUser ? 'bg-gray-900 text-white self-end rounded-full' : 'bg-gray-200 text-black self-start rounded-full'}`}>
            {msg.isUser && msg.text}
            {!msg.isUser && msg.text.value}
          </div>
        ))}
      </div>
      <input
        className="w-full p-2 mt-2 border border-gray-300"
        value={input}
        placeholder='Ask me about your data...'
        onChange={(e) => setInput(e.target.value)}
        rows="3"
      />
      <button className="bg-gray-800 text-white font-bold p-2 rounded hover:bg-gray-600 mt-4" onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBot;
