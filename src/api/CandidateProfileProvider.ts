import api from './axiosConfig';

export const savePersonalDetails = async (payload: any) => {
  try {
    const response = await api.post('/candidate/personal-details', payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const saveProfessionalInfo = async (payload: any) => {
  try {
    const response = await api.post('/candidate/professional-details', payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const saveCareerPreferences = async (payload: any) => {
  try {
    const response = await api.post('/candidate/career-preferences', payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const saveEducation = async (payload: any) => {
  try {
    const response = await api.post('/candidate/educations', payload);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const saveDocuments = async (payload: FormData) => {
  try {
    const response = await api.post('/candidate/docs', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/candidate/get-profile');
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

export const updateProfile = async (payload: any) => {
  try {
    const isFormData = payload instanceof FormData;
    const response = await api.post('/candidate/profile-update', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data ?? { message: error.message };
    throw data;
  }
};

