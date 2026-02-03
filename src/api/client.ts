import axios, { AxiosInstance, AxiosError } from 'axios';

// Create axios instance
const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                    // Handle both token formats: { tokens: { access, refresh } } or { accessToken, refreshToken }
                    let accessToken = response.data.data?.accessToken;
                    let newRefreshToken = response.data.data?.refreshToken;

                    if (!accessToken && response.data.data?.tokens) {
                        accessToken = response.data.data.tokens.access;
                        newRefreshToken = response.data.data.tokens.refresh;
                    }

                    if (accessToken) {
                        localStorage.setItem('access_token', accessToken);
                        localStorage.setItem('refresh_token', newRefreshToken);
                        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
