// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'https://admin.jobonn.in/api';
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '../services/firebase/crashlytics';


const API_URL = 'https://admin.jobonn.in/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,

  error => {
    try {
      const apiUrl = error?.config?.url || 'Unknown API';
      const method = error?.config?.method || 'Unknown Method';
      const status = error?.response?.status || 'No Status';

      logError(
        error,
        `${method.toUpperCase()} ${apiUrl} | Status: ${status}`,
      );
    } catch (e) {
      console.log(e);
    }

    return Promise.reject(error);
  },
);

export default api;