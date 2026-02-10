import apiClient from './client';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    headline?: string;
    bio?: string;
    skills: string[];
    experience?: string;
    portfolio?: string;
    linkedin?: string;
    github?: string;
    cvUrl?: string;
    isBlocked: boolean;
    createdAt: string;
}

export const usersAPI = {
    list: async (params?: { role?: string; search?: string }): Promise<{ success: boolean; data: UserProfile[] }> => {
        const response = await apiClient.get('/users', { params });
        return response.data;
    },

    block: async (userId: string, reason?: string) => {
        const response = await apiClient.post(`/users/${userId}/block`, { reason });
        return response.data;
    },

    unblock: async (userId: string) => {
        const response = await apiClient.post(`/users/${userId}/unblock`);
        return response.data;
    }
};
