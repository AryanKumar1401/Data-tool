import React from 'react';

const ChatBox = ({ messages, input, setInput, handleChatSubmit }) => {
  return (
    <div className="flex flex-col items-center w-1/3 ml-5 bg-white p-5 border border-gray-300 h-4/5 overflow-y-auto">
      <div className="flex flex-col items-start w-full mt-5">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded my-1 ${msg.isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
            {msg.isUser && msg.text}
            {!msg.isUser && msg.text.value}
          </div>
        ))}
      </div>
      <textarea
        className="w-full p-2 mt-2 border border-gray-300"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="3"
      />
      <button className="bg-gray-800 text-white font-bold p-2 rounded hover:bg-gray-600 mt-4" onClick={handleChatSubmit}>Send</button>
    </div>
  );
};

export default ChatBox;
