import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCompanyPackages } from '../api/CompanyHomeProvider';

interface CompanyHomeState {
  packages: any[];
  loading: boolean;
  error: any | null;
}

const initialState: CompanyHomeState = {
  packages: [],
  loading: false,
  error: null,
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

const companyHomeSlice = createSlice({
  name: 'companyHome',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export default companyHomeSlice.reducer;
