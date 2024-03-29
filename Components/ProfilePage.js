import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackActions } from '@react-navigation/native';
import * as db_operations from '../db_operations.js';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from 'react-native-popup-menu';
 import { MenuProvider } from 'react-native-popup-menu';

const ProfilePage = ({ navigation, route }) => {
  const username = route.params.username
  const current_username = route.params.current_username
  console.log('username', username);
  console.log('current_username', current_username);
  const [name, setName] = useState(username); // account name
  const [questions, setQuestions] = useState([]); // array of past questions answered
  const [likes, setLikes] = useState(0); // number of likes user has gotten
  const [isFollowing, setIsFollowing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    setName(username)
    db_operations.getKarma(username).then(karma => {
      setLikes(karma)
    });
    db_operations.getProfilePic(username).then(pic => {
      console.log("got pic of user ", username);
      console.log(pic);
      setProfilePicture(pic);
    });
    db_operations.getFollowingCount(username).then(followingCount => {
      setFollowingCount(followingCount)
    })
    db_operations.getFollowerCount(username).then(followerCount => {
      setFollowerCount(followerCount)
    })
    db_operations.getBio(username).then(bio => {
      setBio(bio)
    })
    db_operations.getLocation(username).then(location =>{
      setLocation(location)
    })
        
    let timerId = setInterval(() => {
      db_operations.getKarma(username).then(karma => {
        setLikes(karma)
      });
      db_operations.getFollowingCount(username).then(followingCount => {
        setFollowingCount(followingCount)
      })
      db_operations.getFollowerCount(username).then(followerCount => {
        setFollowerCount(followerCount)
      })
      db_operations.getBio(username).then(bio => {
        setBio(bio)
      })
      db_operations.getLocation(username).then(location =>{
        setLocation(location)
      })
    }, 5000);
    const checkFollowingStatus = async () => {
      const isUserFollowing = await db_operations.isFollowing(current_username, username);
      setIsFollowing(isUserFollowing);

    };
    checkFollowingStatus();
    
    return () => clearInterval(timerId);
  }, [username, current_username, likes, followerCount, followingCount]);

  const handleNameChange = (text) => {
    setName(text);
  }

  const handleLogout = () => {
    navigation.navigate('Home')
  }
  const handleFollow = async () => {
    if (isFollowing) {
      await db_operations.unfollowUser(current_username, username);
    } else {
      await db_operations.followUser(current_username, username);
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <MenuProvider>
    <View style={styles.container}>
       <View style={styles.container2}>
        <TouchableOpacity onPress={() => navigation.dispatch(StackActions.pop(1))}>
         <View style={styles.backArrowContainer}>
          <Image source={require('../assets/icons/back_arrow_icon.png')}
           style={styles.backArrow} />
         </View>
        </TouchableOpacity>
        <View style={styles.usernameContainer2}>
         <Text style={styles.username2}>{name}</Text>
        </View>
        <View style={styles.topRowContainer}>
         <View style={styles.picContainer}>
         <Image
            source={{uri: "data:image/png;base64," + profilePicture}}
            style={styles.profilePicture}
          />
         </View>
         <View style={styles.bottomRowContainer}>
          <View style={styles.firstRowContainer}>
           <View style={styles.followers2Container}>
            <Text style={styles.followers2}>Followers</Text>
           </View>
           <View style={styles.following2Container}>
            <Text style={styles.following2}>Following</Text>
           </View>
           <View style={styles.charma2Container}>
            <Text style={styles.charma2}>Charma</Text>
           </View>
          </View>
          <View style={styles.secondRowContainer}>
           <View style={styles.followers2CountContainer}>
            <Text style={styles.followingCount2}>{followerCount}</Text>
           </View>
           <View style={styles.following2CountContainer}>
            <Text style={styles.followersCount2}>{followingCount}</Text>
           </View>
           <View style={styles.charma2CountContainer}>
            <Text style={styles.charma2Count}>{likes}</Text>
           </View>
          </View>
         </View>
        </View>
        {bio && (<View style={styles.bioWholeContainer}>
         <View style={styles.bioFrontContainer}>
          <Text style={styles.bioFront}>
           Bio
          </Text>
         </View>
         <View style={styles.bioInfoContainer}>
          <Text style={styles.bioInfo}>
            {bio}
          </Text>
         </View>
        </View>)}
        <TouchableOpacity
         onPress={handleFollow}
         // eslint-disable-next-line react-native/no-inline-styles
         style={{
          backgroundColor: isFollowing ? '#7456C9' : '#5C64B0',
          padding: 13,
          borderRadius: 15,
          marginTop: 7,
          marginLeft: 25,
          marginRight: 25,
         }}
        >
         <Text style={{
          color: '#DFDFDF',
          textAlign: 'center',
          fontFamily: 'InriaSans-Bold',
         }}>{isFollowing ? 'Following' : 'Follow'}</Text>
        </TouchableOpacity>
        {/* <View style={styles.postForDay}>
         <View style={styles.headerContainer}>
          <View style={styles.headerLocationContainer}>
           <Text style={styles.headerLocation}>{location}</Text>
          </View>
          <View style={styles.headerDotContainer}>
           <Text style={styles.headerDot}> • </Text>
          </View>
          <View style={styles.headerTimeContainer}>
           <Text style={styles.headerTime}>2 hrs late</Text>
          </View>
          <View style={styles.headerThreeDotsContainer}>
           <Menu>
            <MenuTrigger text='•••' customStyles={styles.threeDots} />
            <MenuOptions>
             <MenuOption onSelect={() => alert(`Saved`)} text='Save' />
             <MenuOption onSelect={() => alert(`Reported`)} >
              <Text style={{ color: 'red' }}>Report</Text>
             </MenuOption>
            </MenuOptions>
           </Menu>
          </View>
         </View>
        </View> */}
       </View>
    </View>
   </MenuProvider>
  );
 };

 const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  container2: {
   flex: 1,
   backgroundColor: 'white',
  },
  profilePicContainer: {
   marginTop: 90,
   alignItems: 'center',
  },
  profilePicture: {
   height: 100,
   width: 100,
   borderRadius: 80,
  },
  usernameContainer: {
   marginTop: 10,
   alignItems: 'center',
  },
  username: {
   color: '#464646',
   fontFamily: 'Arial',
   fontSize: 24,
   fontWeight: 'bold',
  },
  itemsContainer: {
   flexDirection: 'row',
   marginTop: 60,
  },
  followersContainer: {
   marginLeft: 40,
  },
  followers: {
   color: '#616161',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  followingContainer: {
   marginLeft: 40,
  },
  following: {
   color: '#616161',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  charmaContainer: {
   marginLeft: 40,
  },
  charma: {
   color: '#616161',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  itemsNumContainer: {
   flexDirection: 'row',
   marginTop: 15,
  },
  followersNumContainer: {
   marginLeft: 70,
  },
  followersNum: {
   color: '#969696',
   opacity: 0.52,
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  followingNumContainer: {
   marginLeft: 95,
  },
  followingNum: {
   color: '#969696',
   opacity: 0.52,
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  charmaNumContainer: {
   marginLeft: 93,
  },
  charmaNum: {
   color: '#969696',
   opacity: 0.52,
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  bioContainer: {
   marginLeft: 10,
   marginTop: 30,
  },
  bioContainerBold: {
   marginLeft: 30,
  },
  bio: {
   color: '#616161',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  locationText: {
   color: '#616161',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  bioTextContainer: {
   marginLeft: 60,
  },
  bioText: {
   color: '#969696',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
   marginTop: 20,
  },
  locationInfo: {
   color: '#969696',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
   marginTop: 20,
  },
  locationInfoContainer: {
   marginLeft: 28.5,
   marginRight: 40,
   paddingBottom: 60,
  },
  locationContainer: {
   marginTop: 60,
   marginLeft: 40,
  },
  memoriesContainer: {
   marginTop: 30,
   marginLeft: 40,
  },
  urMemories: {
   color: '#616161',
   fontFamily: 'Arial',
   fontSize: 17,
   fontWeight: 'bold',
  },
  visibleContainer: {
   marginTop: 3,
  },
  visible: {
   color: '#999999',
   fontFamily: 'Arial',
   fontSize: 11,
   marginLeft: 7,
   fontWeight: 'bold',
  },
  threeDots: {
   width: 22,
   height: 22,
   opacity: 0.8,
  },
  threeDotsContainer: {
   position: 'absolute',
   top: 50,
   right: 30,
  },
  backArrow: {
   width: 35,
   height: 35,
  },
  backArrowContainer: {
   marginLeft: 20,
   marginTop: 50,
  },
  username2: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 24,
   color: '#464646',
  },
  usernameContainer2: {
   position: 'absolute',
   top: 53,
   right: 140,
  },
  topRowContainer: {
   flexDirection: 'row',
   marginTop: 30,
  },
  picContainer: {
   marginLeft: 35,
  },
  pic: {
   width: 100,
   height: 100,
   borderRadius: 50,
  },
  bottomRowContainer: {
   flexDirection: 'column',
  },
  firstRowContainer: {
   flexDirection: 'row',
   marginTop: 23,
  },
  secondRowContainer: {
   flexDirection: 'row',
   marginTop: 15,
   marginLeft: 8,
  },
  followers2: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 14,
   color: '#616161',
  },
  following2: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 14,
   color: '#616161',
  },
  charma2: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 14,
   color: '#616161',
  },
  followers2Container: {
   marginLeft: 23,
  },
  following2Container: {
   marginLeft: 15,
  },
  charma2Container: {
   marginLeft: 18,
  },
  followers2CountContainer: {
   marginLeft: 43,
  },
  following2CountContainer: {
   marginLeft: 65,
  },
  charma2CountContainer: {
   marginLeft: 67,
  },
  followingCount2: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 13,
   color: '#969696',
   opacity: 0.52,
  },
  followersCount2: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 13,
   color: '#969696',
   opacity: 0.52,
  },
  charma2Count: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 13,
   color: '#969696',
   opacity: 0.52,
  },
  bioWholeContainer: {
   marginTop: 15,
   marginLeft: 30,
   marginRight: 30,
  },
  bioFront: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 17,
   color: '#616161',
  },
  bioInfoContainer: {
   marginTop: 7,
   marginLeft: 10,
  },
  bioInfo: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 13,
   color: '#969696',
  },
  mutualFriendsContainer: {
   flexDirection: 'row',
   marginTop: 25,
   marginLeft: 45,
  },
  picMutualFriendsContainer: {
   flexDirection: 'row',
  },
  picFriendsContainer: {
   zIndex: 100,
   marginRight: -10,
  },
  picMutualFriends: {
   width: 30,
   height: 30,
   borderRadius: 15,
  },
  moreMutualFriendsContainer: {
   zIndex: 80,
   backgroundColor: '#D9D9D9',
   borderRadius: 15,
   width: 30,
   height: 30,
   alignContent: 'center',
   alignItems: 'center',
  },
  moreMutualFriendsText: {
   marginTop: 9,
   marginLeft: 9,
  },
  moreMutualFriends: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 8,
   color: '#454545',
   textAlign: 'center',
  },
  mutualFriendsTextContainer: {
   marginRight: 30,
   marginLeft: 10,
   marginTop: 7,
  },
  mutualFriendsText: {
   fontFamily: 'InriaSans-Bold',
   fontSize: 11,
   color: '#969696',
  },
  postForDay: {
   backgroundColor: '#F1F1F1',
   marginTop: 30,
   marginLeft: 20,
   marginRight: 20,
   height: 200,
  },
  headerContainer: {
   flexDirection: 'row',
   marginLeft: 15,
   marginTop: 10,
  },
  headerLocationContainer: {
   marginTop: 2,
  },
  headerLocation: {
   fontFamily: 'InriaSans-LightItalic',
   color: '#9D9D9D',
   fontSize: 11,
  },
  headerDotContainer: {
  },
  headerDot: {
   color: '#9B9B9B',
  },
  headerTimeContainer: {
   marginTop: 2,
  },
  headerTime: {
   fontFamily: 'InriaSans-LightItalic',
   color: '#BDBCBC',
   fontSize: 10,
  },
  headerThreeDotsContainer: {
   opacity: 0.6,
   marginLeft: 120,
  },
  mainTextContainer: {
   marginTop: 10,
   marginLeft: 8,
  },
  mainText: {
   fontFamily: 'InriaSans-Bold',
   color: '#616161',
   fontSize: 18,
  },
  footerContainer: {
   flexDirection: 'row',
   marginTop: 110,
   marginLeft: 20,
  },
  upvoteContainer: {
   marginRight: 6,
  },
  upvote: {
   height: 20,
   width: 20,
   resizeMode: 'contain',
   opacity: 0.65,
  },
  upvoteNumContainer: {
   marginRight: 12,
  },
  upvoteNum: {
   color: '#726D6D',
   fontSize: 14,
  },
  commentContainer: {
   marginRight: 6,
  },
  comment: {
   width: 19,
   height: 19,
   resizeMode: 'contain',
   opacity: 0.65,
  },
  commentNum: {
   color: '#726D6D',
   fontSize: 14,
  },
 });


export default ProfilePage;