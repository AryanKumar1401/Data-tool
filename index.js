const express = require('express');
const path = require('path');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

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

let storedThreadId = null;

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

app.post('/api/run-thread', async (req, res) => {
  try {
    const runId = await createRun();
    if (!runIdToBeStored) {
      throw new Error('No run Id available to run.');
    }

    //res.json({ id: runIdToBeStored });

    // Polling mechanism to see if runStatus is completed
    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(storedThreadId, runIdToBeStored);
      console.log('Thread status:', runStatus.status);
    } while (runStatus.status !== "completed");

    console.log('Thread completed successfully.');

    // Get the last assistant message from the messages array
    const messages = await openai.beta.threads.messages.list(storedThreadId);

    //display thread messages 
    for (var i = 0; i<messages.data.length; i++) {
        console.log("Message",i, " ",messages.data[i].content[0]);
      }
      const imageId = messages.data[0].content[0].image_file.file_id;
      console.log("image id", imageId);
      const viz = await openai.files.content(imageId);
      console.log(viz.headers);
      const bufferView = new Uint8Array(await viz.arrayBuffer());
      fs.writeFileSync("./visualizations/"+imageId+".png", bufferView);

    // for (let i = 0; i < storedThreadOutputArray.length; i++) {
    //   const message = storedThreadOutputArray[i];
    //   if (message.image_url) {
    //     // Handle image URL
    //     console.log(`Downloading image from URL: ${message.image_url}`);
    //     await downloadImage(message.image_url, path.join(downloadDir, `image_${i + 1}.png`));
    //   } else if (message.image_data) {
    //     // Handle base64 encoded image
    //     console.log(`Saving base64 image: image_${i + 1}.png`);
    //     saveBase64Image(message.image_data, path.join(downloadDir, `image_${i + 1}.png`));
    //   }
    // }
    // console.log('All images processed.');

    res.json({ messages: bufferView });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Function to download and save an image from a URL
async function downloadImage(url, filePath) {
  try {
    const response = await axios({
      url,
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(filePath, response.data);
    console.log(`Image saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error);
  }
}

// Function to decode base64 and save as image
function saveBase64Image(base64String, filePath) {
  try {
    const imageData = Buffer.from(base64String, 'base64');
    fs.writeFileSync(filePath, imageData);
    console.log(`Base64 image saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to save base64 image to ${filePath}:`, error);
  }
}

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
