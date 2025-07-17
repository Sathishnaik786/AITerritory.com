export async function fetchAppleCarouselCards() {
  const res = await fetch('/api/apple-carousel');
  if (!res.ok) throw new Error('Failed to fetch cards');
  return res.json();
} 