import apiClient from './client';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'stack_admin' | 'job_seeker';
    avatar?: string;
    skills?: string[];
    experience?: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
    blockedBy?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UserProfileResponse {
    success: boolean;
    data: UserProfile;
}

export interface UpdateProfileRequest {
    name?: string;
    avatar?: string;
    skills?: string[];
    experience?: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
}

export interface BlockUserRequest {
    userId: string;
}

export interface BlockedUsersResponse {
    success: boolean;
    data: UserProfile[];
}

export const usersAPI = {
    getProfile: async (): Promise<UserProfileResponse> => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
        const response = await apiClient.put('/users/profile', data);
        return response.data;
    },

    uploadCV: async (file: File): Promise<{ success: boolean; data: { cvUrl: string } }> => {
        const formData = new FormData();
        formData.append('cv', file);
        const response = await apiClient.post('/users/cv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    blockUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.post('/users/block', { userId });
        return response.data;
    },

    unblockUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.post('/users/unblock', { userId });
        return response.data;
    },

    getBlockedUsers: async (): Promise<BlockedUsersResponse> => {
        const response = await apiClient.get('/users/blocked');
        return response.data;
    },
};
