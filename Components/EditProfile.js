import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as db_operations from '../db_operations.js';
import {launchImageLibrary} from 'react-native-image-picker';
import { StackActions } from '@react-navigation/native';

const EditProfile = ({ navigation, route }) => {
  const username = route.params.username;
  const current_username = route.params.current_username;
  const [profilePicture, setProfilePicture] = useState(null);
  
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const [profilePicBase64] = await db_operations.getProfilePic(username);
      console.log("got pic 123", profilePicBase64);
      if (profilePicBase64) {
        setProfilePicture(profilePicBase64);
      } else {

        setProfilePicture(require('../assets/images/dog_picture.jpg'));
      }
      console.log("default profile pic", profilePicture);
    };

    fetchProfilePicture();
  }, [username]);
  console.log("edit profile username: ", username)
  console.log("edit profile current_username ", current_username)
  // console.log('username', username);
  // console.log('current_username', current_username);
  // const [name, setName] = useState(username); // account name
  const [questions, setQuestions] = useState([]); // array of past questions answered
  const [likes, setLikes] = useState(0); // number of likes user has gotten
  const [isFollowing, setIsFollowing] = useState(false);


  // useEffect(() => {
  //   setName(username)
  //   db_operations.getKarma(username).then(karma => {
  //     setLikes(karma)
  //   });
  //   let timerId = setInterval(() => {
  //     db_operations.getKarma(username).then(karma => {
  //       setLikes(karma)
  //     });
  //   }, 5000);
  //   const checkFollowingStatus = async () => {
  //     const isUserFollowing = await db_operations.isFollowing(current_username, username);
  //     setIsFollowing(isUserFollowing);

  //   };
  //   checkFollowingStatus();
  //   return () => clearInterval(timerId);
  // }, [username, current_username, likes]);

  // const handleNameChange = (text) => {
  //   setName(text);
  // }

  // const handleLogout = () => {
  //   navigation.navigate('Home')
  // }
  // const handleFollow = async () => {
  //   if (isFollowing) {
  //     await db_operations.unfollowUser(current_username, username);
  //   } else {
  //     await db_operations.followUser(current_username, username);
  //   }
  //   setIsFollowing(!isFollowing);
  // };

  const handleProfilePictureChange = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 128,
      maxHeight: 128,
    };

    launchImageLibrary(options, async (response) => {
      console.log('Response = ', response)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const base64Image = response.assets[0].base64;
        console.log("base64Image", base64Image)
        setProfilePicture(base64Image)
        console.log("after change", profilePicture)
        await db_operations.setProfilePic(username, base64Image);
      }
    });
  };

  const handleSave = () => {
    //TODO: add ability to save username/prof picture
    navigation.dispatch(StackActions.pop(1))
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Image
            style={styles.icon}
            source={require('../assets/images/x-icon.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => handleSave()}
          color="#464646"
          title="Save"
          fontFamily="Arial"
          fontWeight="bold"
        />
      </View>
      <View style={styles.profilePicContainer}>
        <TouchableOpacity onPress={handleProfilePictureChange}>
          <Image
            source={{uri: "data:image/png;base64," + profilePicture}} 
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cameraIconContainer}>
        <TouchableOpacity>
          <Image
            style={styles.cameraIcon}
            source={require('../assets/icons/camera.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.usernameContainer}>
        <View style={styles.usernameTagContainer} >
          <Text style={styles.usernameTag}>
            Username
          </Text>
        </View>
        <View style={styles.usernameEditContainer}>
          <Text style={styles.usernameEdit}>
            amour123
          </Text>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <View style={styles.bioContainerBold} >
          <Text style={styles.bio}>
            Bio
          </Text>
        </View>
        <View style={styles.bioTextContainer}>
          <Text style={styles.bioText}>
            i am a cool person.
          </Text>
        </View>
      </View>
      <View style={styles.locationMainContainer}>
        <View style={styles.locationEditContainer} >
          <Text style={styles.locationEdit}>
            Location
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>
            los angeles, ca
          </Text>
        </View>
      </View>
      {/* {username === current_username &&
        (<TouchableOpacity
          onPress={handleLogout}
        style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 20 }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>)
      }
      {username != current_username &&
        (<TouchableOpacity
          onPress={handleFollow}
        style={{
          backgroundColor: isFollowing ? 'gray' : 'blue',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
        >
          <Text>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>)
      } */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    marginTop: 55,
    marginLeft: 30,
  },
  icon: {
    width: 18,
    height: 18,
    opacity: 0.4,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    opacity: 0.8,
  },
  buttonContainer: {
    position: 'absolute',
    top: 40,
    right: 30,
    paddingTop: 9,
  },
  cameraIconContainer: {
    marginTop: -10,
    marginLeft: 185,
  },
  profilePicContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  profilePicture: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
  usernameContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 30,
  },
  usernameTagContainer: {
    marginLeft: 40,
  },
  usernameTag: {
    color: '#464545',
    fontFamily: 'Arial',
    fontSize: 17,
    fontWeight: 'bold',
  },
  usernameEditContainer: {
    marginLeft: 80,
  },
  usernameEdit: {
    color: '#5C64B0',
    fontFamily: 'Arial',
    fontSize: 17,
    fontWeight: 'bold',
  },
  bioContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 30,
  },
  bioContainerBold: {
    marginLeft: 40,
  },
  bio: {
    color: '#464545',
    fontFamily: 'Arial',
    fontSize: 17,
    fontWeight: 'bold',
  },
  bioTextContainer: {
    marginLeft: 135,
  },
  bioText: {
    color: '#5C64B0',
    fontFamily: 'Arial',
    fontSize: 17,
    fontWeight: 'bold',
  },
  locationMainContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 60,
  },
  locationEditContainer: {
    marginLeft: 40,
  },
  locationEdit: {
    color: '#464545',
    fontFamily: 'Arial',
    fontSize: 17,
    fontWeight: 'bold',
  },
  locationContainer: {
    marginLeft: 90,
  },
  location: {
    color: '#5C64B0',
    fontFamily: 'Arial',
    fontSize: 17,
    fontWeight: 'bold',
  },
});


export default EditProfile;