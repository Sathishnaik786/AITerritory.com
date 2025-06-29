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

// Form submission interfaces (for POST requests)
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AdvertiseFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface ToolFormData {
  name: string;
  email: string;
  tool_name: string;
  tool_url: string;
  description?: string;
}

export interface FeatureRequestFormData {
  name: string;
  email: string;
  feature: string;
  details?: string;
}

// GET methods for admin viewing
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

// POST methods for form submissions
export const submitContactForm = async (data: ContactFormData): Promise<{ success: boolean; message: string; data: ContactSubmission }> => {
  const response = await api.post('/submissions/contact', data);
  return response.data;
};

export const submitAdvertiseForm = async (data: AdvertiseFormData): Promise<{ success: boolean; message: string; data: AdvertiseSubmission }> => {
  const response = await api.post('/submissions/advertise', data);
  return response.data;
};

export const submitToolForm = async (data: ToolFormData): Promise<{ success: boolean; message: string; data: ToolSubmission }> => {
  const response = await api.post('/submissions/tools', data);
  return response.data;
};

export const submitFeatureRequestForm = async (data: FeatureRequestFormData): Promise<{ success: boolean; message: string; data: FeatureRequest }> => {
  const response = await api.post('/submissions/features', data);
  return response.data;
}; 