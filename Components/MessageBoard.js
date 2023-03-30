import React, { useState, useEffect } from 'react';
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
import {
  getDatabase,
  ref,
} from 'firebase/database';
import {app} from '../src/firebase/config';


const MessageBoard = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [likedResponseIDs, setLikedResponseIDs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptID, setPromptID] = useState('');
  const SORTBYTOP = 0
  const SORTBYNEW = 1
  const SORTBYOLD = 2
  const { username } = route.params;
  useEffect(() => {
    db_operations.getPrompt().then(prompt => {
      if ([prompt.text, prompt.promptID].includes(undefined)) {
        console.error("got undefined in useEffect")
      }
      setPromptText(prompt.text);
      setPromptID(prompt.promptID);

      db_operations.getResponses(prompt.promptID).then(messages => {
        setMessages(messages);
      });
      db_operations.getLikedMessages(username).then(likedMessages =>{
       setLikedResponseIDs(likedMessages)
      });
    });
    const db = getDatabase(app);
    const promptsRef = ref(db, 'prompt/prompts');

    console.log(promptsRef)
    promptsRef.on('child_added', (snapshot, prevChildKey) => {
      db_operations.getPrompt().then(prompt => {
        if ([prompt.text, prompt.promptID].includes(undefined)) {
          console.error("got undefined in useEffect")
        }
        setPromptText(prompt.text);
        setPromptID(prompt.promptID);

        db_operations.getResponses(prompt.promptID).then(messages => {
          setMessages(messages);
        });
        db_operations.getLikedMessages(username).then(likedMessages =>{
        setLikedResponseIDs(likedMessages)
        });
      });
    });

    return () => {
      promptsRef.off('child_added')
    }
  }, []);

  const getCompareFunc = (sortType) => {
    if (sortType === SORTBYTOP) {
      return (message_a, message_b) => { 
        if (message_a.likeCount > message_b.likeCount) {
          return 1
        } else if (message_a.likeCount < message_b.likeCount) {
          return -1
        } else { 
          return 0
        }
      }
    } else if (sortType === SORTBYNEW) {
      return (message_a, message_b) => {
        if (message_a.timestamp > message_b.timestamp) {
          return 1
        } else if (message_a.timestamp < message_b.timestamp) {
          return -1
        } else {
          return 0
        }
      }
    } else if (sortType === SORTBYOLD) {
      return (message_a, message_b) => {
        if (message_a.timestamp > message_b.timestamp) {
          return -1
        } else if (message_a.timestamp < message_b.timestamp) {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  const handleSort = async (sortType) => {
    const compare = getCompareFunc(sortType)
    var new_messages = await db_operations.getResponses(promptID)
    console.log(messages)
    new_messages.sort(compare)
    console.log(messages)
    setMessages(new_messages)
    
  }

  const handleSend = async () => {
    const userID = username;
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

  const handleLike = async (username, posterUsername, promptID, responseID) => {
    console.debug(likedResponseIDs)
    const newLikedResponseIDs = await db_operations.handleLike(username, posterUsername, promptID, responseID)
    console.debug('liked responmes',newLikedResponseIDs)
    setLikedResponseIDs(newLikedResponseIDs);
    db_operations.getResponses(promptID).then(messages => {
      setMessages(messages);
    });
  };
  const handleDislike = async (username, posterUsername, promptID, responseID) => {
    console.debug(likedResponseIDs)
    const newLikedResponseIDs = await db_operations.handleDislike(username, posterUsername,promptID, responseID)
    console.debug('disliked responmes',newLikedResponseIDs)
    setLikedResponseIDs(newLikedResponseIDs);
    db_operations.getResponses(promptID).then(messages => {
      setMessages(messages);
    });
  };

  const handleLongPress = async (username, posterUsername, promptID, responseID) => {
    if ([username, posterUsername, promptID, responseID].includes(undefined)) {
      console.error(`got undefined in handleLongPress: username: ${username}, posterUsername: ${posterUsername}, promptID: ${promptID}, responseID: ${responseID}`)
      
    }
    console.debug(`handlelongpress: ${username}, posterUsername: ${posterUsername}, promptID: ${promptID}, responseID: ${responseID}`)
    if (likedResponseIDs.includes(responseID)) {
      await handleDislike(username, posterUsername, promptID, responseID)
    } else {
      await handleLike(username, posterUsername, promptID, responseID)
    }
  }
  
  const handleReply = (responseText, responseID, userID) => {
    if ([responseText, responseID, userID].includes(undefined)) {
      console.error("got undefined in handleReply")
    }
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

  const getLikes = async (responseID) => {
    return await db_operations.getLikes(promptID,responseID)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.qotd}>Question of the Day: </Text>
        <Text style={styles.logo}>{promptText}</Text>
      </View>
      <Button onPress = {
        () => handleSort(SORTBYTOP)
      } title = "Top" />
      <Button onPress = {
        () => handleSort(SORTBYNEW)
      } title = "New" />
      <Button onPress = {
        () => handleSort(SORTBYOLD)
      } title = "Old" />
      <Button onPress = {
        () => db_operations.setPrompt(Date.now().toString() + " new prompt" )
      } title = "send new prompt" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.messageContainer}>
          {messages.map((message, index) => (
            <View key={index}
            style={[
              styles.message,
              likedResponseIDs != undefined && likedResponseIDs.includes(message.responseID) && styles.likedMessage,
            ]}>
              <TouchableOpacity
                onLongPress={() => {
                  handleLongPress(username, message.userID, promptID, message.responseID)
                  }
                }
                onPress={() => {
                    handleReply(message.text, message.responseID, message.userID)
                  }
                }>
                <Text style={styles.username} onPress={
                  () => {
                    navigation.navigate('ProfilePage', {
                      username: message.userID,
                    });
                  }
                }>{message.userID}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.likeCountText}>Likes: {message.likeCount}</Text>
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
    height: 70,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  qotd: {
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    fontSize: 20,
  },
  logo: {
    fontFamily: 'Helvetica',
    fontSize: 20,
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
  likedMessage: {
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  likeCountText: {
    color: 'black',
    fontWeight: 'bold',
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
    marginBottom: 15,
    fontSize: 16,

  },
});

export default MessageBoard;
