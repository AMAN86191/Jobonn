import api from './axiosConfig';

export const getUserProfileData = async () => {
  try {
    const response = await api.get(`/get_profile`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
