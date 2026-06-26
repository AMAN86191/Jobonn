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

export const getAppliedCandidates = async (page: number = 1) => {
  try {
    const response = await api.get(`/company/applied-candidates?page=${page}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAppliedCandidateDetail = async (candidateId: number | string) => {
  try {
    const response = await api.get(`/company/applied-candidate-detail/${candidateId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateJobStatus = async (jobId: number | string, status: string) => {
  try {
    const response = await api.patch(`/company/job-status-update/${jobId}`, { status });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getJobAppliedCandidates = async (jobId: number | string) => {
  try {
    const response = await api.get(`/company/job-applied-candidates/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const unlockCandidateContact = async (payload: { candidate_id: number | string }) => {
  try {
    const response = await api.post(`/company/view-candidate-profile/${payload.candidate_id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};


