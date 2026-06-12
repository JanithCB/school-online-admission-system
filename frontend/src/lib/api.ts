import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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

export const getApplications = async () => {
  const response = await api.get('/applications/');
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get('/applications/summary/');
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string) => {
  const response = await api.patch(`/applications/${id}/`, { status });
  return response.data;
};

export const deleteApplication = async (id: number) => {
  const response = await api.delete(`/applications/${id}/`);
  return response.data;
};
