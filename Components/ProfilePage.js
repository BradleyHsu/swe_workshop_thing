import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import * as db_operations from '../db_operations.js';

const ProfilePage = ({navigation, route}) => {
  const {username} = route.params
  const [name, setName] = useState(username); // account name
  const [questions, setQuestions] = useState([]); // array of past questions answered
  const [likes, setLikes] = useState(0); // number of likes user has gotten
  

  useEffect(() => {
    setName(username)
    db_operations.getKarma(username).then(karma => {
      setLikes(karma)
    });
    let timerId = setInterval(() => {
      db_operations.getKarma(username).then(karma => {
        setLikes(karma)
      });
    }, 5000); 

    return () => clearInterval(timerId);
  }, [username,likes]);

  const handleNameChange = (text) => {
    setName(text);
  }

  const handleLogout = () => {
    navigation.navigate('Home')
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: 'https://placekitten.com/200/200' }} // replace with user's profile picture
        style={{ width: 150, height: 150, borderRadius: 75 }}
      />
      <Text style={{ fontSize: 24, marginTop: 20 }}>{name}</Text>
      {/* <TextInput
        value={name}
        onChangeText={handleNameChange}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 8, margin: 20, width: '80%' }}
      /> */}
      {/* <Text style={{ fontSize: 18, marginVertical: 10 }}>Questions you've answered:</Text>
      {questions.map((question, index) => (
        <Text key={index}>{question}</Text>
      ))} */}
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Likes received: {likes}</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfilePage;