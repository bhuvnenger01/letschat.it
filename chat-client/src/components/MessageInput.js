import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');



  const handleSendClick = () => {
    onSendMessage(message);
    setMessage('');
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleEnterPress}
        placeholder="Type a message"
      />
      <button onClick={handleSendClick}>Send</button>
    </div>
  );
}

export default MessageInput;
