import {
  getDatabase,
  ref,
  push,
  set,
  child,
  get,
  update,
} from 'firebase/database';
import { app } from './src/firebase/config';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
/* 
page loads
fetch comments (query db based on the date)
for each comment:
    fetch responses


(in background, chcek for realtime updates if anyone has written a comment)
 -- check for database changes
    
when user presses submit comment button (this is for you ben)
triggers function that writes comment (pushes comment to database)

methods:
PUSH:
write comment
respond to comment (grab commentID)

FETCH:
fetch comments
fetch responses to coment 

(this needs to be called on every comment and then every subsequent response found)

const prompt = ref(db, 'prompts/' + promptID);
*/

const db = getDatabase(app);

//report response
function reportResponse(promptID, responseID) {
  console.debug("reportResponse called")
  const responseRef = getResponseRef(promptID, responseID);
  get(responseRef).then((snapshot) => {
    if (snapshot.exists()) {
      const response = snapshot.val();
      const reportRef = ref(db, `reports/${promptID}/${responseID}`);
      push(reportRef, response);
    } else {
      console.debug("response does not exist")
    }
  })
}

function reportComment(responseID, commentID) {
  console.debug("reportResponse called")

  const commentRef = ref(db, `comments/${responseID}/${commentID}`);
  get(commentRef).then((snapshot) => {
    if (snapshot.exists()) {
      const response = snapshot.val();
      const reportRef = ref(db, `reports/${responseID}/${commentID}`);
      push(reportRef, response);
    } else {
      console.debug("comment does not exist")
    }
  })
}

