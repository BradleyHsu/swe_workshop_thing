import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from './Components/LoginScreen';
import MessageBoard from './Components/MessageBoard';
import Home from './Components/Home';
import Signup from './Components/Signup';
import ReplyScreen from './Components/ReplyScreen';
import ResetPasswordScreen from './Components/ResetPasswordScreen';
import SuccessSignUp from './Components/SuccessSignUp';
import SuccessResetPassword from './Components/SuccessResetPassword';
import ProfilePage from './Components/ProfilePage';
import CommentPage from './Components/CommentPage';
import ChatPage from './Components/ChatPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MessageBoardStack = createNativeStackNavigator();

function MessageBoardTabStack({ route: { params } }) {
  return (
    <MessageBoardStack.Navigator>
      <MessageBoardStack.Screen name="MessageBoard" component={MessageBoard} initialParams={params} options={{ headerShown: false }} />
      <MessageBoardStack.Screen name="ReplyScreen" component={ReplyScreen} initialParams={params} />
    </MessageBoardStack.Navigator>
  )
}

function MessageBoardTabs({ route: { params } }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MessageBoardTabStack} initialParams={params} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="message" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Create" component={CommentPage} initialParams={params} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Chat" component={ChatPage} initialParams={params} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Profile" component={ProfilePage} initialParams={params} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initalRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Sign up" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="MessageBoard" component={MessageBoardTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatPage} options={{ headerShown: false }} />
        <Stack.Screen name="CommentPage" component={CommentPage} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessSignUp" component={SuccessSignUp} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessResetPassword" component={SuccessResetPassword} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App

