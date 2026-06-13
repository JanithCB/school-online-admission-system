import axios from 'axios';
import { Application, StatusSummary } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
  },
});

export const submitApplication = async (formData: FormData) => {
  const response = await api.post('/applications/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get('/applications/');
  return response.data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const response = await api.get(`/applications/${id}/`);
  return response.data;
};

export const updateApplicationStatus = async (id: string, status: string): Promise<Application> => {
  // We use PATCH to only update the status
  const response = await api.patch(`/applications/${id}/`, { status });
  return response.data;
};

export const getStatusSummary = async (): Promise<StatusSummary> => {
  const response = await api.get('/applications/status_summary/');
  return response.data;
};

export default api;