function getUsers() {
  console.debug("getUsers called")
  return new Promise((resolve, reject) => {
    const dbRef = ref(db);
    get(child(dbRef, 'users'))
      .then(snapshot => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('No user data available');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

//get all prompts
function getPrompts() {
  console.debug("getPrompts called")
  return new Promise((resolve, reject) => {
    const dbRef = ref(db);
    get(child(dbRef, 'prompt/prompts'))
      .then(snapshot => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('No prompt data available');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function setPrompt(text) {
  console.debug('setPrompt ', text)
  const promptsRef = ref(db, 'prompt/prompts');
  const newPromptRef = push(promptsRef, {
    text: text,
    date: Date.now(),
    responses: [],
  });
  const promptID = newPromptRef.key;
  update(newPromptRef, { promptID: promptID });
}

function setUsername(username, userCredential) {
  console.debug("setUsername", username, userCredential)
  const user = userCredential.user;
  set(ref(db, `users/${user.uid}`), {
    username: username,
    email: user.email,
    karma: 0,
    likedResponses: [],
  });
}

async function updateUsername(prevUsername, newUsername) {
  const userObj = await getUser(prevUsername);
  const userRef = await getUserRef(prevUsername);
  userObj.username = newUsername
  update(userRef, userObj)
}

function getUsername(email) {
  console.debug("getUsername", email)
  return new Promise((resolve, reject) => {
    const dbRef = ref(db);
    get(child(dbRef, `users`))
      .then(snapshot => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          for (const userID in users) {
            const user = users[userID];
            if (user.email === email) {
              resolve(user.username);
            }
          }
          reject('User with email not found');
        } else {
          reject('No user data available');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getPrompt() {
  console.debug("getPrompt called")
  return new Promise((resolve, reject) => {
    const dbRef = ref(db);
    get(child(dbRef, 'prompt/prompts'))
      .then(snapshot => {
        if (snapshot.exists()) {
          const latestPrompt = Object.values(snapshot.val()).reduce(function (
            prev,
            curr,
          ) {
            return prev.date > curr.date ? prev : curr;
          });
          resolve(latestPrompt);
        } else {
          reject('No prompt data available');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getResponses(promptID) {
  console.debug("getResponses", promptID)
  const dbRef = ref(db);
  return get(child(dbRef, `responses/${promptID}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        return Promise.resolve(
          Object.values(snapshot.val()).map(obj => ({
            text: obj.text,
            userID: obj.userID,
            responseID: obj.responseID,
            likeCount: obj.likeCount,
            timestamp: obj.timestamp,
            replyCount: obj.replyCount,
          })),
        );
      } else {
        console.debug('get Responses: No data available');
        return Promise.resolve([]);
      }
    })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
}

function getComments(responseID) {
  console.debug("getComments", responseID)
  const dbRef = ref(db);
  return get(child(dbRef, `comments/${responseID}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        return Promise.resolve(
          Object.values(snapshot.val()).map(obj => ({
            text: obj.text,
            userID: obj.userID,
            commentID: obj.commentID,
            likeCount: obj.likeCount,
            timestamp: obj.timestamp,
          })),
        );
      } else {
        console.debug('getComments: No data available');
        return Promise.resolve([]);
      }
    })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
}

function respondToPrompt(userID, text, promptID) {
  console.debug('respondToPrompt', userID, text, promptID)

  const responsesRef = ref(db, `responses/${promptID}`);
  console.debug(responsesRef)
  const newResponse = push(responsesRef, {
    text: text,
    userID: userID,
    comments: [],
    likeCount: 0,
    timestamp: Date.now(),
    replyCount: 0,
  });
  const responseID = newResponse.key;
  update(newResponse, { responseID: responseID });
  return responseID;
}

function replyToResponse(userID, text, promptID, responseID) {
  console.debug('replyToResponse', userID, text, responseID)
  //add commentID to comment responses
  //add comment to comments
  const commentRef = ref(db, `comments/${responseID}`);

  const newComment = push(commentRef, {
    text: text,
    userID: userID,
    likeCount: 0,
    timestamp: Date.now(),
  });
  const commentID = newComment.key;
  update(newComment, { commentID: commentID });
  //TODO SEE IF THIS WORKS
  const responsesRef = getResponseRef(promptID, responseID)
  get(responsesRef).then(snapshot => {
    if (snapshot.exists()) {
      update(responsesRef, { replyCount: snapshot.val().replyCount + 1 })
      // return Promise.resolve(snapshot.val())
    } else {
      update(responsesRef, { replyCount: 0 })
    }
  })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });

}

function getResponseRef(promptID, responseID) {
  console.debug('getResponseRef', promptID, responseID)
  return ref(db, `responses/${promptID}/${responseID}`)
}

function getComment(promptID, responseID) {
  console.debug('getComment', promptID, responseID)
  const commentRef = getResponseRef(promptID, responseID)
  console.debug(commentRef)
  return get(commentRef).then(snapshot => {
    if (snapshot.exists()) {
      console.debug(snapshot.val())
      return Promise.resolve(snapshot.val())
    } else {
      console.debug('getComment: No data available');
      return Promise.resolve([]);
    }
  })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
}
const getLikes = async (promptID, responseID) => {
  console.debug('getLikes', promptID, responseID)
  commentObj = await getComment(promptID, responseID)
  return commentObj.likeCount
}

const incrementLike = async (promptID, responseID) => {
  console.debug('incrementLike', promptID, responseID)
  commentObj = await getComment(promptID, responseID)
  commentRef = getResponseRef(promptID, responseID)
  update(commentRef, { likeCount: commentObj.likeCount + 1 })
}

const decrementLike = async (promptID, responseID) => {
  console.debug('decrementLike', promptID, responseID)
  commentObj = await getComment(promptID, responseID)
  console.debug('decrementLike after getComment', promptID, responseID)
  commentRef = getResponseRef(promptID, responseID)
  console.debug('decrementLike after getResponseRef', promptID, responseID)
  update(commentRef, { likeCount: commentObj.likeCount - 1 })
}

const incrementLikeComment = async (responseID, commentID) => {
  console.debug('incrementLike', responseID, commentID)
  commentRef = ref(db, `comments/${responseID}/${commentID}`)
  get(commentRef).then((snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val().hasOwnProperty('likeCount')) {
        update(commentRef, { likeCount: snapshot.val().likeCount + 1 })
      } else {
        update(commentRef, { likeCount: 1 })
      }
    } else {
      console.debug('incrementLike: No data available');
    }
  })
}

const decrementLikeComment = async (responseID, commentID) => {
  console.debug('decrementLike', responseID, commentID)
  commentRef = ref(db, `comments/${responseID}/${commentID}`)
  get(commentRef).then((snapshot) => {
    if (snapshot.exists()) {
      update(commentRef, { likeCount: snapshot.val().likeCount - 1 })
    } else {
      console.debug('incrementLike: No data available');
    }
  })
}
const getLikedMessages = async (username) => {
  const userObj = await getUser(username);
  if (!userObj.hasOwnProperty('likedResponses')) {
    userObj.likedResponses = []
  }
  return userObj.likedResponses;
}

const likeResponse = async (username, responseID) => {
  userObj = await getUser(username)
  if (!userObj.hasOwnProperty('likedResponses')) {
    userObj.likedResponses = []
  }
  userObj.likedResponses.push(responseID)
  userRef = await getUserRef(username)
  update(userRef, userObj);
  return userObj.likedResponses
}

const getUserRef = async (username) => {
  const userObj = await getUser(username)
  const userRef = ref(db, `users/${userObj.userID}`)
  return userRef
}

const dislikeResponse = async (username, responseID) => {
  console.debug('dislikeResponse', username, responseID)
  userObj = await getUser(username)
  //technically shouldn't be needed, but in case our data is dirty useful to have
  if (!userObj.hasOwnProperty('likedResponses')) {
    userObj.likedResponses = []
  }
  const index = userObj.likedResponses.indexOf(responseID)
  userObj.likedResponses.splice(index, 1)

  userRef = await getUserRef(username)
  update(userRef, userObj);

  return userObj.likedResponses
}

const handleLike = async (username, posterUsername, promptID, responseID) => {
  console.debug('handleLike', username, posterUsername, promptID, responseID)
  await incrementLike(promptID, responseID)
  await incrementKarma(posterUsername)
  newLikes = await likeResponse(username, responseID)
  return newLikes
}

const handleDislike = async (username, posterUsername, promptID, responseID) => {
  console.debug('handleDislike', username, posterUsername, promptID, responseID)
  await decrementLike(promptID, responseID)
  await decrementKarma(posterUsername)
  newLikes = await dislikeResponse(username, responseID)
  return newLikes
}

const handleLikeComment = async (username, posterUsername, responseID, commentID) => {
  console.debug('handleLikeComment', username, posterUsername, responseID, commentID)
  await incrementLikeComment(responseID, commentID)
  await incrementKarma(posterUsername)
  newLikes = await likeResponse(username, commentID)
  return newLikes
}

const handleDislikeComment = async (username, posterUsername, responseID, commentID) => {
  console.debug('handleDislikeComment', username, posterUsername, responseID, commentID)
  await decrementLikeComment(responseID, commentID)
  await decrementKarma(posterUsername)
  newLikes = await dislikeResponse(username, responseID)
  return newLikes
}
function getUser(username) {
  console.debug('getUser', username)
  const dbRef = ref(db);
  return get(child(dbRef, `users`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (const userID in users) {
          const user = users[userID];
          if (user.username === username) {
            users[userID].userID = userID
            return users[userID];
          }
        }
        console.debug(`User with username ${username} not found`);
      } else {
        console.error('No user data available');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

const getKarma = async (username) => {
  console.debug('getKarma', username)
  const userObj = await getUser(username);
  if (userObj.hasOwnProperty("karma")) {
    return userObj.karma
  } else {
    return -1
  }
}

const incrementKarma = async (username) => {
  console.debug('incrementKarma', username)
  const userObj = await getUser(username);
  const userRef = await getUserRef(username)
  if (!userObj.hasOwnProperty("karma")) {
    userObj.karma = 0
  }
  userObj.karma = userObj.karma + 1
  update(userRef, userObj)
}

const decrementKarma = async (username) => {
  console.debug('decrementKarma', username)
  const userObj = await getUser(username);
  const userRef = await getUserRef(username)

  //technically shouldn't be needed, but in case our data is dirty useful to have
  if (!userObj.hasOwnProperty("karma")) {
    userObj.karma = 0
  }

  userObj.karma = userObj.karma - 1
  update(userRef, userObj)
}
async function getUserIDByUsername(username) {
  const userObj = await getUser(username);
  return userObj.userID;
}

async function getFollowing(username) {
  const userObj = await getUser(username);
  if (!userObj.hasOwnProperty('following')) {
    userObj.following = [];
  }
  return userObj.following;
}

async function isFollowing(username, targetUsername) {
  const following = await getFollowing(username);
  const targetUserID = await getUserIDByUsername(targetUsername);
  return following.includes(targetUserID);
}

async function followUser(username, targetUsername) {
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);
  const targetUserID = await getUserIDByUsername(targetUsername);

  if (!userObj.hasOwnProperty('following')) {
    userObj.following = [];
  }

  if (!userObj.following.includes(targetUserID)) {
    userObj.following.push(targetUserID);
    update(userRef, userObj);
  }
}

async function getFollowingCount(username) {
  const following = await getFollowing(username)
  return following.length
}

async function updateLocation(username, location) {
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);
  userObj.location = location
  update(userRef, userObj)
}

async function getLocation(username) {
  const userObj = await getUser(username);
  if (userObj.hasOwnProperty("location")) {
    return userObj.location
  } else {
    return 'No User Location Set'
  }
}

async function updateBio(username, bio) {
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);
  userObj.bio = bio
  update(userRef, userObj)
}

async function togglePrivate(username) {
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);
  if (!userObj.hasOwnProperty("private")) {
    userObj.private = false
  }
  userObj.private = !userObj.private
  update(userRef, userObj)
}

async function getPrivate(username) {
  const userObj = await getUser(username);
  if (userObj.hasOwnProperty("private")) {
    return userObj.private
  } else {
    return false
  }
}

async function toggleNotifications(username) {
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);
  if (!userObj.hasOwnProperty("notifications")) {
    userObj.notifications = true
  }
  userObj.notifications = !userObj.notifications
  update(userRef, userObj)
}

async function getNotifications(username) {
  const userObj = await getUser(username);
  if (userObj.hasOwnProperty("notifications")) {
    return userObj.notifications
  } else {
    return true
  }
}


async function getBio(username) {
  const userObj = await getUser(username);
  if (userObj.hasOwnProperty("bio")) {
    return userObj.bio
  } else {
    return 'No User Bio Set'
  }
}

async function getFollowerCount(username) {
  var followerCount = 0
  const thisUserID = await getUserIDByUsername(username)
  const dbRef = ref(db);
  return get(child(dbRef, `users`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (const userID in users) {
          const user = users[userID];
          if (!user.following) {
            continue;
          }
          for (const followingUserID of user.following) {
            if (followingUserID === thisUserID) {
              followerCount++;
            }
          }
        }
        console.log('FOLLOWER COUNT: ', followerCount)
        return followerCount;
      } else {
        console.error('No user data available');
      }
    })
    .catch(error => {
      console.error(error);
    });

}

async function unfollowUser(username, targetUsername) {
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);
  const targetUserID = await getUserIDByUsername(targetUsername);

  if (userObj.hasOwnProperty('following') && userObj.following.includes(targetUserID)) {
    userObj.following = userObj.following.filter(id => id !== targetUserID);
    update(userRef, userObj);
  }
}

async function getProfilePic(username) {
  console.debug('getProfilePic', username);
  const userObj = await getUser(username);

  if (userObj.hasOwnProperty('profilepic')) {
    return userObj.profilepic;
  } else {
    // Load the default picture and convert it to base64
    return "iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==";
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
async function setProfilePic(username, base64Pic) {
  console.debug('setProfilePic', username);
  const userObj = await getUser(username);
  const userRef = await getUserRef(username);

  userObj.profilepic = base64Pic;
  update(userRef, userObj);
}

async function submitSuggestionPrompt(promptText) {
  const promptRef = ref(db, 'suggestionPrompts');
  const newPromptRef = push(promptRef);
  const newPromptID = newPromptRef.key;

  const promptObj = {
    promptID: newPromptID,
    promptText: promptText,
  };

  set(newPromptRef, promptObj);
}
/* real-time listening 
const commentRef = ref(db, 'prompts/' + promptID + '/starCount');
onValue(commentRef, (snapshot) => {
  const data = snapshot.val();
  updateComments(postElement, data);
});
*/
export {
  reportComment,
  reportResponse,
  getPrompts,
  setUsername,
  getUsername,
  setPrompt,
  respondToPrompt,
  getPrompt,
  getResponses,
  getComments,
  replyToResponse,
  getComment,
  incrementLike,
  decrementLike,
  handleDislike,
  handleLike,
  getLikedMessages,
  getLikes,
  getKarma,
  incrementKarma,
  decrementKarma,
  getUserIDByUsername,
  getFollowing,
  isFollowing,
  followUser,
  unfollowUser,
  getProfilePic,
  setProfilePic,
  getFollowingCount,
  getFollowerCount,
  updateLocation,
  getLocation,
  updateBio,
  getBio,
  updateUsername,
  submitSuggestionPrompt,
  togglePrivate,
  getPrivate,
  toggleNotifications,
  getNotifications,
  incrementLikeComment,
  decrementLikeComment,
  handleLikeComment,
  handleDislikeComment,
  getUsers,
};
