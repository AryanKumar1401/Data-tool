import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';




export const uploadFileToFirebase = (file, setProgress, setFileURL, setMsg, setMessages) => {
  const storageRef = ref(storage, `/files/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress({ started: true, percentageCompleted: percent });
    },
    (error) => {
      console.error("Error uploading file:", error);
      setMsg("Error uploading file");
    },



    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    
      setFileURL(downloadURL);
      setMsg("File uploaded successfully!");

      const fileUploadedMessage = { text: `File uploaded! You can now interact with it.`, isUser: false };
      setMessages((prevMessages) => [...prevMessages, fileUploadedMessage]);

      return downloadURL;

     
    }
   
  );
};


export const fetchFileFromURL = async (downloadURL) => {
  const response = await fetch(downloadURL);
  const blob = await response.blob();
  return blob;
};


