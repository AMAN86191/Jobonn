import api from './axiosConfig';

export const getCompanyPackages = async () => {
  try {
    const response = await api.get('/company/packages');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
