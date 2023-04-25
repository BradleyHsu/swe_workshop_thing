import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { StackActions } from '@react-navigation/native';


const Help = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.dispatch(StackActions.pop(1))}>
        <View style={styles.backArrowContainer}>
          <Image source={require('../assets/icons/back_arrow_icon.png')}
            style={styles.backArrow} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Experiencing any problems? Contact us!</Text>
      <Text style={styles.email}>support@chalk.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#007AFF',
  },
});

export default Help;
