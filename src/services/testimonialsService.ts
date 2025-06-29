import api from './api';

export interface Testimonial {
  id: string;
  user_name: string;
  user_role: string;
  user_avatar?: string;
  content: string;
  rating?: number;
  company_name?: string;
}

export interface TestimonialSubmission {
  user_id?: string;
  user_name: string;
  user_role?: string;
  user_avatar?: string;
  content: string;
  rating?: number;
  company_name?: string;
}

export const testimonialsService = {
  // Get all approved testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const response = await api.get('/testimonials');
    return response.data;
  },

  // Submit a new testimonial
  async submitTestimonial(testimonialData: TestimonialSubmission): Promise<Testimonial> {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  },

  // Approve a testimonial (admin only)
  async approveTestimonial(id: string): Promise<Testimonial> {
    const response = await api.patch(`/testimonials/${id}/approve`);
    return response.data;
  }
}; 