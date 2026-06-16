import api from './axiosConfig';

export const SendOtp = async (credentials: any) => {
  try {
    const response = await api.post(`/company/send-otp`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};
export const VerifyOtp = async (credentials: any) => {
  try {
    const response = await api.post(`/company/verify-otp`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};








