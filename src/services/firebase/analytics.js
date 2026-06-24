import { getAnalytics, logEvent as firebaseLogEvent, setUserId, setUserProperties } from '@react-native-firebase/analytics';

const analyticsInstance = getAnalytics();

// Logs a custom event
export const logEvent = async (name, params = {}) => {
  try {
    await firebaseLogEvent(analyticsInstance, name, params);
  } catch (error) {
    console.error('[Firebase Analytics] Failed to log event:', name, error);
  }
};

// Logs a screen view
export const logScreen = async (screenName, screenClass = '') => {
  try {
    await firebaseLogEvent(analyticsInstance, 'screen_view', {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  } catch (error) {
    console.error('[Firebase Analytics] Failed to log screen view:', screenName, error);
  }
};

// Sets user identity properties
export const setUser = async (userId, userProperties = {}) => {
  try {
    let actualUserId = userId;
    let actualUserProperties = userProperties;

    // Support calling setUser(userProperties) directly without userId
    if (typeof userId === 'object' && userId !== null) {
      actualUserId = null;
      actualUserProperties = userId;
    }

    if (actualUserId) {
      await setUserId(analyticsInstance, String(actualUserId));
    }
    if (actualUserProperties && Object.keys(actualUserProperties).length > 0) {
      await setUserProperties(analyticsInstance, actualUserProperties);
    }
  } catch (error) {
    console.error('[Firebase Analytics] Failed to set user:', userId, error);
  }
};

// Special Events Helpers
export const logAppOpen = () => logEvent('app_open');
export const logLogin = (method) => logEvent('login', { method });
export const logSignUp = (method) => logEvent('sign_up', { method });
export const logJobSearch = (query) => logEvent('job_search', { search_query: query });
export const logJobView = (jobId, jobTitle) => logEvent('job_view', { job_id: jobId, job_title: jobTitle });
export const logJobApply = (jobId, jobTitle) => logEvent('job_apply', { job_id: jobId, job_title: jobTitle });
export const logCompanyProfileView = (companyId, companyName) => logEvent('company_profile_view', { company_id: companyId, company_name: companyName });
