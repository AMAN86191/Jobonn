import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationService from './NavigationService';

// Request permission for push notifications
export async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(getMessaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    console.log('[PushNotificationHelper] iOS Authorization status:', authStatus);
    return enabled;
  } else if (Platform.OS === 'android') {
    // For Android 13+ (API 33), request permission via Notifee
    const settings = await notifee.requestPermission();
    const enabled = settings.authorizationStatus >= 1; // 1 = Authorized
    console.log('[PushNotificationHelper] Android Notification permission enabled:', enabled);
    return enabled;
  }
  return false;
}

// Fetch and register FCM token
export async function getFCMToken() {
  try {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await getToken(getMessaging());
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('[PushNotificationHelper] FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('[PushNotificationHelper] Error fetching FCM Token:', error);
    return null;
  }
}

// Display custom local notification using Notifee (for foreground or data-only background messages)
export async function displayNotification(title?: string, body?: string, data?: any) {
  // Create default notification channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default_channel',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display the notification banner
  await notifee.displayNotification({
    title: title || 'Jobonn Notification',
    body: body || '',
    data: data || {},
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
}

// Common function to handle notification taps (navigate to specific screen)
export function handleNotificationTap(data: any) {
  if (!data) return;
  console.log('[PushNotificationHelper] Handling notification tap. Data:', data);

  const screen = data.screen;
  if (screen) {
    let params: any = undefined;
    if (data.params) {
      try {
        params = typeof data.params === 'string' ? JSON.parse(data.params) : data.params;
      } catch (e) {
        console.warn('[PushNotificationHelper] Failed to parse params:', e);
        params = data.params;
      }
    }
    console.log(`[PushNotificationHelper] Navigating to screen: ${screen} with params:`, params);
    NavigationService.navigate(screen, params);
  } else {
    console.log('[PushNotificationHelper] No specific screen provided in notification payload.');
  }
}

// Setup messaging and Notifee listeners
export function initNotificationListeners() {
  const messagingInstance = getMessaging();

  // 1. Listen for foreground Firebase Cloud Messages
  const unsubscribeOnMessage = onMessage(messagingInstance, async remoteMessage => {
    console.log('[PushNotificationHelper] Foreground FCM received:', remoteMessage);

    const title = remoteMessage.notification?.title || (remoteMessage.data?.title as string | undefined);
    const body = remoteMessage.notification?.body || (remoteMessage.data?.body as string | undefined);

    // Display foreground notification using Notifee so user gets a native banner
    await displayNotification(title, body, remoteMessage.data);
  });

  // 2. Handle when the app is in the background and user taps a Firebase push notification
  const unsubscribeNotificationOpenedApp = onNotificationOpenedApp(messagingInstance, remoteMessage => {
    console.log('[PushNotificationHelper] Notification opened app from background state:', remoteMessage);
    if (remoteMessage.data) {
      handleNotificationTap(remoteMessage.data);
    }
  });

  // 3. Handle when the app was closed (quit state) and is opened by tapping a Firebase push notification
  getInitialNotification(messagingInstance)
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('[PushNotificationHelper] Notification opened app from quit state:', remoteMessage);
        if (remoteMessage.data) {
          // Delay slightly to allow navigation container to mount
          setTimeout(() => {
            handleNotificationTap(remoteMessage.data);
          }, 800);
        }
      }
    });

  // 4. Listen for Notifee foreground events (e.g. tapping on a foreground banner shown by us)
  const unsubscribeNotifeeForeground = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('[PushNotificationHelper] User pressed foreground Notifee notification:', detail.notification);
      if (detail.notification?.data) {
        handleNotificationTap(detail.notification.data);
      }
    }
  });

  // Return unsubscribe functions to clean up listeners when component unmounts
  return () => {
    unsubscribeOnMessage();
    unsubscribeNotificationOpenedApp();
    unsubscribeNotifeeForeground();
  };
}
