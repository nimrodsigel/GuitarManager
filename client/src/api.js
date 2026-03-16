const BASE_URL = '/api';

function authHeaders(extra = {}) {
  const user = JSON.parse(localStorage.getItem('gm_user') || 'null');
  return { ...extra, ...(user ? { 'X-User-Id': String(user.id) } : {}) };
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  if (res.status === 401) {
    localStorage.removeItem('gm_user');
    window.location.href = '/login';
    return {};
  }
  return res.json();
}

export const getGuitars = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`${BASE_URL}/guitars${qs ? '?' + qs : ''}`, { headers: authHeaders() });
};
export const getSummary = () => apiFetch(`${BASE_URL}/guitars/summary`, { headers: authHeaders() });
export const getGuitar = (id) => apiFetch(`${BASE_URL}/guitars/${id}`, { headers: authHeaders() });
export const createGuitar = (data) => apiFetch(`${BASE_URL}/guitars`, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
export const updateGuitar = (id, data) => apiFetch(`${BASE_URL}/guitars/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
export const deleteGuitar = (id) => apiFetch(`${BASE_URL}/guitars/${id}`, { method: 'DELETE', headers: authHeaders() });

export const uploadPhotos = (guitarId, files) => {
  const form = new FormData();
  files.forEach(f => form.append('photos', f));
  return apiFetch(`${BASE_URL}/guitars/${guitarId}/photos`, { method: 'POST', headers: authHeaders(), body: form });
};
export const deletePhoto = (id) => apiFetch(`${BASE_URL}/photos/${id}`, { method: 'DELETE', headers: authHeaders() });
export const setCoverPhoto = (id) => apiFetch(`${BASE_URL}/photos/${id}/cover`, { method: 'PATCH', headers: authHeaders() });

export const getWishlist = () => apiFetch(`${BASE_URL}/wishlist`, { headers: authHeaders() });
export const createWishlistItem = (data) => apiFetch(`${BASE_URL}/wishlist`, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
export const updateWishlistItem = (id, data) => apiFetch(`${BASE_URL}/wishlist/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
export const deleteWishlistItem = (id) => apiFetch(`${BASE_URL}/wishlist/${id}`, { method: 'DELETE', headers: authHeaders() });

// ─── Sharing ──────────────────────────────────────────────────────────────────
export const getShares = () => apiFetch(`${BASE_URL}/shares`, { headers: authHeaders() });
export const createShare = (name) => apiFetch(`${BASE_URL}/shares`, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ name }) });
export const revokeShare = (id) => apiFetch(`${BASE_URL}/shares/${id}/revoke`, { method: 'PATCH', headers: authHeaders() });
export const getOffers = (status) => apiFetch(`${BASE_URL}/offers${status && status !== 'all' ? '?status=' + status : ''}`, { headers: authHeaders() });
export const getPendingOffersCount = () => apiFetch(`${BASE_URL}/offers/count`, { headers: authHeaders() });
export const updateOfferStatus = (id, status) => apiFetch(`${BASE_URL}/offers/${id}`, { method: 'PATCH', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ status }) });

// ─── Public shared (no auth) ──────────────────────────────────────────────────
export async function getSharedCollection(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/shared/${token}${qs ? '?' + qs : ''}`);
  return res.json();
}
export async function getSharedGuitar(token, id) {
  const res = await fetch(`${BASE_URL}/shared/${token}/guitars/${id}`);
  return res.json();
}
export async function submitOffer(token, data) {
  const res = await fetch(`${BASE_URL}/shared/${token}/offers`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}
