import { configureStore } from '@reduxjs/toolkit';
import auth from './AuthSlice';
import companyHome from './CompanyHomeSlice';
import candidateProfile from './CandidateProfileSlice';

export const store = configureStore({
  reducer: {
    auth: auth,
    companyHome: companyHome,
    candidateProfile: candidateProfile,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
