import api from './api';

export async function getReviewsForUser(user_id: string) {
  const res = await api.get('/reviews', { params: { user_id } });
  return res.data.reviews;
} 