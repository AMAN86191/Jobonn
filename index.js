/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { handleNotificationTap } from './src/utils/pushNotificationHelper';

// Register Firebase messaging background handler
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.log('[index.js] Firebase remote message handled in background:', remoteMessage);
});

// Register Notifee background handler (for handling notification actions/taps in background/quit states)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log(`[index.js] Notifee background event received. Type: ${type}`);
  if (type === EventType.PRESS && detail.notification?.data) {
    console.log('[index.js] Notifee notification press event in background:', detail.notification);
    handleNotificationTap(detail.notification.data);
  }
});

if (!__DEV__) {
    console.log = () => { };
    console.warn = () => { };
    console.error = () => { };
    console.info = () => { };
    console.debug = () => { };
}

AppRegistry.registerComponent(appName, () => App);
