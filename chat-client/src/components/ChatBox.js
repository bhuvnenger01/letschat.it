import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';

function ChatBox({ username, websocket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    websocket.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  }, [websocket]);

  const handleSendMessage = (message) => {
    if (message.trim()) {
      websocket.send(message);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Welcome, {username}</h2>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatBox;
