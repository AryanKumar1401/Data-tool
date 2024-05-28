import React, { useState } from 'react';
import { uploadFileToFirebase, fetchFileFromURL } from '../utils/firebaseUpload';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import ChartComponent from '../components/ChartComponent';
import {getOpenAIResponse} from '../utils/openai'
import Papa from 'papaparse';
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [, setFileURL] = useState('');
  const [chartData, setChartData] = useState(null);

  // OPEN AI ASSISTANT API START
  const assistantsfeeder = async () => {
    try {
      const urlToDownload = await uploadFileToFirebase(file, setProgress, setFileURL, setMsg, setMessages);
      const fetchFile = await fetchFileFromURL(urlToDownload);
      const fileBlob = new Blob([fetchFile], { type: 'application/jsonl' });
      const readableStream = fileBlob.stream();
      const formD = new FormData();
      formD.append('file',file);
    
     

      // Upload the file to OpenAI and create the assistant
      const assistant = await openai.beta.assistants.create({
        name: 'Data visualizer',
        description: 'You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.',
        model: 'gpt-4',
        tools: [{ type: 'code_interpreter' }],
      });
    
      const assistantFile = await openai.files.create(
          {
            file: formD,
            purpose: "fine-tune"
          }
        );

        const thread = await openai.threads.create({
          assistant_id: assistant.id,
          messages: [
            {
              role: 'user',
              content: 'Create 3 data visualizations based on the trends in this file.',
              attachments: [
                {
                  file_id: readableStream.id,
                  tools: [{ type: 'code_interpreter' }],
                },
              ],
            },
          ],
        });
  
        const run = await openai.threads.runs.create({
          thread_id: thread.id,
          assistant_id: assistant.id,
        });
  
        const responseMessages = await openai.threads.messages.list({
          thread_id: run.thread_id,
        });
  
        // Capture the assistant's response and add it to the messages state
        const assistantMessages = responseMessages.data.map(msg => ({
          text: msg.content,
          isUser: false,
        }));
        setMessages(prevMessages => [...prevMessages, ...assistantMessages]);
  
        console.log('Assistant and thread created successfully:', responseMessages);
        console.log(assistantFile);
  
        //return Response.json({ assistantFile: assistantFile });
      } catch (e) {
        console.log(e);
        //return Response.json({ error: e });
      }

      
  
  };

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

  const handleUpload = () => {
    if (!file) {
      alert('Please choose a file first!');
      return;
    }
    assistantsfeeder(); // Use the assistantsfeeder function to handle the file upload and assistant creation
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
        {/* {chartData && <ChartComponent chartData={chartData} />} */}
      </div>
    

    </div>
  );
};

export default UploadPage;
