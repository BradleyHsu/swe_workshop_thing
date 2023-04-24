import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as db_operations from '../db_operations.js';

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
        
    let timerId = setInterval(() => {
      db_operations.getKarma(username).then(karma => {
        setLikes(karma)
      });
    }, 5000);
    const checkFollowingStatus = async () => {
      const isUserFollowing = await db_operations.isFollowing(current_username, username);
      setIsFollowing(isUserFollowing);

    };
    checkFollowingStatus();
    return () => clearInterval(timerId);
  }, [username, current_username, likes]);

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
        {username === current_username &&
          (<View>
            <TouchableOpacity onPress={() => navigation.navigate('Settings', {
                                          username: username, 
                                          current_username: current_username,
                                          isDefaultUser: false,
                                        })}>
              <View style={styles.threeDotsContainer}>
                <Image source={require('../assets/icons/threedots_icon.png')}
                  style={styles.threeDots} />
              </View>
            </TouchableOpacity>
            <View style={styles.profilePicContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile', {
                                          username: username, 
                                          current_username: current_username,
                                          isDefaultUser: false,
                                        })}>
                <Image
                  source={{uri: "data:image/png;base64," + profilePicture}}
                  style={styles.profilePicture}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{name}</Text>
            </View>
            <View style={styles.itemsContainer}>
              <View style={styles.followersContainer}>
                <Text style={styles.followers}>Followers</Text>
              </View>
              <View style={styles.followingContainer}>
                <Text style={styles.following}>Following</Text>
              </View>
              <View style={styles.charmaContainer}>
                <Text style={styles.charma}>Charma</Text>
              </View>
            </View>
            <View style={styles.itemsNumContainer}>
              <View style={styles.followersNumContainer}>
                <Text style={styles.followersNum}>76</Text>
              </View>
              <View style={styles.followingNumContainer}>
                <Text style={styles.followingNum}>142</Text>
              </View>
              <View style={styles.charmaNumContainer}>
                <Text style={styles.charmaNum}>{likes}</Text>
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
            <View style={styles.locationContainer}>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationText}>
                  Location
                </Text>
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.locationInfo}>los angeles, ca</Text>
              </View>
            </View>
          </View>)
        }
        {username != current_username &&
          (
            <View style={styles.container2}>
              <TouchableOpacity onPress={() => navigation.navigate('MessageBoard')}>
                <View style={styles.backArrowContainer}>
                  <Image source={require('../assets/icons/back_arrow_icon.png')}
                    style={styles.backArrow} />
                </View>
              </TouchableOpacity>
              <View style={styles.username2Container}>
                <Text style={styles.username2}>{name}</Text>
              </View>
              <View style={styles.topRowContainer}>
                <View style={styles.picContainer}>
                  <Image source={require('../assets/images/dog_picture.jpg')}
                    style={styles.pic} />
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
                      <Text style={styles.followingCount2}>20</Text>
                    </View>
                    <View style={styles.following2CountContainer}>
                      <Text style={styles.followersCount2}>40</Text>
                    </View>
                    <View style={styles.charma2CountContainer}>
                      <Text style={styles.charma2Count}>{likes}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.bioWholeContainer}>
                <View style={styles.bioFrontContainer}>
                  <Text style={styles.bioFront}>
                    Bio
                  </Text>
                </View>
                <View style={styles.bioInfoContainer}>
                  <Text style={styles.bioInfo}>
                    i am cool person. i love 437.
                    #washu437rocks
                  </Text>
                </View>
              </View>
              <View style={styles.mutualFriendsContainer}>
                <View style={styles.picMutualFriendsContainer}>
                  <View style={styles.picFriendsContainer}>
                    <Image source={require('../assets/images/dog_picture.jpg')}
                      style={styles.picMutualFriends} />
                  </View>
                  <View style={styles.moreMutualFriendsContainer}>
                    <View style={styles.moreMutualFriendsText}>
                      <Text style={styles.moreMutualFriends}>+18</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.mutualFriendsTextContainer}>
                  <Text style={styles.mutualFriendsText}>
                    Mutual friends with [username1] and 18 more
                  </Text>
                </View>
              </View>
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
                }}>{isFollowing ? 'Friends' : 'Follow'}</Text>
              </TouchableOpacity>
              <View style={styles.postForDay}>
                <View style={styles.headerContainer}>
                  <View style={styles.headerLocationContainer}>
                    <Text style={styles.headerLocation}>Los Angeles, California</Text>
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
                <View style={styles.mainTextContainer}>
                  <Text style={styles.mainText}>Going skydiving...</Text>
                </View>
                <View style={styles.footerContainer}>
                  <View style={styles.upvoteContainer}>
                    <Image source={require('../assets/icons/black_thumb_icon.png')}
                      style={styles.upvote} />
                  </View>
                  <View style={styles.upvoteNumContainer}>
                    <Text style={styles.upvoteNum}>20</Text>
                  </View>
                  <View style={styles.commentContainer}>
                    <Image source={require('../assets/icons/comments_icon.png')}
                      style={styles.comment} />
                  </View>
                  <View style={styles.commentNumContainer}>
                    <Text style={styles.commentNum}>2</Text>
                  </View>
                </View>
              </View>
            </View>)
        }
      </View>
      <View style={styles.usernameContainer}>
        <Text style={styles.username}>{name}</Text>
      </View>
      <View style={styles.itemsContainer}>
        <View style={styles.followersContainer}>
          <Text style={styles.followers}>Followers</Text>
        </View>
        <View style={styles.followingContainer}>
          <Text style={styles.following}>Following</Text>
        </View>
        <View style={styles.charmaContainer}>
          <Text style={styles.charma}>Charma</Text>
        </View>
      </View>
      <View style={styles.itemsNumContainer}>
        <View style={styles.followersNumContainer}>
          <Text style={styles.followersNum}>76</Text>
        </View>
        <View style={styles.followingNumContainer}>
          <Text style={styles.followingNum}>142</Text>
        </View>
        <View style={styles.charmaNumContainer}>
          <Text style={styles.charmaNum}>{likes}</Text>
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
      <View style={styles.locationContainer}>
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationText}>
            Location
          </Text>
        </View>
        <View style={styles.locationInfoContainer}>
          <Text style={styles.locationInfo}>los angeles, ca</Text>
        </View>
      </View>
      {/* <View style={styles.memoriesContainer}>
        <View style={styles.urMemoriesContainer}>
          <Text style={styles.urMemories}>Your Memories</Text>
        </View>
        <View style={styles.visibleContainer}>
          <Text style={styles.visible}>(visible only to you)</Text>
        </View>
      </View> */}
      {username === current_username &&
        (<TouchableOpacity
          onPress={handleLogout}
        // style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 20 }}
        >
          {/* <Text>Log out</Text> */}
        </TouchableOpacity>)
      }
      {username != current_username &&
        (<TouchableOpacity
          onPress={handleFollow}
        // style={{
        //   backgroundColor: isFollowing ? 'gray' : 'blue',
        //   padding: 10,
        //   borderRadius: 5,
        //   marginTop: 20,
        // }}
        >
          <Text>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>)
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profilePicContainer: {
    marginTop: 90,
    alignItems: 'center',
  },
  profilePicture: {
    height: 160,
    width: 160,
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
});


export default ProfilePage;