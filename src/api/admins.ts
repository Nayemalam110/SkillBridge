import apiClient from './client';

export interface Admin {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'stack_admin';
    stackIds?: string[];
    permissions?: string[];
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface AdminsListResponse {
    success: boolean;
    data: Admin[];
}

export interface AdminDetailResponse {
    success: boolean;
    data: Admin;
}

export interface InviteAdminRequest {
    email: string;
    role: 'super_admin' | 'stack_admin';
    stackIds?: string[];
}

export interface AcceptAdminInviteRequest {
    inviteToken: string;
    password: string;
    name: string;
}

export interface UpdateAdminPermissionsRequest {
    permissions: string[];
    stackIds?: string[];
}

export const adminsAPI = {
    list: async (): Promise<AdminsListResponse> => {
        const response = await apiClient.get('/admins');
        return response.data;
    },

    get: async (id: string): Promise<AdminDetailResponse> => {
        const response = await apiClient.get(`/admins/${id}`);
        return response.data;
    },

    invite: async (data: InviteAdminRequest): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.post('/admins/invite', data);
        return response.data;
    },

    acceptInvite: async (data: AcceptAdminInviteRequest): Promise<{ success: boolean; data: Admin; accessToken: string }> => {
        const response = await apiClient.post('/admins/accept-invite', data);
        return response.data;
    },

    updatePermissions: async (id: string, data: UpdateAdminPermissionsRequest): Promise<AdminDetailResponse> => {
        const response = await apiClient.patch(`/admins/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(`/admins/${id}`);
        return response.data;
    },

    cancelInvite: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.post(`/admins/${id}/cancel-invite`);
        return response.data;
    },
};
