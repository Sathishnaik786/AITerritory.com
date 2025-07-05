const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface Feedback {
  id: string;
  type: string;
  message: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Get all feedback
export const getFeedback = async (): Promise<Feedback[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

// Get single feedback by ID
export const getFeedbackById = async (id: string): Promise<Feedback> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching feedback by ID:', error);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

// Update feedback
export const updateFeedback = async (id: string, data: Partial<Feedback>): Promise<Feedback> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
}; 