/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, Button, ThemeProvider, createTheme } from '@rneui/themed';

const theme = createTheme({
  lightColors: {
    primary: '#979797',
    secondary: '#ffffff',
  },
  darkColors: {
    primary: '#555454',
    secondary: '#757373',
  },
  navigationColors: {
    primary: '#5c64b0',
  },
  mode: 'light',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginBottom: 50,
  },
  button: {
    width: 150,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

const Home = ({ navigation }) => {
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <View>
          <Image
            style={styles.image}
            source={require('../assets/images/chalk..png')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={{
              width: 150,
              height: 60,
              backgroundColor: theme.lightColors.primary,
              borderRadius: 50,
              fontSize: 17,
              fontFamily: 'InriaSans-Bold',
            }}
            onPress={() => navigation.navigate('Login')}
            title="Log In"
            titleStyle={{
              color: theme.lightColors.secondary,
            }}
          />
          <Button
            buttonStyle={{
              width: 150,
              height: 60,
              backgroundColor: theme.darkColors.primary,
              marginTop: 25,
              borderRadius: 50,
              fontSize: 17,
              fontFamily: 'InriaSans-Bold',
            }}
            onPress={() => navigation.navigate('Sign up')}
            title="Sign Up"
            titleStyle={{
              color: theme.lightColors.secondary,
            }}
          />
        </View>
      </View>
    </ThemeProvider>
  );
};

export default Home;
