import apiClient from './client';

export interface Job {
    id: string;
    title: string;
    description: string;
    stackId: string;
    stack?: {
        id: string;
        name: string;
    };
    location: string;
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
    jobType: 'full_time' | 'part_time' | 'contract' | 'freelance';
    experienceLevel: 'entry' | 'mid' | 'senior';
    requirements: string[];
    benefits: string[];
    status: 'draft' | 'published' | 'closed';
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface JobsListResponse {
    success: boolean;
    data: Job[];
    meta?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        pageSize: number;
    };
}

export interface JobDetailResponse {
    success: boolean;
    data: Job;
}

export interface JobsListParams {
    page?: number;
    limit?: number;
    search?: string;
    stackId?: string;
    jobType?: string;
    experienceLevel?: string;
    location?: string;
    status?: string;
}

export const jobsAPI = {
    list: async (params?: JobsListParams): Promise<JobsListResponse> => {
        const response = await apiClient.get('/jobs', { params });
        return response.data;
    },

    get: async (id: string): Promise<JobDetailResponse> => {
        const response = await apiClient.get(`/jobs/${id}`);
        return response.data;
    },

    create: async (data: Partial<Job>): Promise<JobDetailResponse> => {
        const response = await apiClient.post('/jobs', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Job>): Promise<JobDetailResponse> => {
        const response = await apiClient.put(`/jobs/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(`/jobs/${id}`);
        return response.data;
    },
};
