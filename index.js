const express = require('express');
const path = require('path');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { useState } = require('react');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 3000;


const serviceAccount = require(process.env.FIREBASE_PATH); // Replace with your Firebase service account key


admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 storageBucket: 'data-tool-6c41e.appspot.com' // Replace with your Firebase project ID
});


const bucket = admin.storage().bucket();


const openai = new OpenAI({
 apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});


// Set up storage engine for Multer
const storage = multer.diskStorage({
 destination: './uploads/',
 filename: (req, file, cb) => {
   cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
 }
});


// Initialize upload variable
const upload = multer({ storage: storage });


// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
 fs.mkdirSync(uploadDir);
}


// Ensure the downloads directory exists
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
 fs.mkdirSync(downloadDir);
}


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
 try {
   if (!req.file) {
     throw new Error('No file selected!');
   }


   const filePath = req.file.path;


   const file = await openai.files.create({
     file: fs.createReadStream(filePath),
     purpose: 'assistants',
   });


   console.log('File uploaded successfully:', file.id);


   res.json({
     message: 'File uploaded successfully!',
     fileId: file.id,
   });
 } catch (error) {
   console.error('Error uploading file:', error);
   res.status(500).json({ message: 'Failed to upload file to OpenAI.' });
 }
});


let storedAssistantId = null;
app.post('/api/create-assistant', async (req, res) => {
 const { fileId } = req.body;
 try {
   const assistant = await openai.beta.assistants.create({
     name: "Data Visualizer",
     description: "You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
     model: "gpt-4o",
     tools: [{ type: "code_interpreter" }],
     tool_resources: {
       "code_interpreter": {
         "file_ids": [fileId],
       },
     },
   });


   console.log('Assistant created successfully:', assistant.id);
   storedAssistantId = assistant.id;


   res.json({ id: assistant.id });
 } catch (error) {
   console.error('Error creating assistant:', error);
   res.status(500).json({ message: 'Failed to create assistant.' });
 }
});


//CLEANSER START


let storedAssistantIdClean = null;
app.post('/api/create-assistantClean', async (req, res) => {
 const { fileId } = req.body;
 try {
   const assistant = await openai.beta.assistants.create({
     name: "Data Cleanser",
     description: "You are great at cleaning data. You analyze data present in .csv files, understand trends, missing values, and corrections to be made, and make necessary adjustments. You also share a brief text summary of the cleaning you have performed. Your final output should be the file produced.",
     model: "gpt-4o",
     tools: [{ type: "code_interpreter" }],
     tool_resources: {
       "code_interpreter": {
         "file_ids": [fileId],
       },
     },
   });


   console.log('Assistant created successfully:', assistant.id);
   storedAssistantIdClean = assistant.id;


   res.json({ id: assistant.id });
 } catch (error) {
   console.error('Error creating assistant:', error);
   res.status(500).json({ message: 'Failed to create assistant.' });
 }
});


let storedThreadIdClean = null;
async function createThreadClean(fileId) {
 try {
   const thread = await openai.beta.threads.create({
     messages: [
       {
         role: "user",
         content: "Create a csv file that adds an extra row of random numbers. Return the csv file with a link to download it",
         attachments: [{ file_id: fileId, tools: [{ type: "code_interpreter" }] }],
       },
     ],
   });


   storedThreadIdClean = thread.id;
   console.log('Thread created successfully:', thread.id);


   return storedThreadIdClean;
 } catch (error) {
   console.error('Error creating thread:', error);
   throw new Error('Failed to create thread.');
 }
}




let runIdToBeStoredClean = null;
async function createRunClean() {
 try {
   const run = await openai.beta.threads.runs.createAndPoll(storedThreadIdClean, {
     assistant_id: storedAssistantIdClean,
     instructions: "Please create the csv."
   });


   runIdToBeStoredClean = run.id;
   console.log("Run created successfully:", runIdToBeStoredClean);
   return runIdToBeStoredClean;
 } catch (error) {
   console.error("Error:", error);
   throw new Error('Failed to create run.');
 }
}




app.post('/api/create-threadClean', async (req, res) => {
 const { fileId } = req.body;
 try {
   const threadId = await createThreadClean(fileId);
   res.json({ id: threadId });
 } catch (error) {
   console.error('Error:', error);
   res.status(500).json({ message: error.message });
 }
});


