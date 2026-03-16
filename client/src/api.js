const BASE_URL = '/api';

function authHeaders(extra = {}) {
  const user = JSON.parse(localStorage.getItem('gm_user') || 'null');
  return { ...extra, ...(user ? { 'X-User-Id': String(user.id) } : {}) };
}

export async function getGuitars(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/guitars${qs ? '?' + qs : ''}`, { headers: authHeaders() });
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${BASE_URL}/guitars/summary`, { headers: authHeaders() });
  return res.json();
}

export async function getGuitar(id) {
  const res = await fetch(`${BASE_URL}/guitars/${id}`, { headers: authHeaders() });
  return res.json();
}

export async function createGuitar(data) {
  const res = await fetch(`${BASE_URL}/guitars`, {
    method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateGuitar(id, data) {
  const res = await fetch(`${BASE_URL}/guitars/${id}`, {
    method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteGuitar(id) {
  const res = await fetch(`${BASE_URL}/guitars/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.json();
}

export async function uploadPhotos(guitarId, files) {
  const form = new FormData();
  files.forEach(f => form.append('photos', f));
  const res = await fetch(`${BASE_URL}/guitars/${guitarId}/photos`, { method: 'POST', headers: authHeaders(), body: form });
  return res.json();
}

export async function deletePhoto(id) {
  const res = await fetch(`${BASE_URL}/photos/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.json();
}

export async function setCoverPhoto(id) {
  const res = await fetch(`${BASE_URL}/photos/${id}/cover`, { method: 'PATCH', headers: authHeaders() });
  return res.json();
}

export async function getWishlist() {
  const res = await fetch(`${BASE_URL}/wishlist`, { headers: authHeaders() });
  return res.json();
}

export async function createWishlistItem(data) {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateWishlistItem(id, data) {
  const res = await fetch(`${BASE_URL}/wishlist/${id}`, {
    method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteWishlistItem(id) {
  const res = await fetch(`${BASE_URL}/wishlist/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.json();
}

// ─── Sharing ──────────────────────────────────────────────────────────────────

export async function getShares() {
  const res = await fetch(`${BASE_URL}/shares`, { headers: authHeaders() });
  return res.json();
}

export async function createShare(name) {
  const res = await fetch(`${BASE_URL}/shares`, {
    method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function revokeShare(id) {
  const res = await fetch(`${BASE_URL}/shares/${id}/revoke`, { method: 'PATCH', headers: authHeaders() });
  return res.json();
}

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

export async function getOffers(status) {
  const qs = status && status !== 'all' ? `?status=${status}` : '';
  const res = await fetch(`${BASE_URL}/offers${qs}`, { headers: authHeaders() });
  return res.json();
}

export async function getPendingOffersCount() {
  const res = await fetch(`${BASE_URL}/offers/count`, { headers: authHeaders() });
  return res.json();
}

export async function updateOfferStatus(id, status) {
  const res = await fetch(`${BASE_URL}/offers/${id}`, {
    method: 'PATCH', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ status }),
  });
  return res.json();
}
