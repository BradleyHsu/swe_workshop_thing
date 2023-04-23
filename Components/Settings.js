import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Button,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as db_operations from '../db_operations.js';


const SECTIONS = [
  {
    header: 'MEMORIES',
    items: [
      { id: 'calendar', icon: 'calendar', label: 'previous prompts' },
      { id: 'history', icon: 'archive', label: 'past replies' },
    ],
  },
  {
    header: 'SETTINGS',
    items: [
      { id: 'submit', icon: 'send', label: 'submit a prompt' },
      { id: 'contact', icon: 'bell', label: 'notifications' },
      { id: 'private', icon: 'lock', label: 'privacy' },
    ],
  },
  {
    header: 'MORE',
    items: [
      { id: 'about', icon: 'info', label: 'about' },
      { id: 'help', icon: 'help-circle', label: 'help' },
      { id: 'logout', icon: 'log-out', label: 'log out' },
    ],
  },
];

const Settings = ({ navigation, route }) => {
  const [form, setForm] = useState({
    language: 'English',
    darkMode: true,
    wifi: false,
  });

  // const username = route.params.username
  // const current_username = route.params.current_username
  // console.log('username', username);
  // console.log('current_username', current_username);
  // const [name, setName] = useState(username); // account name
  const [questions, setQuestions] = useState([]); // array of past questions answered
  const [likes, setLikes] = useState(0); // number of likes user has gotten
  const [isFollowing, setIsFollowing] = useState(false);




  const handleLogout = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container2}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
          <View style={styles.backArrowContainer}>
            <Image source={require('../assets/icons/back_arrow_icon.png')}
              style={styles.backArrow} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.editProfileContainer}>
            <View style={styles.profilePictureContainer}>
              <Image source={require('../assets/images/dog_picture.jpg')}
                style={styles.profilePicture} />
            </View>
            <View style={styles.moreInfoContainer}>
              <View style={styles.usernameContainer}>
                <Text style={styles.username}>
                  amour123
                </Text>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.location}>
                  los angeles, california
                </Text>
              </View>
            </View>
            <View style={styles.frontArrowContainer}>
              <Image source={require('../assets/icons/front_arrow_icon.png')}
                style={styles.frontArrow} />
            </View>
          </View>
        </TouchableOpacity>




        {SECTIONS.map(({ header, items }) => (
          <View style={styles.settings} key={header}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsHeaderText}>{header}</Text>
            </View>
            <View style={styles.settingsBody}>
              {items.map(({ id, label, icon }, index) => {
                return (
                  <View
                    key={id}
                    style={[
                      styles.rowSettings,
                      index === 0 && { borderTopWidth: 0 },
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        // handle onPress
                      }}>
                      <View style={styles.row}>
                        <FeatherIcon
                          color="#616161"
                          name={icon}
                          style={styles.rowIcon}
                          size={22}
                        />
                        <Text style={styles.rowLabel}>{label}</Text>
                        <View style={styles.rowSpace} />
                        <View style={styles.frontArrowContainer2}>
                          <Image source={require('../assets/icons/front_arrow_icon.png')}
                            style={styles.frontArrow2} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>


          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  container2: {
    backgroundColor: 'white',
  },
  settings: {
    paddingTop: 12,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  moreInfoContainer: {
    marginLeft: 20,
    marginTop: 15,
  },
  username: {
    fontSize: 24,
    fontFamily: 'InriaSans-Bold',
    color: '#464646',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 15,
    color: '#B9B9B9',
  },
  frontArrow: {
    width: 28,
    height: 28,
  },
  frontArrowContainer: {
    marginTop: 27,
    marginLeft: 40,
  },
  frontArrow2: {
    width: 20,
    height: 20,
  },
  frontArrowContainer2: {
    marginLeft: 40,
  },
  locationContainer: {
    marginTop: 7,
  },
  editProfileContainer: {
    backgroundColor: '#F6F6F6',
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 17,
    marginRight: 17,
    marginTop: 45,
    marginBottom: 35,
    flexDirection: 'row',
  },
  profilePictureContainer: {
    marginLeft: 20,
  },
  backArrow: {
    width: 35,
    height: 35,
  },
  backArrowContainer: {
    marginLeft: 20,
    marginTop: 20,
  },

  settingsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  settingsHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: 'InriaSans-Bold'
  },
  settingsBody: {
    borderColor: '#e3e3e3',
    marginLeft: 17,
    marginRight: 17,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  profile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  logOutContainer: {
    position: 'absolute',

  },
  logOutText: {

  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 24,
    height: 50,
  },
  rowSettings: {
    paddingLeft: 24,
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: '#F6F6F6',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#484848',
    fontFamily: 'InriaSans-Bold'
  },
  rowValue: {
    fontSize: 17,
    color: '#616161',
    marginRight: 4,
    fontFamily: 'InriaSans-Bold'
  },
  rowSpace: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  logOutButtonText: {
    color: '#D91D1D',
    opacity: 0.5,
    fontFamily: 'InriaSans-Bold',
  },
});

export default Settings;




