import apiClient from './client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'super_admin' | 'stack_admin' | 'job_seeker';
            avatar?: string;
            blockedBy?: string[];
        };
        accessToken: string;
        refreshToken: string;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface RegisterResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'job_seeker';
        };
        accessToken: string;
        refreshToken: string;
    };
}

export interface UserResponse {
    success: boolean;
    data: {
        id: string;
        email: string;
        name: string;
        role: 'super_admin' | 'stack_admin' | 'job_seeker';
        avatar?: string;
        blockedBy?: string[];
        createdAt: string;
    };
}

export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    avatar?: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    data: UserResponse['data'];
}

export const authAPI = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/login', { email, password });
        // Handle both token formats: { tokens: { access, refresh } } or { accessToken, refreshToken }
        let accessToken = response.data.data?.accessToken;
        let refreshToken = response.data.data?.refreshToken;

        if (!accessToken && response.data.data?.tokens) {
            accessToken = response.data.data.tokens.access;
            refreshToken = response.data.data.tokens.refresh;
        }

        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        }
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post('/auth/register', data);
        // Handle both token formats
        let accessToken = response.data.data?.accessToken;
        let refreshToken = response.data.data?.refreshToken;

        if (!accessToken && response.data.data?.tokens) {
            accessToken = response.data.data.tokens.access;
            refreshToken = response.data.data.tokens.refresh;
        }

        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        }
        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    },

    getCurrentUser: async (): Promise<UserResponse> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        // Handle both token formats
        let accessToken = response.data.data?.accessToken;
        let newRefreshToken = response.data.data?.refreshToken;

        if (!accessToken && response.data.data?.tokens) {
            accessToken = response.data.data.tokens.access;
            newRefreshToken = response.data.data.tokens.refresh;
        }

        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', newRefreshToken);
        }
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
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
};
