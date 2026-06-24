import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  savePersonalDetails,
  saveProfessionalInfo,
  saveCareerPreferences,
  saveEducation,
  saveDocuments,
  getProfile,
  updateProfile,
} from '../api/CandidateProfileProvider';

interface CandidateProfileState {
  loading: boolean;
  error: any | null;
  message: string | null;
  profileData: any | null;
}

const initialState: CandidateProfileState = {
  loading: false,
  error: null,
  message: null,
  profileData: null,
};

// Async Thunks
export const savePersonalDetailsSlice = createAsyncThunk(
  'candidateProfile/savePersonalDetails',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await savePersonalDetails(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveProfessionalInfoSlice = createAsyncThunk(
  'candidateProfile/saveProfessionalInfo',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await saveProfessionalInfo(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveCareerPreferencesSlice = createAsyncThunk(
  'candidateProfile/saveCareerPreferences',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await saveCareerPreferences(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveEducationSlice = createAsyncThunk(
  'candidateProfile/saveEducation',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await saveEducation(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveDocumentsSlice = createAsyncThunk(
  'candidateProfile/saveDocuments',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await saveDocuments(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProfileSlice = createAsyncThunk(
  'candidateProfile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfileSlice = createAsyncThunk(
  'candidateProfile/updateProfile',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await updateProfile(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice Definition
const candidateProfileSlice = createSlice({
  name: 'candidateProfile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Personal Details
      .addCase(savePersonalDetailsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePersonalDetailsSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload };
        state.message = action.payload?.message || 'Personal details saved successfully';
      })
      .addCase(savePersonalDetailsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save personal details';
      })
      
      // Professional Info
      .addCase(saveProfessionalInfoSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProfessionalInfoSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload };
        state.message = action.payload?.message || 'Professional info saved successfully';
      })
      .addCase(saveProfessionalInfoSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save professional info';
      })

      // Career Preferences
      .addCase(saveCareerPreferencesSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCareerPreferencesSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload };
        state.message = action.payload?.message || 'Career preferences saved successfully';
      })
      .addCase(saveCareerPreferencesSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save career preferences';
      })

      // Education
      .addCase(saveEducationSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEducationSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload };
        state.message = action.payload?.message || 'Education saved successfully';
      })
      .addCase(saveEducationSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save education';
      })

      // Documents
      .addCase(saveDocumentsSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDocumentsSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload };
        state.message = action.payload?.message || 'Documents uploaded successfully';
      })
      .addCase(saveDocumentsSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload documents';
      })

      // Get Profile
      .addCase(getProfileSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload?.candidate || action.payload;
        state.message = action.payload?.message || 'Profile retrieved successfully';
      })
      .addCase(getProfileSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to retrieve profile';
      })

      // Update Profile
      .addCase(updateProfileSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload?.candidate || action.payload };
        state.message = action.payload?.message || 'Profile updated successfully';
      })
      .addCase(updateProfileSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

export const { clearProfileError } = candidateProfileSlice.actions;
export default candidateProfileSlice.reducer;
