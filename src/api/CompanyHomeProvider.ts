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

export const getCompanyJobs = async (page: number = 1, status?: string) => {
  try {
    let url = `/company/company-jobs?page=${page}`;
    if (status) {
      url += `&status=${status.toLowerCase()}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAppliedCandidates = async (page: number = 1, filters?: any) => {
  try {
    let url = `/company/applied-candidates?page=${page}`;
    if (filters) {
      if (filters.job_title_id) {
        url += `&job_title_id=${filters.job_title_id}`;
      }
      if (filters.job_id) {
        url += `&job_id=${filters.job_id}`;
      }
      if (filters.min_experience !== undefined) {
        url += `&min_experience=${filters.min_experience}`;
      }
      if (filters.max_experience !== undefined) {
        url += `&max_experience=${filters.max_experience}`;
      }
      if (filters.min_salary !== undefined) {
        url += `&min_salary=${filters.min_salary}`;
      }
      if (filters.max_salary !== undefined) {
        url += `&max_salary=${filters.max_salary}`;
      }
      if (filters.location) {
        url += `&location=${filters.location}`;
      }
      if (filters.skills) {
        if (Array.isArray(filters.skills)) {
          filters.skills.forEach((skillId: any, index: number) => {
            url += `&skills[${index}]=${skillId}`;
          });
        } else {
          url += `&skills=${filters.skills}`;
        }
      }
      if (filters.search) {
        url += `&search=${encodeURIComponent(filters.search)}`;
      }
      if (filters.job_type) {
        url += `&job_type=${filters.job_type}`;
      }
    }
console.log('Applied candidate url', url)
    const response = await api.get(url);
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

export const updateHiringProcess = async (candidateId: number | string, applicationId: number | string, payload: any) => {
  try {
    const response = await api.put(`/company/hiring-process-update/${candidateId}/${applicationId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAllScheduledInterviews = async () => {
  try {
    const response = await api.get('/company/all-scheduled-interviews');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getRecommendedCandidates = async () => {
  try {
    const response = await api.get('/company/recommended-candidates');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getRecommendedCandidateDetail = async (candidateId: number | string) => {
  try {
    const response = await api.get(`/company/recommended-candidate-detail/${candidateId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const sendJobInvite = async (payload: { candidate_id: number | string; job_id: number | string }) => {
  try {
    const response = await api.post('/company/job-invite-sent', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAllInvitations = async () => {
  try {
    const response = await api.get('/company/all-invitations');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};


