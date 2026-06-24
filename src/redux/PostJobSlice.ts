import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  GetJobDepartments,
  CreateJobDepartment,
  GetJobIndustries,
  CreateJobIndustry,
  GetJobTitles,
  CreateJobTitle,
  GetJobLocations,
  CreateJobLocation,
  GetSkillsByJobTitle,
  SearchSkills,
  CreateSkill,
  PostJob,
} from '../api/PostJobProvide';

interface PostJobState {
  loading: boolean;
  error: any | null;
  message: string | null;
  departments: any;
  industries: any;
  jobTitles: any;
  locations: any;
  skills: any;
  searchedSkills: any;
}

const initialState: PostJobState = {
  loading: false,
  error: null,
  message: null,
  departments: null,
  industries: null,
  jobTitles: null,
  locations: null,
  skills: null,
  searchedSkills: null,
};

export const getJobDepartmentsSlice = createAsyncThunk(
  'PostJob/getJobDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetJobDepartments();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJobDepartmentSlice = createAsyncThunk(
  'PostJob/createJobDepartment',
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const response = await CreateJobDepartment(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getJobIndustriesSlice = createAsyncThunk(
  'PostJob/getJobIndustries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetJobIndustries();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJobIndustrySlice = createAsyncThunk(
  'PostJob/createJobIndustry',
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const response = await CreateJobIndustry(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



export const getJobTitlesSlice = createAsyncThunk(
  'PostJob/getJobTitles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetJobTitles();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJobTitleSlice = createAsyncThunk(
  'PostJob/createJobTitle',
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const response = await CreateJobTitle(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getJobLocationsSlice = createAsyncThunk(
  'PostJob/getJobLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetJobLocations();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJobLocationSlice = createAsyncThunk(
  'PostJob/createJobLocation',
  async (payload: { location_name: string }, { rejectWithValue }) => {
    try {
      const response = await CreateJobLocation(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSkillsByJobTitleSlice = createAsyncThunk(
  'PostJob/getSkillsByJobTitle',
  async (job_title_id: any, { rejectWithValue }) => {
    try {
      const response = await GetSkillsByJobTitle(job_title_id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchSkillsSlice = createAsyncThunk(
  'PostJob/searchSkills',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await SearchSkills(query);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSkillSlice = createAsyncThunk(
  'PostJob/createSkill',
  async (payload: { job_title_id: any; skill_name: string }, { rejectWithValue }) => {
    try {
      const response = await CreateSkill(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const postJobSlice = createAsyncThunk(
  'PostJob/postJob',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await PostJob(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



const PostJobSlice = createSlice({
  name: 'PostJob',
  initialState,
  reducers: {
    clearPostJobError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Departments
      .addCase(getJobDepartmentsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobDepartmentsSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload?.departments || action.payload || [];
      })
      .addCase(getJobDepartmentsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get job departments';
      })

      // Create Department
      .addCase(createJobDepartmentSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobDepartmentSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Department created successfully';
      })
      .addCase(createJobDepartmentSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create department';
      })

      // Get Industries
      .addCase(getJobIndustriesSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobIndustriesSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = action.payload?.industries || action.payload || [];
      })
      .addCase(getJobIndustriesSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get job industries';
      })

      // Create Industry
      .addCase(createJobIndustrySlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobIndustrySlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Industry created successfully';
      })
      .addCase(createJobIndustrySlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create industry';
      })


      // Get Job Titles
      .addCase(getJobTitlesSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobTitlesSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.jobTitles = action.payload?.job_titles || action.payload || [];
      })
      .addCase(getJobTitlesSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get job titles';
      })

      // Create Job Title
      .addCase(createJobTitleSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobTitleSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Job title created successfully';
      })
      .addCase(createJobTitleSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create job title';
      })

      // Get Job Locations
      .addCase(getJobLocationsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobLocationsSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload?.locations || action.payload || [];
      })
      .addCase(getJobLocationsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get job locations';
      })

      // Create Job Location
      .addCase(createJobLocationSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobLocationSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Job location created successfully';
      })
      .addCase(createJobLocationSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create job location';
      })

      // Get Skills By Job Title
      .addCase(getSkillsByJobTitleSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSkillsByJobTitleSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload?.skills || action.payload || [];
      })
      .addCase(getSkillsByJobTitleSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get skills for job title';
      })

      // Search Skills
      .addCase(searchSkillsSlice.pending, (state) => {
        state.error = null;
      })
      .addCase(searchSkillsSlice.fulfilled, (state, action) => {
        state.searchedSkills = action.payload?.skills || action.payload || [];
      })
      .addCase(searchSkillsSlice.rejected, (state, action) => {
        state.error = action.payload || 'Failed to search skills';
      })

      // Create Skill
      .addCase(createSkillSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSkillSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Skill created successfully';
      })
      .addCase(createSkillSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create skill';
      })

      // Post Job
      .addCase(postJobSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJobSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Job posted successfully';
      })
      .addCase(postJobSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to post job';
      });
  },
});

export const { clearPostJobError } = PostJobSlice.actions;
export default PostJobSlice.reducer;
