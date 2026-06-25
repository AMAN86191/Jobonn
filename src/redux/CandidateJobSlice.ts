import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCandidateJobs, applyJob, getAppliedJobs } from '../api/CandidateJobProvider';

interface CandidateJobsState {
  loading: boolean;
  error: any | null;
  jobs: any[];
  appliedJobs: any[];
  currentPage: number;
  lastPage: number;
  total: number;
}

const initialState: CandidateJobsState = {
  loading: false,
  error: null,
  jobs: [],
  appliedJobs: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
};

export const fetchCandidateJobsSlice = createAsyncThunk(
  'candidateJobs/fetchCandidateJobs',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getCandidateJobs(page);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const applyJobSlice = createAsyncThunk(
  'candidateJobs/applyJob',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await applyJob(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAppliedJobsSlice = createAsyncThunk(
  'candidateJobs/fetchAppliedJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAppliedJobs();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const candidateJobSlice = createSlice({
  name: 'candidateJobs',
  initialState,
  reducers: {
    clearJobsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateJobsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateJobsSlice.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.status) {
          const jobsData = action.payload.jobs;
          state.jobs = jobsData.data || [];
          state.currentPage = jobsData.current_page || 1;
          state.lastPage = jobsData.last_page || 1;
          state.total = jobsData.total || 0;
        }
      })
      .addCase(fetchCandidateJobsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch candidate jobs';
      })
      
      // Apply Job
      .addCase(applyJobSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJobSlice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyJobSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to apply for job';
      })

      // Fetch Applied Jobs
      .addCase(fetchAppliedJobsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobsSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload?.applications?.data || action.payload?.applied_jobs || action.payload || [];
      })
      .addCase(fetchAppliedJobsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch applied jobs';
      });
  },
});

export const { clearJobsError } = candidateJobSlice.actions;
export default candidateJobSlice.reducer;
