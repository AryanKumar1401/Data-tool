const express = require('express');
const path = require('path');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({ storage: storage });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {

//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ message: err });
//     } else {
//       if (req.file == undefined) {
//         return res.status(400).json({ message: 'No file selected!' });
//       } else {
//         const filePath = req.file.path;
//         const openai = new OpenAI({
//           apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//         });

//         fs.createReadStream(filePath).pipe(openai.files.create({
//           file: fs.createReadStream(filePath),
//           purpose: 'assistants',
//         })).then(file => {
//           res.json({
//             message: 'File uploaded successfully!',
//             fileId: file.id,
//           });
//         }).catch(error => {
//           console.error('Error uploading file to OpenAI:', error);
//           res.status(500).json({ message: 'Failed to upload file to OpenAI.' });
//         });
//       }
//     }
//   });
        const filePath = req.file.path;
        const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const file = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: 'assistants',
          });
      
          res.json({
            message: 'File uploaded successfully!',
            fileId: file.id,
          });
        });
        
app.post('/api/create-assistant', async (req, res) => {
  const { fileId } = req.body;
  try {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

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

    res.json({ id: assistant.id });
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ message: 'Failed to create assistant.' });
  }
});

app.post('/api/create-thread', async (req, res) => {
  const { fileId, assistantId } = req.body;
  try {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    const thread = await openai.beta.threads.create({
      //assistant_id: assistantId,
      messages: [
        {
          role: "user",
          content: "Create 3 data visualizations based on the trends in this file.",
          attachments: [{ file_id: fileId, tools: [{ type: "code_interpreter" }] }],
        },
      ],
    });

    res.json({ id: thread.id });
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ message: 'Failed to create thread.' });
  }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
