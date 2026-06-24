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

export const SetPassword = async (credentials: any) => {
  try {
    const response = await api.post(`/company/set-password`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const CompleteRegistration = async (formData: FormData) => {
  try {
    const response = await api.post(`/company/complete-registration`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};
export const UpdateCompanyProfile = async (formData: FormData) => {
  try {
    const response = await api.post(`/company/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const LoginUser = async (credentials: any) => {
  try {
    const response = await api.post(`/login`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const LogoutUser = async () => {
  try {
    const response = await api.post(`/company/logout`);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const SendOtpCandidate = async (credentials: any) => {
  try {
    const response = await api.post(`/candidate/send-otp`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const VerifyOtpCandidate = async (credentials: any) => {
  try {
    const response = await api.post(`/candidate/verify-otp`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const SetPasswordCandidate = async (credentials: any) => {
  try {
    const response = await api.post(`/candidate/set-password`, credentials);
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};

export const CompleteRegistrationCandidate = async (formData: FormData) => {
  try {
    const response = await api.post(`/candidate/complete-registration`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const payload = error.response?.data ?? { message: error.message };
    throw payload;
  }
};








