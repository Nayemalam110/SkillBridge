import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stacksReducer from './slices/stacksSlice';
import jobsReducer from './slices/jobsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stacks: stacksReducer,
        jobs: jobsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
