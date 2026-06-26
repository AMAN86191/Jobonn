import api from "./axiosConfig";




export const GetJobDepartments = async () => {
    try {
        const response = await api.get(`/company/job-departments`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const CreateJobDepartment = async (payload: any) => {
    try {
        const response = await api.post(`/company/job-departments`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const GetJobIndustries = async () => {
    try {
        const response = await api.get(`/company/job-industry`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const CreateJobIndustry = async (payload: any) => {
    try {
        const response = await api.post(`/company/job-industry`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};



export const GetJobTitles = async () => {
    try {
        const response = await api.get(`/company/job-titles`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const CreateJobTitle = async (payload: any) => {
    try {
        const response = await api.post(`/company/job-titles`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const GetJobLocations = async () => {
    try {
        const response = await api.get(`/company/locations`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const CreateJobLocation = async (payload: any) => {
    try {
        const response = await api.post(`/company/locations`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const GetSkillsByJobTitle = async (job_title_id: any) => {
    try {
        const response = await api.get(`/company/job-title-skills/${job_title_id}`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const SearchSkills = async (query: string) => {
    try {
        const response = await api.get(`/company/skills/${query}`);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const CreateSkill = async (payload: { job_title_id: any, skill_name: string }) => {
    try {
        const response = await api.post(`/company/job-title-skills`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};

export const PostJob = async (payload: any) => {
    try {
        const response = await api.post(`/company/job-post`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};
export const EditPostJob = async (jobId: number | string, payload: any) => {
    try {
        const response = await api.put(`/company/update-job/${jobId}`, payload);
        return response.data;
    } catch (error: any) {
        const payload = error.response?.data ?? { message: error.message };
        throw payload;
    }
};
