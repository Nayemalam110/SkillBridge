import apiClient from './client';

export interface DashboardStats {
    totalApplications: number;
    totalJobs: number;
    totalStacks: number;
    applicationsThisMonth: number;
}

export interface AdminDashboardData {
    stats: DashboardStats & {
        totalUsers: number;
        pendingApplications: number;
        totalAdmins: number;
    };
    recentApplications: Array<{
        id: string;
        jobTitle: string;
        userName: string;
        status: string;
        createdAt: string;
    }>;
    jobStats: Array<{
        jobId: string;
        jobTitle: string;
        applicationCount: number;
        status: string;
    }>;
}

export interface SeekerDashboardData {
    stats: {
        totalApplications: number;
        acceptedApplications: number;
        rejectedApplications: number;
        pendingApplications: number;
    };
    applications: Array<{
        id: string;
        jobTitle: string;
        stackName: string;
        status: string;
        createdAt: string;
    }>;
    recommendedJobs: Array<{
        id: string;
        title: string;
        stackName: string;
        location: string;
    }>;
}

export interface DashboardResponse<T> {
    success: boolean;
    data: T;
}

export const dashboardAPI = {
    getSeekerDashboard: async (): Promise<DashboardResponse<SeekerDashboardData>> => {
        const response = await apiClient.get('/dashboard/seeker');
        return response.data;
    },

    getAdminDashboard: async (): Promise<DashboardResponse<AdminDashboardData>> => {
        const response = await apiClient.get('/dashboard/admin');
        return response.data;
    },
};
