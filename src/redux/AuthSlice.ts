import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SendOtp, VerifyOtp } from '../api/AuthProvider';

export const SendOtpSlice = createAsyncThunk(
    'auth/SendOtpSlice',
    async (data: any, { rejectWithValue }) => {
      try {
        const responseData = await SendOtp(data);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );

export const VerifyOtpSlice = createAsyncThunk(
    'auth/SendOtpSlice',
    async (data: any, { rejectWithValue }) => {
      try {
        const responseData = await VerifyOtp(data);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    error: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SendOtpSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SendOtpSlice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(SendOtpSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
      });
  },
});

export default authSlice.reducer;