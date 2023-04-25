import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from 'react-native';
import AppContext from '../AppContext';
import * as db_operations from '../db_operations.js';
import { ThemeProvider, createTheme } from '@rneui/themed';
import Clock from './Clock';
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
  },
  mode: 'light',
});

const CommentPage = ({ navigation, route }) => {
  // const { username } = route.params;
  // const [name, setName] = useState(username); // account name
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [voiceMemoUri, setVoiceMemoUri] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [hasResponded, setHasResponded] = useState(false);
  const { usernameC, setUsernameC, promptIDC, setPromptIDC, promptTextC, setPromptTextC, inputTextC, setInputTextC, promptDateC, setPromptDateC } = useContext(AppContext);
  const { isEditing, messageText } = route.params;
  const [edit, setEdit] = useState(isEditing)
  const [time, setTime] = useState(null)
  const [currentTime, setCurrentTime] = useState(null);

  const formatTime = (time, offset) => {
    const adjustedTime = time - offset
    const seconds = Math.floor(adjustedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h late`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m late`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s late`;
    } else if (seconds > 0) {
      return `${seconds}s late`;
    } else if (minutes < 0) {
      return `${-minutes}m ${-seconds % 60}s remain`;
    } else {
      return `${-seconds}s remain`;
    }
  };

  useEffect(() => {
    if (edit) {
      setText(messageText)
      setEdit(false)
    }
    const intervalId = setInterval(() => {
      const today = new Date();
      const seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
      const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
      setTime(today.getHours() + ":" + minutes + ":" + seconds);
      setCurrentTime(Date.now() - promptDateC);
    }, 1000);

    db_operations.getResponses(promptIDC).then((responses) => {
      for (response of responses) {
        if (response.userID === usernameC) {
          setHasResponded(true);
        }
      }
    })

    return () => clearInterval(intervalId);
  }, [time])


  const handlePost = async () => {
    // navigation.navigate('ConfirmationPage');
    const userID = usernameC;
    const responseID = await db_operations.respondToPrompt(
      userID,
      text,
      promptIDC,
    );
    setText('');
    setInputTextC('');
    setCharacterCount(0);
  }

  const handleTextChange = (text) => {
    setText(text);
    setCharacterCount(text.length)
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {time + ' - ' + formatTime(currentTime, 300000)}
            </Text>
          </View>
        </View>

        <View style={styles.promptTextView}>
          <Text style={styles.promptText}>{promptTextC}</Text>
        </View>
        {/* <View style={styles.addedIconContainer1}>
          <TouchableOpacity>
            <Image
              style={styles.addedIcon}
              source={require('../assets/icons/voice_memo_icon.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.addedIconContainer2}>
          <TouchableOpacity>
            <Image
              style={styles.addedIcon}
              source={require('../assets/icons/picture_upload_icon.png')}
            />
          </TouchableOpacity>
  </View> */}
      
        {!hasResponded && <View style={styles.charContainer}>
          <Text style={styles.char}> {characterCount}/300</Text>
        </View>}
        {!hasResponded && <TextInput
          style={styles.commentInput}
          placeholderTextColor={theme.createCommentColors.first}
          placeholder='Give me your best response.'
          onChangeText={text => handleTextChange(text)}
          value={text}
          maxLength={300}
          multiline={true}
        />}
        {!hasResponded && <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePost}>
            <Image
              style={styles.button}
              source={require('../assets/icons/post_icon.png')}
            />
          </TouchableOpacity>
        </View>}

        {
          hasResponded && <View>
            <Text>
              You have already responded to this prompt.
            </Text>
            </View>
        }
        
        {/* <TouchableOpacity style={styles.imagePickerButton} onPress={handleImage}>
        <Text>Add Photo</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      <TouchableOpacity style={styles.voiceMemoRecorderButton} onPress={handleVoiceMemoRecorder}>
        <Text>Record Voice Memo</Text>
      </TouchableOpacity>
      {voiceMemoUri && <Text>{voiceMemoUri}</Text>}
      <TouchableOpacity style={styles.submitButton} onPress={handleComment}>
        <Text>Submit Comment</Text>
      </TouchableOpacity> */}
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'green',
    flex: 1,
    padding: 10,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 65,
    left: 30,
    // backgroundColor: 'red',
  },
  promptTextView: {
    marginLeft: 50,
    marginTop: 105,
    marginBottom: -15,
    marginRight: 50,
  },
  promptText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A3A3A',
    fontFamily: 'InriaSans-Bold',
  },
  icon: {
    width: 18,
    height: 18,
    opacity: 0.35,
  },
  timeContainer: {

  },
  timeText: {
    paddingLeft: 95,
    color: theme.createCommentColors.third,
    fontSize: 15,
    fontFamily: 'InriaSans-Bold',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 100,
    marginLeft: 135,
  },
  button: {
    resizeMode: 'contain',
    height: 90,
    width: 100,
  },
  postText: {
    fontSize: 11,
    color: theme.createCommentColors.fourth,
  },
  addedIconContainer1: {
    position: 'absolute',
    top: 120,
    right: 10,
  },
  addedIconContainer2: {
    position: 'absolute',
    top: 160,
    right: 10,
  },
  addedIcon: {
    width: 35,
    height: 35,
    opacity: 0.80,
  },
  charContainer: {
    position: 'absolute',
    top: 225,
    left: 36,
    // backgroundColor: 'pink'
  },
  char: {
    fontSize: 12,
    fontFamily: 'InriaSans-Bold',
    color: theme.createCommentColors.second,
  },
  commentInput: {
    // backgroundColor: 'blue',
    height: 250,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 20,
    marginLeft: 18,
    marginTop: 120,
    color: theme.createCommentColors.first,
    fontFamily: 'InriaSans-Bold',
    fontWeight: 'bold',
    paddingRight: 25,
    marginBottom: 10,
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  imagePickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  voiceMemoRecorderButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommentPage;
