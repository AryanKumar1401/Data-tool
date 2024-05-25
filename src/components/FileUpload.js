import React from 'react';

const FileUpload = ({ handleFileChange, handleUpload, progress, msg }) => {
  return (
    <div className="flex flex-col items-center p-10 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-xl">
      <h1>Drag, drop, or upload file</h1>
      <label htmlFor="file-upload" className="custom-file-upload cursor-pointer">
        Custom Upload
      </label>
      <input id="file-upload" className="hidden" onChange={handleFileChange} type="file" />
      <button className="bg-gray-800 text-white font-bold p-2 rounded hover:bg-gray-600 mt-4" onClick={handleUpload}>
        Upload here
      </button>
      {progress.started && <progress className="w-full" max="100" value={progress.percentageCompleted}></progress>}
      {msg && <span>{msg}</span>}
    </div>
  );
};

export default FileUpload;
