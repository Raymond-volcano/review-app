const API_BASE = '/api/store';

export async function fetchStore(storeId) {
  const res = await fetch(`${API_BASE}/${storeId}`);
  if (!res.ok) throw new Error('店铺不存在');
  return res.json();
}

export async function logEvent(storeId, completed = false) {
  await fetch(`${API_BASE}/${storeId}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
}

// Get store ID from URL params
export function getStoreId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('store') || 'demo001';
}
