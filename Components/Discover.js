import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, ScrollView, Text, Image } from "react-native";
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useState, useContext, useEffect } from 'react';
import * as db_operations from '../db_operations.js';
import { StackActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Discover = ({ route, navigation }) => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const username = route.params.username
  useEffect(
    () => {
      db_operations.getUsers().then((users) => {
        console.log(users)
        usernames = []
        for (user of Object.values(users)) {
          usernames.push(user)
        }
        console.log(usernames)
        setAllUsers(usernames)
      })
    }, []
  )
  function handleSearch(usernameText) {
    setSearchPhrase(usernameText)
    if (usernameText) {
      var results = allUsers.filter((user) => {
        return user.username.toLowerCase().includes(usernameText.toLowerCase());
      });
      results = results.filter((user) => {
        return user.username !== username;
      });
      setSearchResults(results);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.iconContainer}>
          <FeatherIcon
            name="search"
            size={20}
            color="gray"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search by username"
            value={searchPhrase}
            onChangeText={handleSearch}
            onFocus={() => {
            }}
          />
        </View>
      </View>
      <ScrollView >
        {searchResults.map((user) => {
          return (
            <View style={styles.userContainer}>
              <TouchableOpacity onPress={() => navigation.navigate(
                'OtherProfile', {
                username: user.username,
                current_username: username,
                isDefaultUser: false,
              }
              )}>
                <View style={styles.containerMain}>
                  <View style={styles.profContainer}>
                    <Image source={require('../assets/images/dog_picture.jpg')}
                      style={styles.prof} />
                  </View>
                  <Text style={styles.username}>{user.username}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        })
        }
      </ScrollView>
    </View>
  );
};
// styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 50,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 17,
  },
  iconContainer: {
    marginLeft: 10,
    marginRight: 15,
  },
  inputContainer: {
    marginTop: 4,
  },
  input: {
    // fontFamily: 'InriaSans-Regular',
    color: '#7C7C7C',
    fontSize: 14,
  },
  userContainer: {
    marginLeft: 40,
    marginTop: 30,
  },
  prof: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  profContainer: {
    marginRight: 10,
  },
  containerMain: {
    flexDirection: 'row',
  },
  username: {
    // fontFamily: 'InriaSans-Bold',
    color: '#7C7C7C',
    fontSize: 14,
    marginTop: 5,

  },
});

export default Discover;
