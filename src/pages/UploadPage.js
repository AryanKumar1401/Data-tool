//IMPORTS START


//WE NEED TO ORIGINALIZE CODE SNIPPETS

import React, { useState } from 'react';
import styled from 'styled-components';
import {ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import OpenAI from 'openai';
import { storage } from '../firebase'; // Import your initialized Firebase storage instance

//IMPORTS END
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Initialize OpenAI API END


//CSS START

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


//CSS STYLE ENDS


//PAGE FUNCTION STARTS

const UploadPage = () => {

  //CONST DEFINITION START
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [fileStatus, setFileStatus] = useState(false);
  const [percent, setPercent] = useState(0);


  //GET PROMPT FUNCTION (NOT ESSENTIAL - CAN BE CHANGED)
  const getPrompt = (fileStatus) => {
    return fileStatus ? "tell the user that the dataset has been processed and they will be directed to a new page" : "greet the user, respond to any of their questions, and after that ask them to upload a dataset";
  };
  //GET PROMPT FUNCTION (NOT ESSENTIAL - CAN BE CHANGED) END


  //FILE CHANGE HANDLER START
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

   //FILE CHANGE HANDLER END

//FILE UPLOAD HANDLER START

  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }

   //FILE UPLOAD HANDLER END


   //FUNCTIONS FOR HANDLING UPLOADS
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
      async () => {
        try {
          // Upload completed, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File uploaded successfully. Download URL:", downloadURL);

          // Pass the download URL to OpenAI API for processing
          const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "user",
                content: downloadURL, // Pass the download URL as input to the API
              },
            ],
          });

          // Process OpenAI response...
        } catch (error) {
          console.error('Error with OpenAI API:', error);
        }
      }
    );
  };


//FUNCTION TO HANDLE AFTER CLICKING SUBMIT
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


  //FRONTEND

  return (
    <PageContainer>
      <FormContainer>
        <h1>Drag, drop, or upload file</h1>
        <label htmlFor="file-upload" className="custom-file-upload">
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
