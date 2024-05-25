import React, { useState } from 'react';
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase';
import OpenAI from 'openai';

const db = getFirestore(app);
const storage = getStorage(app);
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
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
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

  const getPrompt = (fileStatus) => {return fileStatus ? "tell the user that the dataset has been processed and they will be directed to a new page" : "greet the user, respond to any of their questions, and after that ask them to upload a dataset"};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMsg('No file selected');
      return;
    }
    
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setMsg('Upload In Progress');
    setProgress((prevState) => ({ ...prevState, started: true }));

    uploadTask.on('state_changed', 
      (snapshot) => {
        const percentageCompleted = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress((prevState) => ({
          ...prevState,
          percentageCompleted,
        }));
      }, 
      (error) => {
        setMsg('Upload Failed');
        console.log(error);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "files"), {
          name: file.name,
          url: downloadURL,
          timestamp: new Date()
        });
        setMsg('Upload Successfully Completed');
        setFileStatus(true);
      }
    );
  };

  const handleChatSubmit = async () => {
    if (!input.trim()) return;
    const prompt = getPrompt(fileStatus)

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
        <h1>Upload file</h1>
        <Input onChange={handleFileChange} type="file" />
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
