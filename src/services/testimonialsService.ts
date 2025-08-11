import api, { fetchWithRetry } from './api';

export interface Testimonial {
  id: string;
  user_name: string;
  user_role: string;
  user_avatar?: string;
  content: string;
  rating?: number;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface TestimonialSubmission {
  user_id?: string;
  user_name: string;
  user_role?: string;
  user_avatar?: string;
  content: string;
  rating?: number;
  company_name?: string;
  email?: string;
}

export const testimonialsService = {
  /**
   * Get all approved testimonials
   * @returns {Promise<Testimonial[]>} List of approved testimonials
   */
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const response = await fetchWithRetry<Testimonial[]>('/testimonials');
      return response;
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      // Return empty array as fallback
      return [];
    }
  },

  /**
   * Submit a new testimonial
   * @param {TestimonialSubmission} testimonialData - The testimonial data to submit
   * @returns {Promise<Testimonial>} The created testimonial
   */
  async submitTestimonial(testimonialData: TestimonialSubmission): Promise<Testimonial> {
    try {
      const response = await fetchWithRetry<Testimonial>('/testimonials', {
        method: 'POST',
        data: testimonialData,
      });
      return response;
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      throw new Error('Failed to submit testimonial. Please try again later.');
    }
  },

  /**
   * Approve a testimonial (admin only)
   * @param {string} id - The ID of the testimonial to approve
   * @returns {Promise<Testimonial>} The approved testimonial
   */
  async approveTestimonial(id: string): Promise<Testimonial> {
    try {
      const response = await fetchWithRetry<Testimonial>(`/testimonials/${id}/approve`, {
        method: 'PATCH',
      });
      return response;
    } catch (error) {
      console.error(`Failed to approve testimonial ${id}:`, error);
      throw new Error('Failed to approve testimonial. Please try again later.');
    }
  },

  /**
   * Get all pending testimonials (admin only)
   * @returns {Promise<Testimonial[]>} List of pending testimonials
   */
  async getPendingTestimonials(): Promise<Testimonial[]> {
    try {
      const response = await fetchWithRetry<Testimonial[]>('/testimonials/pending');
      return response;
    } catch (error) {
      console.error('Failed to fetch pending testimonials:', error);
      return [];
    }
  }
};

export default testimonialsService;