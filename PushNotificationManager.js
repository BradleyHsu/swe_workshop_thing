import messaging from './src/firebase/config'

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function registerAppWithFCM() {
  await requestUserPermission();
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
messaging().onMessage(async (remoteMessage) => {
    console.log('Message received in the foreground!', remoteMessage);
  });