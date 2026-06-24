import { getCrashlytics, log, recordError, setUserId, setAttributes, crash } from '@react-native-firebase/crashlytics';

const crashlyticsInstance = getCrashlytics();

// Record manual exceptions
export const logError = async (error, context = '') => {
  try {
    if (context) {
      log(crashlyticsInstance, `Context: ${context}`);
    }
    const errorObj = error instanceof Error ? error : new Error(String(error));
    await recordError(crashlyticsInstance, errorObj);
  } catch (err) {
    console.error('[Firebase Crashlytics] Failed to record error:', err);
  }
};

// Log custom debug statements
export const logCustom = (message) => {
  try {
    log(crashlyticsInstance, message);
  } catch (err) {
    console.error('[Firebase Crashlytics] Failed to log custom message:', err);
  }
};

// Set User Identity in Crash reports
export const setCrashlyticsUser = async (userId, email = '', name = '') => {
  try {
    let actualUserId = null;
    let actualEmail = '';
    let actualName = '';

    // Handle flexible arguments: if first argument is email (contains '@')
    if (typeof userId === 'string' && userId.includes('@')) {
      actualEmail = userId;
      actualName = email;
    } else {
      actualUserId = userId;
      actualEmail = email;
      actualName = name;
    }

    if (actualUserId) {
      setUserId(crashlyticsInstance, String(actualUserId));
    }
    
    const attributes = {};
    if (actualEmail) attributes.email = String(actualEmail);
    if (actualName) attributes.name = String(actualName);
    
    if (Object.keys(attributes).length > 0) {
      setAttributes(crashlyticsInstance, attributes);
    }
  } catch (err) {
    console.error('[Firebase Crashlytics] Failed to set user details:', err);
  }
};

// Method to trigger a crash for testing purposes
export const crashTest = () => {
  crash(crashlyticsInstance);
};
