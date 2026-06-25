import api from './axiosConfig';

export const getCandidateJobs = async (page: number = 1) => {
  try {
    const response = await api.get(`/candidate/all-jobs?page=${page}`);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const applyJob = async (payload: any) => {
  try {
    const response = await api.post('/candidate/apply-job', payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const getAppliedJobs = async () => {
  try {
    const response = await api.get('/candidate/applied-jobs');
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};
