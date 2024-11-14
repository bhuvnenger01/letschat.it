// components/ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function ChatScreen({ route }) {
  const { username } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = new WebSocket('ws://letschatit.up.railway.app'); // Your WebSocket server address

  useEffect(() => {
    ws.onopen = () => {
      ws.send(username);
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, { text: event.data }]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      ws.send(message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: { padding: 10, backgroundColor: '#f1f1f1', marginVertical: 5 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
