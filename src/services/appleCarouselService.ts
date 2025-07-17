const API_BASE = import.meta.env.VITE_API_BASE || "https://aiterritory-com.onrender.com";

export async function fetchAppleCarouselCards() {
  const res = await fetch(`${API_BASE}/api/apple-carousel`);
  const text = await res.text();
  console.log('API response:', text);
  if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status} - ${text}`);
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON: ' + text);
  }
} 