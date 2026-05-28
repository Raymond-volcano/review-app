const API_BASE = '/api/admin';
const AUTH_BASE = '/api/auth';

let _token = localStorage.getItem('admin_token');
let _storeId = localStorage.getItem('admin_storeId');

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + _token,
    'X-Store-Id': _storeId,
  };
}

export function isLoggedIn() {
  return !!_token && !!_storeId;
}

export function logout() {
  _token = null;
  _storeId = null;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_storeId');
}

export async function login(storeId, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '登录失败');
  }
  const data = await res.json();
  _token = password;
  _storeId = storeId;
  localStorage.setItem('admin_token', password);
  localStorage.setItem('admin_storeId', storeId);
  return data;
}

export async function getStore() {
  const res = await fetch(`${API_BASE}/store`, { headers: headers() });
  if (!res.ok) throw new Error('获取店铺信息失败');
  return res.json();
}

export async function updateStore(data) {
  const res = await fetch(`${API_BASE}/store`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getImages() {
  const res = await fetch(`${API_BASE}/images`, { headers: headers() });
  return res.json();
}

export async function uploadImage(file, label) {
  const formData = new FormData();
  formData.append('image', file);
  if (label) formData.append('label', label);
  const res = await fetch(`${API_BASE}/images`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + _token,
      'X-Store-Id': _storeId,
    },
    body: formData,
  });
  return res.json();
}

export async function deleteImage(id) {
  const res = await fetch(`${API_BASE}/images/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return res.json();
}

export async function sortImages(ids) {
  const res = await fetch(`${API_BASE}/images/sort`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ ids }),
  });
  return res.json();
}

export async function getCopies() {
  const res = await fetch(`${API_BASE}/copies`, { headers: headers() });
  return res.json();
}

export async function addCopy(content, style) {
  const res = await fetch(`${API_BASE}/copies`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ content, style }),
  });
  return res.json();
}

export async function updateCopy(id, content, style) {
  const res = await fetch(`${API_BASE}/copies/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ content, style }),
  });
  return res.json();
}

export async function deleteCopy(id) {
  const res = await fetch(`${API_BASE}/copies/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`, { headers: headers() });
  return res.json();
}

export async function getQRCode() {
  const res = await fetch(`${API_BASE}/qrcode`, { headers: headers() });
  return res.json();
}
