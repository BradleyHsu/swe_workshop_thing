import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from 'react-native';
import { ThemeProvider, createTheme } from '@rneui/themed';

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
  const [value, onChangeText] = React.useState('');
  const [imageUri, setImageUri] = useState('');
  const [voiceMemoUri, setVoiceMemoUri] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  // this.setCharacterCount({
  //   textLength: maxLength - text.length,
  //   text,
  // })

  const handlePost = () => {
    navigation.navigate('ConfirmationPage')
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home Page')}>
            <Image
              style={styles.icon}
              source={require('../assets/images/x-icon.png')}
            />
          </TouchableOpacity>
          <Text style={styles.timeText}>
            18:13:24 - 2 hrs late
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePost}>
              <Image
                style={styles.button}
                source={require('../assets/icons/post_icon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.addedIconContainer1}>
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
        </View>
        <View style={styles.charContainer}>
          <Text style={styles.char}> {characterCount}/300</Text>
        </View>
        <TextInput
          style={styles.commentInput}
          placeholderTextColor={theme.createCommentColors.first}
          placeholder='Give me your best response.'
          onChangeText={text => onChangeText(text)}
          value={value}
          maxLength={300}
          multiline={true}
        />
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
  icon: {
    width: 18,
    height: 18,
    opacity: 0.35,
  },
  timeText: {
    paddingLeft: 75,
    color: theme.createCommentColors.third,
    fontSize: 15,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    right: -115,
    top: -15,
  },
  button: {
    resizeMode: 'contain',
    height: 50,
    width: 70,
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
    top: 170,
    left: 36,
    // backgroundColor: 'pink'
  },
  char: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: theme.createCommentColors.second,
  },
  commentInput: {
    // backgroundColor: 'blue',
    height: 250,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 20,
    marginLeft: 18,
    marginTop: 180,
    color: theme.createCommentColors.first,
    fontFamily: 'Helvetica',
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