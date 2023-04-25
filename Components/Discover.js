import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import FeatherIcon from 'react-native-vector-icons/Feather';


const Discover = ({ clicked, searchPhrase, setSearchPhrase, setCLicked }) => {
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
            onChangeText={setSearchPhrase}
            onFocus={() => {
            }}
          />
        </View>
      </View>
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
    fontFamily: 'InriaSans-Regular',
    color: '#7C7C7C',
    fontSize: 14,
  }
});

export default Discover;
