import api from './axiosConfig';

export const getCompanyPackages = async () => {
  try {
    const response = await api.get('/company/packages');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
export const packagePurchase = async (payload: any) => {
  try {
    const response = await api.post('/company/package-purchase', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getCompanyProfile = async () => {
  try {
    const response = await api.get('/company/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getCompanyJobs = async (page: number = 1) => {
  try {
    const response = await api.get(`/company/company-jobs?page=${page}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
