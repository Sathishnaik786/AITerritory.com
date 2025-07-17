import { useEffect, useState } from 'react';
import { fetchAppleCarouselCards } from '../services/appleCarouselService';

export function useAppleCarouselCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppleCarouselCards()
      .then(setCards)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { cards, loading, error };
} 