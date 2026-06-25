import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCompanyPackages, packagePurchase, getCompanyProfile, getCompanyJobs } from '../api/CompanyHomeProvider';

interface CompanyHomeState {
  packages: any[];
  loading: boolean;
  error: any | null;
  jobs: any[];
  page: number;
  lastPage: number;
  totalJobs: number;
}

const initialState: CompanyHomeState = {
  packages: [],
  loading: false,
  error: null,
  jobs: [],
  page: 1,
  lastPage: 1,
  totalJobs: 0,
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
      });
  }
});

export default companyHomeSlice.reducer;
