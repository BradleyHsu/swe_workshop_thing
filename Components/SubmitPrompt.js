import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StackActions} from '@react-navigation/native';
import * as db_operations from '../db_operations.js';


const SubmitPrompt = ({navigation}) => {
  const [promptText, setPromptText] = useState('');

  const handlePress = () => {
    if (promptText.trim() === '') {
      Alert.alert('Error', 'Please enter a prompt before submitting.');
      return;
    }
    db_operations.submitSuggestionPrompt(promptText)
    // code to submit prompt goes here
    Alert.alert('Success', 'Your prompt has been submitted.');
    setPromptText('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.dispatch(StackActions.pop(1))}>
        <View style={styles.backArrowContainer}>
          <Image source={require('../assets/icons/back_arrow_icon.png')}
            style={styles.backArrow} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Submit a Prompt</Text>
      <Text style={styles.description}>
        Submit prompts of your desire that the team at Chalk can consider to use!
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your prompt here"
        value={promptText}
        onChangeText={setPromptText}
        multiline
      />
      <View style={styles.submit}>
        <Button title="Submit" onPress={handlePress} color="#464646"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  backArrow: {
    width: 35,
    height: 35,
  },
  backArrowContainer: {
    marginLeft: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: '#464646',
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    color: '#616161',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    minHeight: 150,
    marginTop: 60,
    color: '#969696',
  },
  submit: {
    marginTop: 100,
  },
});

export default SubmitPrompt;
