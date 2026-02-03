import apiClient from './client';

export interface SiteSettings {
    id: string;
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    phoneNumber?: string;
    address?: string;
    maxApplicationsPerUser: number;
    applicationReviewPeriodDays: number;
    taskSubmissionDeadlineDays: number;
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SettingsResponse {
    success: boolean;
    data: SiteSettings;
}

export interface UpdateSettingsRequest {
    siteName?: string;
    siteDescription?: string;
    contactEmail?: string;
    supportEmail?: string;
    phoneNumber?: string;
    address?: string;
    maxApplicationsPerUser?: number;
    applicationReviewPeriodDays?: number;
    taskSubmissionDeadlineDays?: number;
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
}

export const settingsAPI = {
    get: async (): Promise<SettingsResponse> => {
        const response = await apiClient.get('/settings');
        return response.data;
    },

    update: async (data: UpdateSettingsRequest): Promise<SettingsResponse> => {
        const response = await apiClient.patch('/settings', data);
        return response.data;
    },
};
