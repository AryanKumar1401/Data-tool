import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageComponent = ({ imageId }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [imageError, setImageError] = useState(false);
  const [fileCreated, setFileCreated] = useState(false);
  const [readyToDisplay, setReadyToDisplay] = useState(false);

  useEffect(() => {
    if (!imageId) return;

    const checkFileExists = async () => {
      try {
        const response = await axios.get(`/api/check-file/${imageId}`);
        setImageSrc(response.data.filePath);
        setFileCreated(true);
        clearInterval(intervalId); // Stop polling once the file is found
      } catch (error) {
        console.log('File not found yet, checking again...');
      }
    };

    // Poll for the file existence every 2 seconds
    const intervalId = setInterval(checkFileExists, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [imageId]);

  useEffect(() => {
    if (fileCreated) {
      const timerId = setTimeout(() => {
        setReadyToDisplay(true);
      }, 5000); // Wait for 5 seconds

      // Cleanup timer on component unmount or when fileCreated changes
      return () => clearTimeout(timerId);
    }
  }, [fileCreated]);

  return (
    <>
      {readyToDisplay && imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt="Visualization"
          className="mt-5"
          onError={() => setImageError(true)}
        />
      ) : (
        imageError ? <p>Image not found.</p> : <p>Loading image...</p>
      )}
    </>
  );
};

export default ImageComponent;
