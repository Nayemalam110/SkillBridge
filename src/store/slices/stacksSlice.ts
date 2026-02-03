import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { stacksAPI, StacksListParams } from '@/api/stacks';
import { TechStack, PaginatedResponse } from '@/types';

interface StackPagination {
    page: number;
    page_size: number;
    // backend may return `total` or `total_count`
    total?: number;
    total_count?: number;
    total_pages: number;
}

export interface StacksState {
    items: TechStack[];
    currentStack: TechStack | null;
    pagination: StackPagination;
    loading: boolean;
    error: string | null;
}

const initialState: StacksState = {
    items: [],
    currentStack: null,
    pagination: { page: 1, page_size: 10, total: 0, total_count: 0, total_pages: 0 },
    loading: false,
    error: null,
};

// Async thunks
export const listStacks = createAsyncThunk(
    'stacks/list',
    async ({ params }: { params?: StacksListParams }, { rejectWithValue }) => {
        try {
            const response = await stacksAPI.list(params);
            if (response.success) {
                return response;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch stacks');
        }
    }
);

export const getStack = createAsyncThunk(
    'stacks/get',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await stacksAPI.get(id);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch stack');
        }
    }
);

export const createStack = createAsyncThunk(
    'stacks/create',
    async (data: Partial<TechStack>, { rejectWithValue }) => {
        try {
            const response = await stacksAPI.create(data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to create stack');
        }
    }
);

export const updateStack = createAsyncThunk(
    'stacks/update',
    async ({ id, data }: { id: number; data: Partial<TechStack> }, { rejectWithValue }) => {
        try {
            const response = await stacksAPI.update(id, data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update stack');
        }
    }
);

export const deleteStack = createAsyncThunk(
    'stacks/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await stacksAPI.delete(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to delete stack');
        }
    }
);

const stacksSlice = createSlice({
    name: 'stacks',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // List Stacks
        builder
            .addCase(listStacks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listStacks.fulfilled, (state, action: PayloadAction<{ data: TechStack[]; pagination: StackPagination; success: boolean }>) => {
                state.loading = false;
                state.items = action.payload.data || [];
                const p = action.payload.pagination || {};
                state.pagination = {
                    page: p.page ?? 1,
                    page_size: p.page_size ?? 10,
                    total: p.total ?? p.total_count ?? 0,
                    total_count: p.total_count ?? p.total ?? 0,
                    total_pages: p.total_pages ?? 0,
                };
                state.error = null;
            })
            .addCase(listStacks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch stacks';
            });

        // Get Stack
        builder
            .addCase(getStack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStack.fulfilled, (state, action: PayloadAction<TechStack>) => {
                state.loading = false;
                state.currentStack = action.payload;
                state.error = null;
            })
            .addCase(getStack.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch stack';
            });

        // Create Stack
        builder
            .addCase(createStack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStack.fulfilled, (state, action: PayloadAction<TechStack>) => {
                state.loading = false;
                state.items.push(action.payload);
                state.error = null;
            })
            .addCase(createStack.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create stack';
            });

        // Update Stack
        builder
            .addCase(updateStack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStack.fulfilled, (state, action: PayloadAction<TechStack>) => {
                state.loading = false;
                const index = state.items.findIndex((stack) => stack.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.currentStack = action.payload;
                state.error = null;
            })
            .addCase(updateStack.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update stack';
            });

        // Delete Stack
        builder
            .addCase(deleteStack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStack.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.items = state.items.filter((stack) => stack.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteStack.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete stack';
            });
    },
});

export const { clearError } = stacksSlice.actions;
export default stacksSlice.reducer;
