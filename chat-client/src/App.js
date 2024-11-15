import React, { useState } from 'react';
import './App.css';
import Login from '../src/components/Login';
import ChatBox from '../src/components/ChatBox';

function App() {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null);

  const handleLogin = (user) => {
    setUsername(user);
    const socket = new WebSocket('wss://letschatit.up.railway.app');
    socket.onopen = () => {
      setIsConnected(true);
      setWs(socket);
      socket.send(user); // Send the username to the server
    };
    socket.onclose = () => {
      setIsConnected(false);
    };
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  };

  return (
    <div className="App">
      {!isConnected ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatBox username={username} websocket={ws} />
      )}
    </div>
  );
}

export default App;
