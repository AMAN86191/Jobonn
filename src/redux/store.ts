import { configureStore } from '@reduxjs/toolkit';
import auth from './AuthSlice';
import companyHome from './CompanyHomeSlice';

export const store = configureStore({
  reducer: {
    auth: auth,
    companyHome: companyHome,
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
