import api from './axiosConfig';

export const getCandidateJobs = async (page: number = 1, filters?: any) => {
  try {
    let url = `/all-jobs?page=${page}`;
    if (filters) {
      if (filters.job_title_id) {
        url += `&job_title_id=${filters.job_title_id}`;
      }
      if (filters.job_types && Array.isArray(filters.job_types)) {
        filters.job_types.forEach((type: string) => {
          url += `&job_types[]=${type}`;
        });
      }
      if (filters.skills) {
        url += `&skills=${filters.skills}`;
      }
      if (filters.salary_from) {
        url += `&salary_from=${filters.salary_from}`;
      }
      if (filters.salary_to) {
        url += `&salary_to=${filters.salary_to}`;
      }
      if (filters.experience_from) {
        url += `&experience_from=${filters.experience_from}`;
      }
      if (filters.experience_to) {
        url += `&experience_to=${filters.experience_to}`;
      }
      if (filters.location_id) {
        url += `&location_id=${filters.location_id}`;
      }
      if (filters.department_id) {
        url += `&department_id=${filters.department_id}`;
      }
    }
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const getAllSkills = async () => {
  try {
    const response = await api.get('/all-skill');
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? { message: error.message };
  }
};

export const getAllLocations = async () => {
  try {
    const response = await api.get('/all-location');
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? { message: error.message };
  }
};

export const getJobDepartmentsMaster = async () => {
  try {
    const response = await api.get('/job-departments');
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? { message: error.message };
  }
};

export const getJobTitlesMaster = async () => {
  try {
    const response = await api.get('/job-titles');
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? { message: error.message };
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

export const getCandidateInvitations = async () => {
  try {
    const response = await api.get('/candidate/all-invitations');
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const replyCandidateInvitation = async (invitationId: number | string, payload: { status: 'accepted' | 'rejected' }) => {
  try {
    const response = await api.post(`/candidate/job-invite-reply/${invitationId}`, payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};
