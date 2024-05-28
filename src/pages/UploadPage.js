import React, { useState } from 'react';
import { uploadFileToFirebase, fetchFileFromURL } from '../utils/firebaseUpload';
import { getOpenAIResponse } from '../utils/openai';
import FileUpload from '../components/FileUpload';
import ChatBox from '../components/ChatBox';
import ChartComponent from '../components/ChartComponent';
import Papa from 'papaparse';
import axios from 'axios';
import openai from 'openai'; // Ensure this is the correct import

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [progress, setProgress] = useState({ started: false, percentageCompleted: 0 });
  const [msg, setMsg] = useState(null);
  const [messages, setMessages] = useState([]); //WE HAVE SOME OVERLAPS
  const [input, setInput] = useState('');
  const [, setFileURL] = useState('');
  const [chartData, setChartData] = useState(null);

  // OPEN AI ASSISTANT API START

  const assistantsfeeder = async () => {
    try {
      let urlToDownload = await uploadFileToFirebase(file, setProgress, setFileURL, setMsg, setMessages);
      let fetchFile = await fetchFileFromURL(urlToDownload);

      // Upload the file to OpenAI and create the assistant
      const fileUploadResponse = await openai.files.create({
        file: fetchFile,
        purpose: "fine-tune",
      });

      const assistant = await openai.assistants.create({
        name: "Data visualizer",
        description: "You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
        model: "gpt-4",
        tools: [{ type: "code_interpreter" }],
        tool_resources: {
          code_interpreter: {
            file_ids: [fileUploadResponse.id],
          },
        },
      });

      const thread = await openai.threads.create({
        assistant_id: assistant.id,
        messages: [
          {
            role: "user",
            content: "Create 3 data visualizations based on the trends in this file.",
            attachments: [
              {
                file_id: fileUploadResponse.id,
                tools: [{ type: "code_interpreter" }],
              },
            ],
          },
        ],
      });

      const run = await openai.beta.threads.runs.create(
        thread.id,
        { assistant_id: assistant.id }
      );

      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );




    

      console.log('Assistant and thread created successfully:', thread);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    }
  };


  const getMessage = (m) => {
    let messageArray = [];


const i = 0;
    for (i = 0; i < m.data; i++) {
      if(m.data[i] == "assistant") {
        const j = 0;
        for(j = 0; j<m.data[i].content.length; j++) {
          if(m.data[i].content[j].type == "image-file") {
            const temp = m.data[i].content[j]
            const image = openai.files.temp(temp.image_file.file_id) //SOMETHING OFF
            messageArray.push(image);
          }
          else {
            break;
          }

        }
      }
    } 

    return messageArray;
  }

  async function processImages() {
    try {
      // Iterate over each image in the array
      for (let i = 0; i < imageArray.length; i++) {
        const imageData = imageArray[i];
        
        // Process image with sharp
        const processedImage = await sharp(Buffer.from(imageData, 'base64'))
          .resize(200, 100) // Example resize
          .toFile(`output_${i}.jpg`);
  
        console.log(`Image ${i} processed successfully:`, processedImage);
      }
      console.log('All images processed successfully');
    } catch (error) {
      console.error('Error processing images:', error);
    }
  }

  // def get_images(messages):
  //   image_files = []
  //   for data in messages.data:
  //       if data.role == "assistant":
  //           for content in data.content:
  //               if content.type == "image_file":
  //                   image = client.files.content(content.image_file.file_id)
  //                   image_files.append(image)
  //       else: 
  //           break
  //   return image_files



  


  

  // OPEN AI ASSISTANT API END

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
