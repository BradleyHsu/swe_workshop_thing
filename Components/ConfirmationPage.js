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

const ConfirmationPage = ({ navigation, route }) => {
  const [value, onChangeText] = React.useState('');
  const [characterCount, setCharacterCount] = useState(0);
  // this.setCharacterCount({
  //   textLength: maxLength - text.length,
  //   text,
  // })

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('CommentPage')}>
            <Image
              style={styles.icon}
              source={require('../assets/images/x-icon.png')}
            />
          </TouchableOpacity>
          <Text style={styles.timeText}>
            18:13:24 - 2 hrs late
          </Text>
        </View>
        <View style={styles.addedIconContainer1}>
          <TouchableOpacity>
            <Image
              style={styles.addedIcon1}
              source={require('../assets/images/final_post.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>This is a great message...</Text>
        </View>
        <View style={styles.addedIconContainer2}>
          <TouchableOpacity onPress={() => navigation.navigate('MessageBoard')}>
            <Image
              style={styles.addedIcon2}
              source={require('../assets/icons/send_icon.png')}
            />
          </TouchableOpacity>
        </View>
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
  messageContainer: {
    position: 'absolute',
    marginTop: 295,
    marginLeft: 40,

  },
  message: {
    color: theme.createCommentColors.first,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  addedIconContainer1: {
    position: 'absolute',
    top: 120,
    right: 70,
  },
  addedIconContainer2: {
    position: 'absolute',
    bottom: 140,
    right: 60,
  },
  addedIcon1: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  addedIcon2: {
    width: 250,
    height: 50,
    resizeMode: 'contain',
  }
});

export default ConfirmationPage;
