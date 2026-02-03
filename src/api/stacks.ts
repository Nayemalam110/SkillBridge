import apiClient from './client';

export interface TechStack {
    id: string;
    name: string;
    description: string;
    icon?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StacksListResponse {
    success: boolean;
    data: TechStack[];
    meta?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        pageSize: number;
    };
}

export interface StackDetailResponse {
    success: boolean;
    data: TechStack;
}

export interface StacksListParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

export const stacksAPI = {
    list: async (params?: StacksListParams): Promise<StacksListResponse> => {
        const response = await apiClient.get('/stacks', { params });
        return response.data;
    },

    get: async (id: string): Promise<StackDetailResponse> => {
        const response = await apiClient.get(`/stacks/${id}`);
        return response.data;
    },

    create: async (data: Partial<TechStack>): Promise<StackDetailResponse> => {
        const response = await apiClient.post('/stacks', data);
        return response.data;
    },

    update: async (id: string, data: Partial<TechStack>): Promise<StackDetailResponse> => {
        const response = await apiClient.put(`/stacks/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(`/stacks/${id}`);
        return response.data;
    },
};
