import api from './api';

// Generic interface for common submission fields
export interface Submission {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ContactSubmission extends Submission {
  message: string;
}

export interface AdvertiseSubmission extends Submission {
  company: string | null;
  message: string;
}

export interface ToolSubmission extends Submission {
  tool_name: string;
  tool_url: string;
  description: string | null;
}

export interface FeatureRequest extends Submission {
  feature: string;
  details: string | null;
}

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const response = await api.get('/submissions/contact');
  return response.data;
};

export const getAdvertiseSubmissions = async (): Promise<AdvertiseSubmission[]> => {
  const response = await api.get('/submissions/advertise');
  return response.data;
};

export const getToolSubmissions = async (): Promise<ToolSubmission[]> => {
  const response = await api.get('/submissions/tools');
  return response.data;
};

export const getFeatureRequests = async (): Promise<FeatureRequest[]> => {
  const response = await api.get('/submissions/features');
  return response.data;
}; 