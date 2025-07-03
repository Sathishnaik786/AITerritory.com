export async function repurposeContent(input: string, formats: string[]) {
  return fetch('/api/repurpose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, formats }),
  }).then(res => res.json());
} 