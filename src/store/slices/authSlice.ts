import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '@/api/auth';
import { usersAPI } from '@/api/users';
import { User, UserProfile } from '@/types';

export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    tokens: { access: string; refresh: string } | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    profile: null,
    tokens: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(email, password);
            if (response.success) {
                // Normalize token formats: support { tokens: { access, refresh } } and { accessToken, refreshToken }
                const access = response.data?.accessToken ?? response.data?.tokens?.access ?? response.data?.access;
                const refresh = response.data?.refreshToken ?? response.data?.tokens?.refresh ?? response.data?.refresh;

                if (access) {
                    localStorage.setItem('access_token', access);
                    if (refresh) localStorage.setItem('refresh_token', refresh);
                }

                // Return unified payload expected by reducers
                return {
                    user: response.data.user,
                    tokens: { access: access || '', refresh: refresh || '' },
                };
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (
        data: {
            email: string;
            username: string;
            first_name: string;
            last_name: string;
            password: string;
            password_confirm: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await authAPI.register(data);
            if (response.success) {
                const access = response.data?.accessToken ?? response.data?.tokens?.access ?? response.data?.access;
                const refresh = response.data?.refreshToken ?? response.data?.tokens?.refresh ?? response.data?.refresh;

                if (access) {
                    localStorage.setItem('access_token', access);
                    if (refresh) localStorage.setItem('refresh_token', refresh);
                }

                return {
                    user: response.data.user,
                    tokens: { access: access || '', refresh: refresh || '' },
                };
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
    try {
        const response = await authAPI.getCurrentUser();
        if (response.success) {
            return response.data;
        }
        return rejectWithValue(response);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch user');
    }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await usersAPI.getProfile();
        if (response.success) {
            return response.data;
        }
        return rejectWithValue(response);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
});

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: Partial<UserProfile>, { rejectWithValue }) => {
        try {
            const response = await authAPI.updateProfile(data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update profile');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        // attempt backend logout, but do not fail the whole action if backend returns an error
        await authAPI.logout();
    } catch (error) {
        // swallow backend logout errors - we'll clear local tokens anyway
        /* eslint-disable no-console */
        console.warn('Backend logout failed, clearing local tokens', error);
    }
    // always clear local tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setTokens: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
            state.tokens = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('access_token', action.payload.access);
            localStorage.setItem('refresh_token', action.payload.refresh);
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: any) => {
                state.loading = false;
                state.user = action.payload.user;
                state.tokens = action.payload.tokens;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: any) => {
                state.loading = false;
                state.user = action.payload.user;
                state.tokens = action.payload.tokens;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(register.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
                state.isAuthenticated = false;
            });

        // Get Me
        builder
            .addCase(getMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action: any) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(getMe.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch user';
                state.isAuthenticated = false;
            });

        // Get Profile
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action: any) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch profile';
            });

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: any) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update profile';
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.profile = null;
                state.tokens = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Logout failed';
            });
    },
});

export const { clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
