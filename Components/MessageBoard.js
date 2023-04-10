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
<<<<<<< HEAD
import { ThemeProvider, createTheme } from '@rneui/themed';
import { Dropdown } from 'react-native-material-dropdown';
import { SelectList } from 'react-native-dropdown-select-list'

const theme = createTheme({
  lightColors: {
    primary: '#979797',
    secondary: '#ffffff',
  },
  darkColors: {
    primary: '#555454',
    secondary: '#757373',
    tertiary: '#D9D9D9',
  },
  navigationColors: {
    primary: '#5c64b0',
    secondary: '#E47F7F',
  },
  createCommentColors: {
    first: '#616161',
    second: '#ADADAD',
    third: '#777777',
    fourth: '#A7A7A7',
    fifth: '#DBDBDB',
    sixth: '#403F3F',
    seventh: '#F1F1F1',
  },
  mode: 'light',
});
=======
>>>>>>> master

const MessageBoard = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [likedResponseIDs, setLikedResponseIDs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptID, setPromptID] = useState('');
  const SORTBYTOP = 0
  const SORTBYNEW = 1
  const SORTBYLOCATION = 2
  const SORTBYOLD = 3
  const [sortType, setSortType] = useState(SORTBYTOP)
  const { username } = route.params;
<<<<<<< HEAD
  const [selected, setSelected] = React.useState("");

  const data1 = [
    { key: '1', value: 'best posts' },
    { key: '3', value: 'newest' },
    { key: '4', value: 'oldest' },
  ]

  const data2 = [
    { key: '1', value: 'high to low' },
    { key: '2', value: 'low to high' },
  ]


=======
>>>>>>> master
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
  }, []);

  const getCompareFunc = (sortType) => {
    if (sortType === SORTBYTOP) {
      return (message_a, message_b) => { 
        if (message_a.likeCount < message_b.likeCount) {
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
<<<<<<< HEAD
    <ThemeProvider>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoChalk}
            source={require('../assets/images/chalk_logo.png')}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.qotd}>Question of the Day: </Text>
          <Text style={styles.logo}>{promptText}</Text>
        </View>
        <View style={styles.rank}>
          <View style={styles.rankRocket}>
            <Image
              style={styles.rocket}
              source={require('../assets/icons/rocket_icon.png')}
            />
            <View style={styles.list1}>
              <SelectList
                setSelected={(val) => setSelected(val)}
                data={data1}
                save="value"
                search={false}
                boxStyles={{ borderRadius: 0, height: 45, width: 120, borderColor: '#FFFFFF', paddingLeft: 8 }}
                inputStyles={{ fontSize: 13 }}
                placeholder='best posts'
                onSelect={() => handleSort(SORTBYNEW)}
                dropdownStyles={{ position: "absolute", top: 40, width: "100%", zIndex: 2, borderColor: '#000000', borderrRadius: 10, backgroundColor: '#F1F1F1' }}
              />
            </View>
          </View>
          <View style={styles.rankStack}>
            <Image
              style={styles.stack}
              source={require('../assets/icons/stackview_icon.png')}
            />
            <View style={styles.list2}>
              <SelectList
                setSelected={(val) => setSelected(val)}
                data={data2}
                save="value"
                search={false}
                boxStyles={{ borderRadius: 0, height: 45, width: 120, borderColor: '#FFFFFF', paddingLeft: 8 }} //override default styles
                dropdownStyles={{ position: "absolute", top: 40, width: "100%", zIndex: 2, borderColor: '#000000', borderrRadius: 10, backgroundColor: '#F1F1F1' }}
                inputStyles={{ fontSize: 13 }}
                placeholder='high to low'
                onSelect={() => handleSort(SORTBYOLD)}
              />
            </View>
          </View>
        </View>
        {/* <Button onPress={
          () => handleSort(SORTBYNEW)
        } title="Top" />
        <Button onPress={
          () => handleSort(SORTBYOLD)
        } title="New" />
        <Button onPress={
          () => handleSort(SORTBYTOP)
        } title="Old" /> */}
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
                    handleReply(message.text, message.responseID, message.userID);
                  }
                  }
                >
                  <View style={styles.allInfo}>
                    <View style={styles.headerMessage}>
                      <Image
                        style={styles.profPicture}
                        source={require('../assets/images/dog_picture.jpg')}
                      />
                      <View style={styles.furtherInfo}>
                        <Text style={styles.username} onPress={
                          () => {
                            navigation.navigate('Profile', {
                              username: message.userID,
                            });
                          }
                        }>{message.userID}</Text>
                        <View style={styles.subsetMessage}>
                          <Text style={styles.location}> Los Angeles ~~~ </Text>
                          {/* <View style={styles.dotMessage}>
                            <Text style={styles.dot}> • </Text>
                          </View> */}
                          <Text style={styles.time}> 2 hrs late </Text>
                        </View>
                      </View>
                    </View>
                    <View styles={styles.mainMessage}>
                      <Text style={styles.messageText}>{message.text}</Text>
                    </View>
                  </View>
                  <View style={styles.bottomRow}>
                    <TouchableOpacity >
                      <Image style={styles.upvoteImage} source={require('../assets/icons/upvote_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.likeCountText}>{message.likeCount}</Text>
                    <TouchableOpacity >
                      <Image style={styles.downvoteImage} source={require('../assets/icons/downvote_icon.png')} />
                    </TouchableOpacity>
                    <Image style={styles.commentImage} source={require('../assets/icons/comments_icon.png')} />
                    <Text style={styles.commentNumber}>5</Text>
                    <Image style={styles.shareImage} source={require('../assets/icons/share_icon.png')} />
                    <Text style={styles.shareText}>Share</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => setInputText(text)}
            value={inputText}
            placeholder="Add a comment..."
          />
          <Button title="Post" onPress={handleSend} />
        </View> */}
