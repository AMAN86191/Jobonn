import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  SendOtp, VerifyOtp, SetPassword, CompleteRegistration, LoginUser, LogoutUser, UpdateCompanyProfile,
  SendOtpCandidate, VerifyOtpCandidate, SetPasswordCandidate, CompleteRegistrationCandidate,
  ForgotPasswordSendOtp, ForgotPasswordVerifyOtp, ForgotPasswordResetPassword
} from '../api/AuthProvider';

export const SendOtpCandidateSlice = createAsyncThunk(
  'auth/SendOtpCandidateSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const responseData = await SendOtpCandidate(data);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const VerifyOtpCandidateSlice = createAsyncThunk(
  'auth/VerifyOtpCandidateSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const responseData = await VerifyOtpCandidate(data);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const SetPasswordCandidateSlice = createAsyncThunk(
  'auth/SetPasswordCandidateSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const responseData = await SetPasswordCandidate(data);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const CompleteRegistrationCandidateSlice = createAsyncThunk(
  'auth/CompleteRegistrationCandidateSlice',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const responseData = await CompleteRegistrationCandidate(formData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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
    'auth/VerifyOtpSlice',
    async (data: any, { rejectWithValue }) => {
      try {
        const responseData = await VerifyOtp(data);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );

export const SetPasswordSlice = createAsyncThunk(
    'auth/SetPasswordSlice',
    async (data: any, { rejectWithValue }) => {
      try {
        const responseData = await SetPassword(data);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );

export const CompleteRegistrationSlice = createAsyncThunk(
    'auth/CompleteRegistrationSlice',
    async (formData: FormData, { rejectWithValue }) => {
      try {
        const responseData = await CompleteRegistration(formData);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );
export const UpdateCompanyProfileSlice = createAsyncThunk(
    'auth/UpdateCompanyProfile',
    async (formData: FormData, { rejectWithValue }) => {
      try {
        const responseData = await UpdateCompanyProfile(formData);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );

export const LoginSlice = createAsyncThunk(
    'auth/LoginSlice',
    async (data: any, { rejectWithValue }) => {
      try {
        const responseData = await LoginUser(data);
        return responseData;
      } catch (error) {
        return rejectWithValue(error);
      }
    },
  );

export const LogoutSlice = createAsyncThunk(
  'auth/LogoutSlice',
  async (_, { rejectWithValue }) => {
    try {
      const responseData = await LogoutUser();
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const ForgotPasswordSendOtpSlice = createAsyncThunk(
  'auth/ForgotPasswordSendOtpSlice',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const responseData = await ForgotPasswordSendOtp(payload);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const ForgotPasswordVerifyOtpSlice = createAsyncThunk(
  'auth/ForgotPasswordVerifyOtpSlice',
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const responseData = await ForgotPasswordVerifyOtp(payload);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const ForgotPasswordResetPasswordSlice = createAsyncThunk(
  'auth/ForgotPasswordResetPasswordSlice',
  async (
    payload: { email: string; new_password: string; confirm_password: string },
    { rejectWithValue }
  ) => {
    try {
      const responseData = await ForgotPasswordResetPassword(payload);
      return responseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
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