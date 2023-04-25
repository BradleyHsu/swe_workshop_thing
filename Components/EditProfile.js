import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import * as db_operations from '../db_operations.js';
import {launchImageLibrary} from 'react-native-image-picker';
import { StackActions } from '@react-navigation/native';

const EditProfile = ({ navigation, route }) => {
  const {username, location, bio} = route.params
  const [profilePicture, setProfilePicture] = useState(null);
  const [updatedUsername, setUpdatedUsername] = useState(username)
  const [updatedBio, setUpdatedBio] = useState(bio)
  const [updatedLocation, setUpdatedLocation] = useState(location)
  const [isProfilePictureChanged, setIsProfilePictureChanged] = useState(false)
  
  useEffect(() => {
    db_operations.getProfilePic(username).then(pic => {
      setProfilePicture(pic);
    });
  }, [username, profilePicture]);
  
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
        if (response.assets[0].hasOwnProperty('base64')) {
          const base64Image = response.assets[0].base64;
          console.log("base64Image", base64Image)
          setProfilePicture(base64Image)
          console.log("after change", profilePicture)
          setIsProfilePictureChanged(true)
        } else {
          Alert.alert("Picture too large, cannot set profile picture.")
        }
      }
    });
  };
  const handleUsernameChange = (text) => {
      setUpdatedUsername(text)
  }

  const handleSave = async() => {
    //TODO: add ability to save username/prof picture
    if(isProfilePictureChanged){
      setIsProfilePictureChanged(false)
      await db_operations.setProfilePic(username, base64Image);
    }
    if(location !== updatedLocation){
      db_operations.updateLocation(username, updatedLocation)
    }
    if(bio !== updatedBio){
      db_operations.updateBio(username, updatedBio)
    }
    navigation.dispatch(StackActions.pop(2))
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Image
            style={styles.icon}
            source={require('../assets/icons/back_arrow_icon.png')}
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
      {/* <TouchableOpacity onPress={()=>console.log(username)}>
      <View style={styles.usernameContainer}>
        <View style={styles.usernameTagContainer} >
          <Text style={styles.usernameTag}>
            Username
          </Text>
        </View>
        <View style={styles.usernameEditContainer}>
          <TextInput style={styles.usernameEdit} onChangeText={text => setUpdatedUsername(text)}>
            {updatedUsername}
          </TextInput>
        </View>
      </View>
      </TouchableOpacity> */}
      <View style={styles.bioContainer}>
        <View style={styles.bioContainerBold} >
          <Text style={styles.bio}>
            Bio
          </Text>
        </View>
        <View style={styles.bioTextContainer}>
          <TextInput style={styles.bioText} onChangeText={text => setUpdatedBio(text)}>
            {updatedBio}
          </TextInput>
        </View>
      </View>
      <View style={styles.locationMainContainer}>
        <View style={styles.locationEditContainer} >
          <Text style={styles.locationEdit}>
            Location
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <TextInput style={styles.location} onChangeText={text => setUpdatedLocation(text)}>
            {updatedLocation}
          </TextInput>
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
    width: 30,
    height: 30,
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