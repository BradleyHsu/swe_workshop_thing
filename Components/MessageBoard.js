import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import * as db_operations from '../db_operations.js';

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    db_operations.getPrompt().then(prompt => {
      setPromptText(prompt);
    });

    db_operations.getMessages().then(messages => {
      setMessages(messages);
    });
  }, []);

  const handleSend = async () => {
    const userID = 'myUserID'; // replace with your actual userID
    const commentID = '1'; // replace with your actual commentID
    await db_operations.respondToPrompt(userID, inputText, commentID);
    setMessages([...messages, inputText]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>{promptText}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.messageContainer}>
          {messages.map((message, index) => (
            <View key={index} style={styles.message}>
              <Text style={styles.username}>username</Text>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setInputText(text)}
          value={inputText}
          placeholder="Add a comment..."
        />
        <Button title="Post" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 20,
  },
  message: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default MessageBoard;
