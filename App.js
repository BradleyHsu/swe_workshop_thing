import React, { useEffect, useState, useContext } from 'react';
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
import EditProfile from './Components/EditProfile';
import ConfirmationPage from './Components/ConfirmationPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { decode, encode } from 'base-64';
import Settings from './Components/Settings';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MessageBoardStack = createNativeStackNavigator();
const CommentStack = createNativeStackNavigator();

import AppContext from './AppContext';

function MessageBoardTabStack({ route: { params } }) {
  return (
    <MessageBoardStack.Navigator>
      <MessageBoardStack.Screen name="MessageBoard" component={MessageBoard} initialParams={params} options={{ headerShown: false }} />
      <MessageBoardStack.Screen name="ReplyScreen" component={ReplyScreen} initialParams={params} options={{ headerShown: false }} />
    </MessageBoardStack.Navigator>
  )
}

function CommentTabStack({ route: { params } }) {
  //need prompt text/question , promptID, username/userID, 
  //  console.log('supppp', params)
  return (
    <CommentStack.Navigator>
      <CommentStack.Screen name="CommentPage" component={CommentPage} options={{ headerShown: false }} initialParams={params} />
      <CommentStack.Screen name="ConfirmationPage" component={ConfirmationPage} options={{ headerShown: false }} />
    </CommentStack.Navigator>
  )
}

function MessageBoardTabs({ route: { params } }) {
  const { username: currentUser } = params;
  return (
    <Tab.Navigator>
      <Tab.Screen name="Message Board" component={MessageBoardTabStack} initialParams={params} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Comment Page" component={CommentTabStack} initialParams={params} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="message" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Profile Page" component={ProfilePage} initialParams={{ username: currentUser, current_username: currentUser }} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }}
        listeners={({ navigation, route }) => ({
          focus: () => {

            if (route.params.isDefaultUser === undefined || route.params.isDefaultUser) {
              navigation.navigate('Profile Page', { username: params.username });
            }
            else {
              navigation.navigate('Profile Page', { username: route.params.username });
            }

          },
        })}
      />
    </Tab.Navigator>
  );
}

function App() {
  const [usernameC, setUsernameC] = useState('');
  const [promptIDC, setPromptIDC] = useState('');
  const [promptTextC, setPromptTextC] = useState('');
  const [inputTextC, setInputTextC] = useState('');
  return (
    <AppContext.Provider value={{ usernameC, setUsernameC, promptIDC, setPromptIDC, promptTextC, setPromptTextC, inputTextC, setInputTextC }}>
      <NavigationContainer>
        <Stack.Navigator initalRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Sign up" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="MessageBoard" component={MessageBoardTabs} options={{ headerShown: false }} />
          {/* <Stack.Screen name="Chat" component={ChatPage} options={{ headerShown: false }} /> */}
          <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="SuccessSignUp" component={SuccessSignUp} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
          <Stack.Screen name="SuccessResetPassword" component={SuccessResetPassword} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

export default App