app.post('/api/get-responseClean', async (req, res) => {
 try {
   const messages = await openai.beta.threads.messages.list(storedThreadIdClean);
   res.json({ messages: messages.data });
 } catch (error) {
   console.error('Error with OpenAI API:', error);
   res.status(500).json({ error: 'An error occurred' });
 }
});


app.post('/api/run-threadClean', async (req, res) => {
 try {
   //const runId = await createRunClean();
  //  if (!runIdToBeStoredClean) {
  //    throw new Error('No run Id available to run.');
  //  }


   // Polling mechanism to see if runStatus is completed
   let runStatus;
  //  do {
  //    await new Promise((resolve) => setTimeout(resolve, 2000));
  //    runStatus = await openai.beta.threads.runs.retrieve(storedThreadIdClean, runIdToBeStoredClean);
  //    console.log('Thread status:', runStatus.status);
  //    // if (runStatus.status === "failed") break;
  //  } while (runStatus.status !== "completed");


   console.log('Thread completed successfully.');


   storedThreadIdClean = "thread_2UAAKr5wUzaur7HflxskE3Pg";


   const messages = await openai.beta.threads.messages.list(storedThreadIdClean);


   //display thread messages
   for (var i = 0; i < messages.data.length; i++) {
     // console.log("Message", i, " ", messages.data[i].content[0]);
     console.log("Message", i, " ", messages.data[i].content[0]); //.image_file.file_id
   }


   const fileId = messages.data[0].content[0].text.annotations[0].file_path.file_id


  
   console.log("Clean data File ID: ",fileId)
   const cleanFile = await openai.files.content(fileId);
   // console.log(viz.headers);
   const bufferView = new Uint8Array(await cleanFile.arrayBuffer());
   const cleanFilePath = `./public/clean/${fileId}.csv`;
   fs.writeFileSync(cleanFilePath, bufferView);
   console.log("the cleaned data is saved");
  
   // Upload the file to Firebase Storage
   await bucket.upload(cleanFilePath, {
     destination: `csv/${fileId}.csv`, // Updated destination path
     metadata: {
       contentType: 'text/csv', // Correct content type for CSV
     },
   });
  
   // Get the public URL of the uploaded file
   const file = bucket.file(`csv/${fileId}.csv`); // Updated path to match the upload
   const [url] = await file.getSignedUrl({
     action: 'read',
     expires: '03-01-2500', // Set a far future expiration date
   });
  
   console.log('File uploaded to Firebase and accessible at:', url);
  
   res.json({ fileUrl: url });
 } catch (error) {
   console.error('Error:', error);
   res.status(500).json({ message: error.message });
 }
});




//CLEANSER END


var storedThreadId = null;


async function createThread(fileId) {
 try {
   const thread = await openai.beta.threads.create({
     messages: [
       {
         role: "user",
         content: "create a line graph for this file. Use your best intuition for what the columns and the corresponding data should be, but you must return a line graph.",
         attachments: [{ file_id: fileId, tools: [{ type: "code_interpreter" }] }],
       },
     ],
   });


   storedThreadId = thread.id;
   console.log('Thread created successfully:', thread.id);


   return storedThreadId;
 } catch (error) {
   console.error('Error creating thread:', error);
   throw new Error('Failed to create thread.');
 }
}


let runIdToBeStored = null;


async function createRun() {
 try {
   const run = await openai.beta.threads.runs.createAndPoll(storedThreadId, {
     assistant_id: storedAssistantId,
     instructions: "Please create the visualizations."
   });


   runIdToBeStored = run.id;
   console.log("Run created successfully:", runIdToBeStored);
   return runIdToBeStored;
 } catch (error) {
   console.error("Error:", error);
   throw new Error('Failed to create run.');
 }
}


app.post('/api/create-thread', async (req, res) => {
 const { fileId } = req.body;
 try {
   const threadId = await createThread(fileId);
   res.json({ id: threadId });
 } catch (error) {
   console.error('Error:', error);
   res.status(500).json({ message: error.message });
 }
});


app.post('/api/get-response', async (req, res) => {
 try {
   const messages = await openai.beta.threads.messages.list(storedThreadId);
   res.json({ messages: messages.data });
 } catch (error) {
   console.error('Error with OpenAI API:', error);
   res.status(500).json({ error: 'An error occurred' });
 }
});

