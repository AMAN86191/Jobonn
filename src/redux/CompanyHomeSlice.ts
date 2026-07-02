import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCompanyPackages, packagePurchase, getCompanyProfile, getCompanyJobs, getAppliedCandidates, updateJobStatus, unlockCandidateContact, updateHiringProcess, getRecommendedCandidates, getRecommendedCandidateDetail, sendJobInvite, getAllInvitations } from '../api/CompanyHomeProvider';

interface CompanyHomeState {
  packages: any[];
  loading: boolean;
  error: any | null;
  jobs: any[];
  page: number;
  lastPage: number;
  totalJobs: number;
  appliedCandidates: any[];
  appliedPage: number;
  appliedLastPage: number;
  appliedTotal: number;
}

const initialState: CompanyHomeState = {
  packages: [],
  loading: false,
  error: null,
  jobs: [],
  page: 1,
  lastPage: 1,
  totalJobs: 0,
  appliedCandidates: [],
  appliedPage: 1,
  appliedLastPage: 1,
  appliedTotal: 0,
};

export const getCompanyPackagesSlice = createAsyncThunk(
  'companyHome/getCompanyPackagesSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompanyPackages();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const packagePurchaseSlice = createAsyncThunk(
  'companyHome/packagePurchaseSlice',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await packagePurchase(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCompanyProfileSlice = createAsyncThunk(
  'companyHome/getCompanyProfileSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompanyProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCompanyJobsSlice = createAsyncThunk(
  'companyHome/getCompanyJobsSlice',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getCompanyJobs(page);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAppliedCandidatesSlice = createAsyncThunk(
  'companyHome/getAppliedCandidatesSlice',
  async (arg: number | { page: number; filters?: any }, { rejectWithValue }) => {
    try {
      const page = typeof arg === 'number' ? arg : arg.page;
      const filters = typeof arg === 'number' ? undefined : arg.filters;
      const response = await getAppliedCandidates(page, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateJobStatusSlice = createAsyncThunk(
  'companyHome/updateJobStatusSlice',
  async ({ jobId, status }: { jobId: number | string; status: string }, { rejectWithValue }) => {
    try {
      const response = await updateJobStatus(jobId, status);
      return { jobId, status, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const unlockCandidateContactSlice = createAsyncThunk(
  'companyHome/unlockCandidateContactSlice',
  async (payload: { candidate_id: number | string }, { rejectWithValue }) => {
    try {
      const response = await unlockCandidateContact(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateHiringProcessSlice = createAsyncThunk(
  'companyHome/updateHiringProcessSlice',
  async (
    { candidateId, applicationId, payload }: { candidateId: number | string; applicationId: number | string; payload: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateHiringProcess(candidateId, applicationId, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRecommendedCandidatesSlice = createAsyncThunk(
  'companyHome/getRecommendedCandidatesSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRecommendedCandidates();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRecommendedCandidateDetailSlice = createAsyncThunk(
  'companyHome/getRecommendedCandidateDetailSlice',
  async (candidateId: number | string, { rejectWithValue }) => {
    try {
      const response = await getRecommendedCandidateDetail(candidateId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const sendJobInviteSlice = createAsyncThunk(
  'companyHome/sendJobInviteSlice',
  async (payload: { candidate_id: number | string; job_id: number | string }, { rejectWithValue }) => {
    try {
      const response = await sendJobInvite(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllInvitationsSlice = createAsyncThunk(
  'companyHome/getAllInvitationsSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllInvitations();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const companyHomeSlice = createSlice({
  name: 'companyHome',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyJobsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyJobsSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload?.jobs?.data || [];
        state.page = action.payload?.jobs?.current_page || 1;
        state.lastPage = action.payload?.jobs?.last_page || 1;
        state.totalJobs = action.payload?.jobs?.total || 0;
      })
      .addCase(getCompanyJobsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch company jobs';
      })
      .addCase(getAppliedCandidatesSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppliedCandidatesSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCandidates = action.payload?.applications?.data || [];
        state.appliedPage = action.payload?.applications?.current_page || 1;
        state.appliedLastPage = action.payload?.applications?.last_page || 1;
        state.appliedTotal = action.payload?.applications?.total || 0;
      })
      .addCase(getAppliedCandidatesSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch applied candidates';
      })
      .addCase(updateJobStatusSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobStatusSlice.fulfilled, (state, action) => {
        state.loading = false;
        const { jobId, status } = action.payload;
        state.jobs = state.jobs.map((job: any) => {
          if (String(job.id) === String(jobId)) {
            return { ...job, status };
          }
          return job;
        });
      })
      .addCase(updateJobStatusSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update job status';
      });
  }
});

export default companyHomeSlice.reducer;
