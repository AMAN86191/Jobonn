import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfileData } from '../api/UserProvider';

// Initial state
interface UserState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: any | null;
  message: string | null;
  userInfo: any;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  userInfo: {},
};

// Async Thunks getUserProfileSlice
export const getUserProfileSlice = createAsyncThunk(
  'user/getUserProfileSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfileData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);


// USER SLICE

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {},
});

export const { } = userSlice.actions;
export default userSlice.reducer;
