import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StackActions } from '@react-navigation/native';

const About = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.dispatch(StackActions.pop(1))}>
        <View style={styles.backArrowContainer}>
          <Image source={require('../assets/icons/back_arrow_icon.png')}
            style={styles.backArrow} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>About Our App</Text>
      <Text style={styles.description}>
        Our app is a social media platform that encourages anonymous engagement with daily prompts to foster an unfiltered discussion. Each day, users receive a new prompt and have 24 hours to respond anonymously. Users can view responses only if they have replied themselves. Additionally, users can reply to other people’s responses and follow each other.
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'justify',
  },
});
export default About;