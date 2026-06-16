import api from "./axiosConfig";










export const GetJobs = async (credentials: any) => {
    try {
        const response = await api.get(`/getJobs`, credentials);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};
export const PostJob = async (credentials: any) => {
    try {
        const response = await api.post(`/postJob`, credentials);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};
export const MyJobs = async (credentials: any) => {
    try {
        const response = await api.get(`/jobs/my`, credentials);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};
export const JobDetails = async (credentials: any) => {
    try {
        const response = await api.get(`/jobs/${credentials}`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};
export const UpdateJob = async (id: any, credentials: any) => {
    try {
        const response = await api.put(`/jobs/${id}`, credentials);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};