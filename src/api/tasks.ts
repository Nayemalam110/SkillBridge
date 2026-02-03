import apiClient from './client';

export interface Task {
    id: string;
    applicationId: string;
    title: string;
    description: string;
    instructions?: string;
    submissionUrl?: string;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface TaskDetailResponse {
    success: boolean;
    data: Task;
}

export interface AssignTaskRequest {
    title: string;
    description: string;
    instructions?: string;
}

export interface SubmitTaskRequest {
    submissionUrl: string;
    submissionFile?: File;
}

export interface ReviewTaskRequest {
    status: 'approved' | 'rejected' | 'passed' | 'failed'; // passed/failed are user-friendly aliases
}

export const tasksAPI = {
    get: async (taskId: string): Promise<TaskDetailResponse> => {
        const response = await apiClient.get(`/tasks/${taskId}`);
        return response.data;
    },

    assign: async (applicationId: string, data: AssignTaskRequest): Promise<TaskDetailResponse> => {
        const response = await apiClient.post(`/tasks/${applicationId}/task`, data);
        return response.data;
    },

    submit: async (taskId: string, data: SubmitTaskRequest): Promise<TaskDetailResponse> => {
        const formData = new FormData();
        formData.append('submissionUrl', data.submissionUrl);
        if (data.submissionFile) {
            formData.append('submissionFile', data.submissionFile);
        }

        const response = await apiClient.post(`/tasks/${taskId}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    review: async (taskId: string, status: string): Promise<TaskDetailResponse> => {
        const response = await apiClient.patch(`/tasks/${taskId}/review`, { status });
        return response.data;
    },
};
