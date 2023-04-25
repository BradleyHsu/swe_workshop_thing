import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AppContext from '../AppContext';
import * as db_operations from '../db_operations.js';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { Dropdown } from 'react-native-material-dropdown';
import { SelectList } from 'react-native-dropdown-select-list'
import Clock from './Clock';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { MenuProvider } from 'react-native-popup-menu';

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

const MessageBoard = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [likedResponseIDs, setLikedResponseIDs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptID, setPromptID] = useState('');
  const [promptDate, setPromptDate] = useState(0);
  const [showFollowing, setShowFollowing] = useState(false);
  const [profilePics, setProfilePics] = useState({});
  const [hasResponded, setHasResponded] = useState(false);
  const SORTBYTOP = 0
  const SORTBYNEW = 1
  const SORTBYOLD = 3
  const [sortType, setSortType] = useState(SORTBYTOP)
  const { username } = route.params;
  const { usernameC, setUsernameC, promptIDC, setPromptIDC, promptTextC, setPromptTextC, promptDateC, setPromptDateC } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);


  const data1 = [
    { key: SORTBYTOP, value: 'top' },
    { key: SORTBYNEW, value: 'new' },
    { key: SORTBYOLD, value: 'old' },
  ]

  const data2 = [
    { key: '1', value: 'high to low' },
    { key: '2', value: 'low to high' },
  ]


  useEffect(() => {
    db_operations.getPrompt().then(prompt => {
      if ([prompt.text, prompt.promptID].includes(undefined)) {
        console.error("got undefined in useEffect")
      }
      setPromptText(prompt.text);
      setPromptID(prompt.promptID);
      setPromptDate(prompt.date);

      db_operations.getResponses(prompt.promptID).then(messages => {
        setMessages(messages);
        handleSort(sortType)
        fetchProfilePics()
        console.log(messages)
        for (message of messages) {
          if (message.userID === username) {
            console.log(message)
            setHasResponded(true)
          }
        }
      });
      console.log("got messages", messages)
      db_operations.getLikedMessages(username).then(likedMessages => {
        setLikedResponseIDs(likedMessages)
      });
      const refreshMessages = async () => {
        const filteredMessages = await getFilteredMessages();
        filteredMessages.sort(getCompareFunc(sortType));
        setMessages(filteredMessages);
      };
      refreshMessages();

      setPromptIDC(promptID);
      setPromptTextC(promptText);
      setUsernameC(username);
      setPromptDate(promptDate);
      setPromptDateC(promptDate)
    });

  }, [usernameC, promptIDC, promptTextC, showFollowing]);


  const fetchProfilePics = async () => {
    const newProfilePics = { ...profilePics };
    const cur_messages = await db_operations.getResponses(promptID);
    console.log("fetching profile pics", cur_messages);

    for (const message of cur_messages) {
      console.log("getting profile pic of", message.userID)
      newProfilePics[message.userID] = await db_operations.getProfilePic(message.userID);
    }
    setProfilePics(newProfilePics)
    console.log(profilePics)
  };

  const onRefresh = async () => {
    setRefreshing(true);

    db_operations.getPrompt().then(prompt => {
      if ([prompt.text, prompt.promptID].includes(undefined)) {
        console.error("got undefined in useEffect")
      }
      setPromptText(prompt.text);
      setPromptID(prompt.promptID);

      db_operations.getResponses(prompt.promptID).then(messages => {
        for (message of messages) {
          if (message.userID === username) {
            console.log(message)
            setHasResponded(true)
          }
        }
        setMessages(messages);
        handleSort(sortType)
      });
      db_operations.getLikedMessages(username).then(likedMessages => {
        setLikedResponseIDs(likedMessages)
      });

      setPromptIDC(promptID)
      setPromptTextC(promptText)
      setUsernameC(username)

    });
    const filteredMessages = await getFilteredMessages();
    filteredMessages.sort(getCompareFunc(sortType));
    setMessages(filteredMessages);
    fetchProfilePics();
    setRefreshing(false);
  }

  const getFilteredMessages = async () => {
    const allMessages = await db_operations.getResponses(promptID);
    if (showFollowing) {
      const followingUserIds = await db_operations.getFollowing(username);
      console.log("got following usernames: ", followingUserIds);
      console.log("all messages: ", allMessages);


      for (const message of allMessages) {
        console.log("getting user id of", message.userID);
        const userId = await db_operations.getUserIDByUsername(message.userID);
        message.userId = userId;
        console.log("got userId of", userId);
      }

      // Filter messages based on userIds
      console.log("all messages: ", allMessages);
      console.log("followingUserIds: ", followingUserIds);
      const filteredMessages = allMessages.filter((msg) =>
        followingUserIds.includes(msg.userId)
      );

      return filteredMessages;
    } else {
      return allMessages;
    }
  };


  const getCompareFunc = (sortType) => {
    if (sortType === SORTBYTOP) {
      return (message_a, message_b) => {
        if (message_a.likeCount < message_b.likeCount) {
          return 1
        } else if (message_a.likeCount > message_b.likeCount) {
          return -1
        } else {
          return 0
        }
      }
    } else if (sortType === SORTBYNEW) {
      return (message_a, message_b) => {
        if (message_a.timestamp < message_b.timestamp) {
          return 1
        } else if (message_a.timestamp > message_b.timestamp) {
          return -1
        } else {
          return 0
        }
      }
    } else if (sortType === SORTBYOLD) {
      return (message_a, message_b) => {
        if (message_a.timestamp < message_b.timestamp) {
          return -1
        } else if (message_a.timestamp > message_b.timestamp) {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  const timePassed = (prevTimestamp) => {
    const currentTimestamp = Date.now();
    const diffInSeconds = Math.floor((currentTimestamp - prevTimestamp) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days`;
    }
  };

  const handleSort = async (sortType) => {
    const compare = getCompareFunc(sortType)
    var new_messages = await db_operations.getResponses(promptID)
    new_messages.sort(compare)
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
      likeCount: 0,
      replyCount: 0,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleLike = async (username, posterUsername, promptID, responseID) => {
    console.debug(likedResponseIDs)
    const newLikedResponseIDs = await db_operations.handleLike(username, posterUsername, promptID, responseID)
    console.debug('liked responmes', newLikedResponseIDs)
    setLikedResponseIDs(newLikedResponseIDs);
    db_operations.getResponses(promptID).then(messages => {
      setMessages(messages);
      handleSort(sortType);
    });
  };
  const handleDislike = async (username, posterUsername, promptID, responseID) => {
    console.debug(likedResponseIDs)
    const newLikedResponseIDs = await db_operations.handleDislike(username, posterUsername, promptID, responseID)
    console.debug('disliked responmes', newLikedResponseIDs)
    setLikedResponseIDs(newLikedResponseIDs);
    db_operations.getResponses(promptID).then(messages => {
      setMessages(messages);
      handleSort(sortType);
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
        responseText: responseText,
        promptID: promptID,
        responseID: responseID,
        userID: userID,
        username: username,
      });
    });
  };

  const getLikes = async (responseID) => {
    return await db_operations.getLikes(promptID, responseID)
  }

  return (
    <MenuProvider>
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
            <View style={styles.rankStack}>
              <Image
                style={styles.stack}
                source={require('../assets/icons/stackview_icon.png')}
              />
              <View style={styles.list}>
                <SelectList
                  setSelected={(key) => setSortType(key)}
                  data={data1}
                  save="key"
                  search={false}
                  boxStyles={{ borderRadius: 0, height: 45, width: 120, borderColor: '#FFFFFF', paddingLeft: 8 }} //override default styles
                  dropdownStyles={{ position: "absolute", top: 40, width: "100%", zIndex: 2, borderColor: '#000000', borderrRadius: 10, backgroundColor: '#F1F1F1' }}
                  inputStyles={{ fontSize: 13 }}
                  placeholder={sortType}
                  onSelect={() => handleSort(sortType)}
                />
              </View>
            </View>
            <View style={styles.followingButtonContainer}>
              <TouchableOpacity
                style={styles.followingButton}
                onPress={() => setShowFollowing(!showFollowing)}
              >
                {!showFollowing && <View style={styles.followingButtonSection}>
                  <Text
                    style={[
                      styles.followingButtonText,
                      !showFollowing && styles.followingButtonSelected,
                    ]}
                  >
                    All
                  </Text>
                </View>}
                {showFollowing && <View style={styles.followingButtonSection}>
                  <Text
                    style={[
                      styles.followingButtonText,
                      showFollowing && styles.followingButtonSelected,
                    ]}
                  >
                    Following
                  </Text>
                </View>}
              </TouchableOpacity>
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
          <ScrollView style={styles.scrollView}
            refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#979797" // Change the spinning wheel color, if needed
            />}
          >
            {hasResponded && <View style={styles.messageContainer}>
              {messages.map((message, index) => (
                <View key={index}
                  style={styles.message}>
                  <View style={styles.allInfo}>
                    <View style={styles.headerMessage}>
                      <Image
                        style={styles.profPicture}
                        source={{uri: "data:image/png;base64," + profilePics[message.userID]}}
                      />
                      <View style={styles.furtherInfo}>
                        <Text style={styles.username} onPress={
                          () => {
                            if(message.userID === username){
                              navigation.navigate('Profile Page',{
                                username: username
                              });
                            }
                            else{
                              navigation.navigate('OtherProfilePage', {
                                username: message.userID,
                                current_username: username,
                                isDefaultUser: false,
                              });
                            }
                          }
                        }>{message.userID}</Text>
                        <View style={styles.subsetMessage}>
                          {/* <Text style={styles.location}> Los Angeles ~~~ </Text> */}
                          {/* <View style={styles.dotMessage}>
                              <Text style={styles.dot}> • </Text>
                            </View> */}
                          <Text style={styles.location}>{timePassed(message.timestamp)}</Text>
                        </View>
                      </View>
                      <View>
                        <Menu>
                          <MenuTrigger text='•••' customStyles={styles.threeDots} />
                          <MenuOptions>
                            <MenuOption onSelect={() => {
                                                    db_operations.reportResponse(promptID, message.responseID);
                                                    alert(`Reported`);
                                                    }} >
                              <Text style={{ color: 'red' }}>Report</Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      </View>
                    </View>
                    <View styles={styles.mainMessage}>
                      <Text style={styles.messageText}>{message.text}</Text>
                    </View>
                  </View>
                  <View style={styles.bottomRow}>
                    <TouchableOpacity
                      onPress={() => {
                        handleLongPress(username, message.userID, promptID, message.responseID) //old method with old name... should change later
                      }}>
                      <Image style={styles.upvoteImage}
                        source={
                          likedResponseIDs != undefined && likedResponseIDs.includes(message.responseID) ? require('../assets/icons/blue_thumb_icon.png') : require('../assets/icons/black_thumb_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.likeCountText}>{message.likeCount}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleReply(message.text, message.responseID, message.userID);
                      }
                      }
                    >
                      <Image style={styles.commentImage} source={require('../assets/icons/comments_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.commentNumber}>{message.replyCount}</Text>
                    {false && message.userID === username &&
                      (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('Comment Page', {
                              isEditing: true,
                              messageText: message.text
                            });
                          }}>
                          <Image style={styles.editImage} source={require('../assets/icons/pencil_icon.png')} />
                          <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                      )}

                  </View>
                </View>
              ))}
            </View>}
            {!hasResponded && <View>
                <Text>
                  Need to respond to prompt first!
                </Text>
              </View>}
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
        </View>
      </ThemeProvider>
    </MenuProvider>
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
    marginTop: 10,
  },
  qotd: {
    fontWeight: 'bold',
    fontFamily: 'InriaSans-Bold',
    fontSize: 20,
  },
  logo: {
    fontFamily: 'InriaSans-Bold',
    fontSize: 15,
    marginTop: 7,
  },
  rank: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  },
  scrollView: {
    flex: 1,
    padding: 10,
    paddingLeft: 28,
    paddingRight: 28,
    zIndex: -2,
    marginBottom: 30,
    marginTop: 10,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageText: {
    color: '#616161',
    fontSize: 16,
    fontFamily: 'InriaSans-Bold',
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
    fontFamily: 'InriaSans-LightItalic',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  time: {
    color: '#BDBCBC',
    fontSize: 10,
    fontFamily: 'InriaSans-LightItalic',
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
  likedUpvoteImage: {
    backgroundColor: '#ADD8E6',
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
  logoContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  logoChalk: {
    width: 250,
    height: 80,
    resizeMode: 'contain',
  },
  threeDots: {
    width: 20,
    height: 20,
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
    fontFamily: 'InriaSans-Regular',
  },
  editText: {
    color: '#726D6D',
    fontSize: 13,
    fontFamily: 'InriaSans-Regular',
    marginLeft: 55,
    marginTop: -19,
  },
  editImage: {
    width: 25,
    height: 25,
    marginLeft: 25,
    marginTop: -5,
    resizeMode: 'contain',
    opacity: 0.60,
  },
  likeCountText: {
    color: '#726D6D',
    fontSize: 14,
    fontFamily: 'InriaSans-Regular',
  },
  username: {
    fontWeight: 'bold',
    color: '#6A6A6A',
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
    fontSize: 11.5,
    fontFamily: 'InriaSans-Bold',

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
  followingButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followingButtonSection: {
    paddingHorizontal: 4,
  },
  followingButtonText: {
    fontSize: 13,
    color: '#5c64b0',
    fontFamily: 'InriaSans-Bold',
  },
  followingButtonSelected: {
    fontWeight: 'bold',
  },
});

export default MessageBoard;
