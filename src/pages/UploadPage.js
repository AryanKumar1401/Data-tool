import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Form = styled.form`
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

/*ARYAN DOWN*/

// const UploadPage = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'processed-file';
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

/*Aryan UP*/

  

  const UploadPage = () => {
    const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({started: false, percentageCompleted: 0});
  const [msg, setMsg] = useState(null);

  function handler () {

    if(!file) {
      setMsg('No file selected');
      return;
    } 
    const dataForm = new FormData();
    dataForm.append('file', file);

    setMsg('Upload In Progress');

    setProgress(prevState => {
      return {...prevState, started: true}
    })

    axios.post('http://httpbin.org/post', dataForm, {
      onUploadProgress: (ProgressEvent) => {setProgress(prevState => {
        return {...prevState, percentageCompleted: ProgressEvent.progress*100}
      })

      },
      headers: {
        'Custom-Header': 'Value',
      }
    })
    .then(response => {
      setMsg("Upload Successfully Completed");
      console.log(response.data);

    })
      
    .catch(err => {
      setMsg("Upload Failed");
      console.log(err);


    });
    

  }
  return (

    
    /*Starting my code*/

    <PageContainer>
       <h1>Upload file</h1>

<Input onChange={(e) => {setFile(e.target.files[0])}} type='file'/>

<Button onClick={handler}>Upload here</Button>

{progress.started && <progress max = "100" value ={progress.percentageCompleted}></progress>}
{msg && <span>{msg}</span>}

    </PageContainer>

   
     

    







    /*The BELOW CODE IS ARYAN'S*/
    // <PageContainer>
    //   <h1>Upload File</h1>
    //   <Form onSubmit={handleSubmit}>
    //     <Input type="file" onChange={handleFileChange} />
    //     <Button type="submit">Upload</Button>
    //   </Form>
    // </PageContainer>
  );
  };

export default UploadPage;
