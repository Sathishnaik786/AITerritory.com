import { supabase } from './supabaseClient';

export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
}

export const NewsletterService = {
  /**
   * Subscribe a user to the newsletter
   */
  async subscribe(email: string): Promise<NewsletterSubscription> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { 
          email: email,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (user already subscribed)
      if (error.code === '23505') {
        throw new Error('ALREADY_SUBSCRIBED');
      }
      throw error;
    }

    return data;
  },

  /**
   * Check if a user is already subscribed
   */
  async isSubscribed(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  },

  /**
   * Get all newsletter subscribers (admin only)
   */
  async getAllSubscribers(): Promise<NewsletterSubscription[]> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  /**
   * Unsubscribe a user from the newsletter
   */
  async unsubscribe(email: string): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email);

    if (error) {
      throw error;
    }
  }
}; 