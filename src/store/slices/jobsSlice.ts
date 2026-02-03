import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI, JobsListParams } from '@/api/jobs';
import { Job } from '@/types';

export interface JobsState {
    items: Job[];
    currentJob: Job | null;
    pagination: {
        page: number;
        page_size: number;
        total_count: number;
        total_pages: number;
    };
    loading: boolean;
    error: string | null;
}

const initialState: JobsState = {
    items: [],
    currentJob: null,
    pagination: { page: 1, page_size: 10, total_count: 0, total_pages: 0 },
    loading: false,
    error: null,
};

// Async thunks
export const listJobs = createAsyncThunk(
    'jobs/list',
    async (params: JobsListParams | undefined, thunkAPI) => {
        try {
            const response = await jobsAPI.list(params);
            if (response.success) {
                return response;
            }
            return thunkAPI.rejectWithValue(response);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch jobs');
        }
    }
);

export const getJob = createAsyncThunk(
    'jobs/get',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.get(id);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch job');
        }
    }
);

export const createJob = createAsyncThunk(
    'jobs/create',
    async (data: Partial<Job>, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.create(data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to create job');
        }
    }
);

export const updateJob = createAsyncThunk(
    'jobs/update',
    async ({ id, data }: { id: number; data: Partial<Job> }, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.update(id, data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update job');
        }
    }
);

export const deleteJob = createAsyncThunk(
    'jobs/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.delete(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to delete job');
        }
    }
);

export const publishJob = createAsyncThunk(
    'jobs/publish',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.publish(id);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to publish job');
        }
    }
);

export const closeJob = createAsyncThunk(
    'jobs/close',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.close(id);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to close job');
        }
    }
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // List Jobs
        builder
            .addCase(listJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listJobs.fulfilled, (state, action: any) => {
                state.loading = false;
                state.items = action.payload.data || [];
                state.pagination = action.payload.pagination || {};
                state.error = null;
            })
            .addCase(listJobs.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch jobs';
            });

        // Get Job
        builder
            .addCase(getJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJob.fulfilled, (state, action: any) => {
                state.loading = false;
                state.currentJob = action.payload;
                state.error = null;
            })
            .addCase(getJob.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch job';
            });

        // Create Job
        builder
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action: any) => {
                state.loading = false;
                state.items.push(action.payload);
                state.error = null;
            })
            .addCase(createJob.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create job';
            });

        // Update Job
        builder
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action: any) => {
                state.loading = false;
                const index = state.items.findIndex((job) => job.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.currentJob = action.payload;
                state.error = null;
            })
            .addCase(updateJob.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update job';
            });

        // Delete Job
        builder
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action: any) => {
                state.loading = false;
                state.items = state.items.filter((job) => job.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteJob.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete job';
            });

        // Publish Job
        builder
            .addCase(publishJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(publishJob.fulfilled, (state, action: any) => {
                state.loading = false;
                const index = state.items.findIndex((job) => job.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.currentJob = action.payload;
                state.error = null;
            })
            .addCase(publishJob.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to publish job';
            });

        // Close Job
        builder
            .addCase(closeJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(closeJob.fulfilled, (state, action: any) => {
                state.loading = false;
                const index = state.items.findIndex((job) => job.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.currentJob = action.payload;
                state.error = null;
            })
            .addCase(closeJob.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to close job';
            });
    },
});

export const { clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
