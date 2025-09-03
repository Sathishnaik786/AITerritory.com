import api, { fetchWithRetry } from './api';

export interface AppleCarouselCard {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  button_text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function fetchAppleCarouselCards(): Promise<AppleCarouselCard[]> {
  try {
    const response = await fetchWithRetry<AppleCarouselCard[]>('/apple-carousel');
    return response;
  } catch (error) {
    console.error('Failed to fetch apple carousel cards:', error);
    throw new Error('Failed to fetch apple carousel cards. Please try again later.');
  }
}