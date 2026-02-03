import apiClient from './client';

export interface Application {
    id: string;
    jobId: string;
    job?: {
        id: string;
        title: string;
        stackId: string;
    };
    userId: string;
    status: 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'selected' | 'hired';
    coverLetter: string;
    rating?: number;
    cvUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApplicationsListResponse {
    success: boolean;
    data: Application[];
    meta?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        pageSize: number;
    };
}

export interface ApplicationDetailResponse {
    success: boolean;
    data: Application;
}

export interface SubmitApplicationRequest {
    jobId: string;
    coverLetter: string;
    cv?: File;
}

export interface UpdateApplicationStatusRequest {
    status: 'reviewing' | 'shortlisted' | 'rejected' | 'selected' | 'hired';
}

export interface RateApplicationRequest {
    rating: number; // 1-5
}

export interface ApplicationsListParams {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    userId?: string;
}

export const applicationsAPI = {
    list: async (params?: ApplicationsListParams): Promise<ApplicationsListResponse> => {
        const response = await apiClient.get('/applications', { params });
        return response.data;
    },

    get: async (id: string): Promise<ApplicationDetailResponse> => {
        const response = await apiClient.get(`/applications/${id}`);
        return response.data;
    },

    submit: async (data: SubmitApplicationRequest): Promise<ApplicationDetailResponse> => {
        const formData = new FormData();
        formData.append('jobId', data.jobId);
        formData.append('coverLetter', data.coverLetter);
        if (data.cv) {
            formData.append('cv', data.cv);
        }

        const response = await apiClient.post('/applications', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<ApplicationDetailResponse> => {
        const response = await apiClient.patch(`/applications/${id}/status`, { status });
        return response.data;
    },

    rateApplication: async (id: string, rating: number): Promise<ApplicationDetailResponse> => {
        const response = await apiClient.patch(`/applications/${id}/rating`, { rating });
        return response.data;
    },

    exportCSV: async (params?: ApplicationsListParams): Promise<Blob> => {
        const response = await apiClient.get('/applications/export/csv', {
            params,
            responseType: 'blob',
        });
        return response.data;
    },

    exportExcel: async (params?: ApplicationsListParams): Promise<Blob> => {
        const response = await apiClient.get('/applications/export/excel', {
            params,
            responseType: 'blob',
        });
        return response.data;
    },
};
