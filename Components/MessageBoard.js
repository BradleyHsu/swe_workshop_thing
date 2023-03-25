import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as db_operations from '../db_operations.js';

const MessageBoard = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptID, setPromptID] = useState('');
  const {username} = route.params;
  useEffect(() => {
    db_operations.getPrompt().then(prompt => {
      setPromptText(prompt.text);
      setPromptID(prompt.promptID);

      db_operations.getResponses(prompt.promptID).then(messages => {
        setMessages(messages);
      });
    });
  }, []);

  const handleSend = async () => {
    const userID = username; // replace with your actual userID
    const responseID = await db_operations.respondToPrompt(
      userID,
      inputText,
      promptID,
    );
    const newMessage = {
      userID: username,
      text: inputText,
      responseID: responseID,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleReply = (responseText, responseID, userID) => {
    db_operations.getResponses(promptID).then(() => {
      navigation.navigate('ReplyScreen', {
        responseText,
        promptID,
        responseID,
        userID,
        username,
      });
    });
  };

  const handleLike = responseID => {
    db_operations.updateResponseLikeCount(promptID, responseID, true);
  };

  const handleDislike = responseID => {
    db_operations.updateResponseLikeCount(promptID, responseID, false);
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
              <TouchableOpacity
                onPress={() =>
                  handleReply(message.text, message.responseID, message.userID)
                }>
                <Text style={styles.username}>{message.userID}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
              </TouchableOpacity>
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
