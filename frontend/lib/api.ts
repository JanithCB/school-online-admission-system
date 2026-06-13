import axios from 'axios';
import { Application, StatusSummary } from '@/types';

/**
 * Axios instance configured with the base API URL.
 * Falls back to localhost:8000 for local development if NEXT_PUBLIC_API_BASE_URL is not set.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Submits a new application.
 * @param formData FormData object containing text fields and file uploads.
 * @returns The created application data.
 */
export const submitApplication = async (formData: FormData) => {
  const response = await api.post('/applications/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fetches all submitted applications.
 * @returns Array of applications.
 */
export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get('/applications/');
  return response.data;
};

/**
 * Fetches a single application by its ID.
 * @param id The unique identifier of the application.
 * @returns Application object.
 */
export const getApplication = async (id: string): Promise<Application> => {
  const response = await api.get(`/applications/${id}/`);
  return response.data;
};

/**
 * Updates only the status of an application.
 * @param id The application ID.
 * @param status The new status (e.g., 'Processing', 'Accepted', 'Rejected').
 * @returns The updated application.
 */
export const updateApplicationStatus = async (id: string, status: string): Promise<Application> => {
  const response = await api.patch(`/applications/${id}/`, { status });
  return response.data;
};

/**
 * Performs a partial update on an application, allowing form fields and files to be updated.
 * @param id The application ID.
 * @param formData FormData object containing the fields to update.
 * @returns The updated application.
 */
export const updateApplication = async (id: string, formData: FormData): Promise<Application> => {
  const response = await api.patch(`/applications/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Deletes an application from the database.
 * @param id The application ID.
 */
export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}/`);
};

/**
 * Retrieves a summary of application statuses (count of Processing, Accepted, Rejected).
 * @returns An object containing the counts for each status.
 */
export const getStatusSummary = async (): Promise<StatusSummary> => {
  const response = await api.get('/applications/status_summary/');
  return response.data;
};

export default api;
