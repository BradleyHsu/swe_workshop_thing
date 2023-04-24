import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import * as db_operations from '../db_operations.js';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from '@rneui/themed';
import { SelectList } from 'react-native-dropdown-select-list';

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
  mode: 'light',
});

const ReplyScreen = ({ route, navigation }) => {
  const { responseText, responseID, responseUserID, username, promptID } = route.params;
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [profilePics, setProfilePics] = useState({});
  const SORTBYTOP = 0
  const SORTBYNEW = 1
  const SORTBYLOCATION = 2
  const SORTBYOLD = 3
  const [sortType, setSortType] = useState(SORTBYTOP)

  useEffect(() => {

    const fetchProfilePics = async (comments) => {
      const newProfilePics = { ...profilePics };
      for (const message of comments) {
        console.log("getting profile pic of", message.userID);
        newProfilePics[message.userID] = await db_operations.getProfilePic(message.userID);
      }
      newProfilePics[route.params.userID] = await db_operations.getProfilePic(route.params.userID);
      setProfilePics(newProfilePics);
    }

    setResponse(responseText);
    db_operations.getComments(responseID).then(comments => {
      setComments(comments);
      fetchProfilePics(comments);
    });

  }, []);

  const handleSubmitComment = () => {
    if (commentText.trim() !== '') {
      db_operations.replyToResponse(username, commentText, promptID, responseID);
      setComments([...comments, { userID: username, text: commentText }]);
      setCommentText('');
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

  const data1 = [
    { key: SORTBYTOP, value: 'top' },
    { key: SORTBYNEW, value: 'new' },
    { key: SORTBYOLD, value: 'old' },
  ]

  const handleSort = async (sortType) => {
    const compare = getCompareFunc(sortType)
    var new_messages = await db_operations.getResponses(promptID)
    new_messages.sort(compare)
    setMessages(new_messages)

  }

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('MessageBoard')}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.icon}
              source={require('../assets/icons/back_arrow_icon.png')}
            />
          </View>
        </TouchableOpacity>
        <View>
          {response && (
            <View style={styles.responseContainer}>
              <View style={styles.topRow}>
                <View style={styles.profilePictureContainer}>
                  <TouchableOpacity onPress={() => console.log(route.params.userID)}>
                  <Image
                    style={styles.profPicture}
                    source={{uri: "data:image/png;base64," + profilePics[route.params.userID]}}
                  />
                  </TouchableOpacity>
                </View>
                <View style={styles.moreInfo}>
                  <Text style={styles.username}>
                    surferdude123
                  </Text>
                  <Text style={styles.location}>
                    1 hr
                  </Text>
                </View>
                <View style={styles.threeDotsContainer2}>
                  <Image
                    style={styles.threeDots2}
                    source={require('../assets/icons/threedots_icon.png')}
                  />
                </View>
              </View>
              <Text style={styles.usernameComments}>{responseUserID}</Text>
              <Text style={styles.responseText}>{responseText}</Text>
              <View style={styles.bottomRow}>
                <View style={styles.thumbsUpContainer}>
                  <Image
                    style={styles.thumbsUp}
                    source={require('../assets/icons/black_thumb_icon.png')}
                  />
                </View>
                <View style={styles.thumbsUpNumContainer}>
                  <Text style={styles.thumbsUpNum}>1</Text>
                </View>
                <View style={styles.commentsContainer}>
                  <Image
                    style={styles.commentsIcon}
                    source={require('../assets/icons/comments_icon.png')}
                  />
                </View>
                <View style={styles.commentsNumContainer}>
                  <Text style={styles.commentsNum}>1</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={styles.rankStack}>
          <Image
            style={styles.stack}
            source={require('../assets/icons/stackview_icon.png')}
          />
          <View style={styles.list1}>
            <SelectList
              setSelected={(key) => setSortType(key)}
              data={data1}
              save="key"
              search={false}
              boxStyles={{ borderRadius: 0, height: 45, width: 120, borderColor: '#FFFFFF', paddingLeft: 8 }} //override default styles
              dropdownStyles={{ position: "absolute", top: 35, width: "100%", zIndex: 2, borderColor: '#000000', borderrRadius: 10, backgroundColor: '#F1F1F1' }}
              inputStyles={{ fontSize: 13 }}
              placeholder={sortType}
              onSelect={() => handleSort(sortType)}
            />
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <View style={styles.topRow}>
                <View style={styles.commentsProfContainer}>
                  <Image
                    style={styles.commentsProf}
                    source={{uri: "data:image/png;base64," + profilePics[comment.userID]}}
                  />
                </View>
                <View style={styles.moreInfo2}>
                  <Text style={styles.username2}>
                    {comment.userID}
                  </Text>
                  <Text style={styles.location2}>
                    1 hr
                  </Text>
                </View>
              </View>
              {/* <Text style={styles.usernameComments}>{comment.userID}</Text> */}
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
              <View style={styles.bottomRow2}>
                <View style={styles.threeDotsContainer}>
                  <Image
                    style={styles.threeDots}
                    source={require('../assets/icons/threedots_icon.png')}
                  />
                </View>
                <View style={styles.replyContainer}>
                  <Image
                    style={styles.reply}
                    source={require('../assets/icons/reply.png')}
                  />
                </View>
                <View style={styles.replyNumContainer}>
                  <Text style={styles.replyNum}>Reply</Text>
                </View>
                <View style={styles.thumbsUpContainer}>
                  <Image
                    style={styles.thumbsUp}
                    source={require('../assets/icons/black_thumb_icon.png')}
                  />
                </View>
                <View style={styles.commentsNumContainer}>
                  <Text style={styles.commentsNum}>1</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment"
            value={commentText}
            onChangeText={text => setCommentText(text)}
          />
          <Button title="Post" onPress={handleSubmitComment} color='#555454' />
        </View>
      </View>
    </ThemeProvider>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginTop: 50,
    marginLeft: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  responseContainer: {
    height: 230,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
    marginLeft: 23,
    marginRight: 20,
  },
  usernameComments: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 18,
    color: '#616161',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  comment: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 200,
    zIndex: -2,
  },
  commentText: {
    fontSize: 16,
    paddingTop: 15,
    marginLeft: 10,
    fontFamily: 'Arial',
    color: '#616161',
    fontStyle: 'italic',
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
    marginLeft: 25,
    marginTop: 10,
    maxHeight: 45,
    zIndex: 100,
  },
  stack: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
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
  topRow: {
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
    height: 45,
    width: 45,
    borderRadius: 25,
    marginLeft: 5,
    marginTop: 5,
  },
  profilePictureContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#6A6A6A',
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
    fontSize: 11.5,
  },
  moreInfo: {
    marginTop: 12,
    marginLeft: 3,
  },
  moreInfo2: {
    marginTop: 12,
    marginLeft: 3,
    flexDirection: 'row',
  },
  username2: {
    fontWeight: 'bold',
    color: '#6A6A6A',
    marginBottom: 5,
    marginLeft: 10,
    fontSize: 11.5,
  },
  location2: {
    color: '#9D9D9D',
    fontSize: 10,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 100,
    marginLeft: 15,
  },
  bottomRow2: {
    flexDirection: 'row',
    marginTop: 90,
    marginLeft: 150,
  },
  thumbsUp: {
    width: 18,
    height: 18,
    opacity: 0.65,
  },
  reply: {
    width: 20,
    height: 14,
    opacity: 0.75,
  },
  replyContainer: {
    marginRight: 10,
  },
  replyNumContainer: {
    marginRight: 20,
  },
  replyNum: {
    color: '#726D6D',
  },
  commentsIcon: {
    width: 18,
    height: 18,
    opacity: 0.75,
  },
  threeDotsContainer: {
    marginRight: 27,
  },
  threeDots: {
    width: 20,
    height: 20,
    opacity: 0.7,
  },
  threeDotsContainer2: {
    marginLeft: 150,
    marginTop: 20,
  },
  threeDots2: {
    width: 20,
    height: 20,
  },
  commentsContainer: {
    marginLeft: 10,
  },
  thumbsUpContainer: {
    marginLeft: 5,
  },
  commentsNumContainer: {
    marginLeft: 5,
  },
  commentsNum: {
    color: '#726D6D',
    marginLeft: 3,
  },
  thumbsUpNum: {
    color: '#726D6D',
  },
  thumbsUpNumContainer: {
    marginLeft: 5,
    marginRight: 15,
  },
  commentsProfContainer: {
    marginTop: 5,
  },
  commentsProf: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ReplyScreen;