=======
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
                    if(message.userID === username){
                      navigation.navigate('ProfilePage', {
                        username: username,
                        isDefaultUser: true,
                      });
                    }else{
                      navigation.navigate('ProfilePage', {
                        username: message.userID,
                        isDefaultUser: false,
                      });
                    }
                    
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
>>>>>>> master
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
<<<<<<< HEAD
    fontSize: 15,
    marginTop: 7,
  },
  rank: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 15,
  },
  list1: {
    marginLeft: 0,
  },
  rankRocket: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 5,
  },
  rankStack: {
    flex: 1,
    flexDirection: 'row',
  },
  stack: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
  },
  rocket: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
=======
    fontSize: 20,
>>>>>>> master
  },
  scrollView: {
    flex: 1,
    padding: 10,
    paddingLeft: 28,
    paddingRight: 28,
    zIndex: -2,
    marginBottom: 30,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageText: {
    color: '#616161',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginLeft: 9,
    marginRight: 5,
  },
  allInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  message: {
    backgroundColor: theme.createCommentColors.seventh,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  headerMessage: {
    flex: 1,
    flexDirection: 'row',
  },
  furtherInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  subsetMessage: {
    flex: 1,
    flexDirection: 'row',
  },
  location: {
    color: '#9D9D9D',
    fontSize: 10,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  time: {
    color: '#BDBCBC',
    fontSize: 10,
    marginLeft: -3,
    fontStyle: 'italic',
  },
  profPicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 5,
    marginTop: 5,
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 90,
    marginLeft: 10,
    marginBottom: 5,
  },
  upvoteImage: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    opacity: 0.65,
    marginRight: 5,
  },
  downvoteImage: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    opacity: 0.65,
    marginLeft: 5,
  },
  commentImage: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
    opacity: 0.65,
    marginLeft: 25,
    marginRight: 9,
  },
  commentNumber: {
    color: '#726D6D',
    fontSize: 14,
  },
  shareText: {
    color: '#726D6D',
    fontSize: 13,
  },
  shareImage: {
    width: 27,
    height: 27,
    marginLeft: 25,
    marginTop: -7,
    resizeMode: 'contain',
    opacity: 0.60,
  },
  likedMessage: {
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  likeCountText: {
    color: '#726D6D',
    fontSize: 14,
  },
  username: {
    fontWeight: 'bold',
    color: '#6A6A6A',
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
    fontSize: 11.5,
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