var messages;
app.post('/api/run-thread', async (req, res) => {
 try {
   const runId = await createRun();
   if (!runIdToBeStored) {
     throw new Error('No run Id available to run.');
   }


   // Polling mechanism to see if runStatus is completed
   let runStatus;
   do {
     await new Promise((resolve) => setTimeout(resolve, 2000));
     runStatus = await openai.beta.threads.runs.retrieve(storedThreadId, runIdToBeStored);
     console.log('Thread status:', runStatus.status);
     //if (runStatus.status === "failed") break;
   } while (runStatus.status !== "completed");


   console.log('Thread completed successfully.');

    //if (runStatus.status === "failed") storedThreadId = "thread_RBtWGbi8B0fNu6gVCREGTp4o";

  messages = await openai.beta.threads.messages.list(storedThreadId);


   //display thread messages
   for (var i = 0; i < messages.data.length; i++) {
     console.log("Message", i, " ", messages.data[i].content[0]);
     if (messages.data[i].content[0].type == "image_file") {
      imageId = messages.data[i].content[0].image_file.file_id;
    }
   }

   
   console.log("image id", imageId);
   const viz = await openai.files.content(imageId);
   console.log(viz.headers);
   const bufferView = new Uint8Array(await viz.arrayBuffer());
   const imagePath = `./public/visualizations/${imageId}.png`;
   fs.writeFileSync(imagePath, bufferView);
   console.log("the image is saved");


   // Upload the file to Firebase Storage
   await bucket.upload(imagePath, {
     destination: `visualizations/${imageId}.png`,
     metadata: {
       contentType: 'image/png',
     },
   });


   // Get the public URL of the uploaded file
   const file = bucket.file(`visualizations/${imageId}.png`);
   const [url] = await file.getSignedUrl({
     action: 'read',
     expires: '03-01-2500', // Set a far future expiration date
   });

   console.log('File uploaded to Firebase and accessible at:', url);

   res.json({ imageUrl: url, messages: messages.data, fileContent: viz });


 } catch (error) {
   console.error('Error:', error);
   res.status(500).json({ message: error.message });
 }
});

app.post('/api/get-initial-response', async (req, res) => {
  const { fileId } = req.body;
  try {
    const response = await openai.beta.threads.messages.create(
      storedThreadId,
      {
        role: "user",
        content: `Say "Hello, I'm your personal Data Tool! I can provide you with statistics, summaries, and insights into the provided data."`
      }
    );

    //create the run that responds as the first message
    const run1 = await openai.beta.threads.runs.create(storedThreadId, {
      assistant_id: storedAssistantId,
    });
    console.log("ChatBot run started")
    var runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(storedThreadId, run1.id);
      console.log('Thread status:', runStatus.status);
      //if (runStatus.status === "failed") break;

    } while (runStatus.status !== "completed");
    console.log('Run completed successfully.');

    //if (runStatus.status === "failed") storedThreadId = "thread_RBtWGbi8B0fNu6gVCREGTp4o";


    messages = await openai.beta.threads.messages.list(
      storedThreadId
    );
    for (var i = 0; i<messages.data.length; i++) {
      console.log("Updated Message",i, " ",messages.data[i].content[0]);
    }


    res.json({ messages: messages.data });
  } catch (error) {
    console.error('Error getting initial response:', error);
    res.status(500).json({ message: 'Failed to get initial response.' });
  }
});

app.post('/api/send-message', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.beta.threads.messages.create(
      storedThreadId,
      {
        role: "user",
        content: message
      }
    );

    //create the run that responds as the first message
    const run2 = await openai.beta.threads.runs.create(storedThreadId, {
      assistant_id: storedAssistantId,
    });
    console.log("ChatBot Response run started")
    var runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(storedThreadId, run2.id);
      console.log('Thread status:', runStatus.status);
      //if (runStatus.status === "failed") break;

    } while (runStatus.status !== "completed");
    console.log('Run completed successfully.');

    //if (runStatus.status === "failed") storedThreadId = "thread_RBtWGbi8B0fNu6gVCREGTp4o";


    messages = await openai.beta.threads.messages.list(
      storedThreadId
    );
    for (var i = 0; i<messages.data.length; i++) {
      console.log("Updated Chat Message",i, " ",messages.data[i].content[0]);
    }


    res.json({ messages: messages.data });
  } catch (error) {
    console.error('Error getting initial response:', error);
    res.status(500).json({ message: 'Failed to get initial response.' });
  }
});



// Catch-all handler to serve the React app
app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
