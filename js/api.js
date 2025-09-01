const API_BASE = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

export async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  Object.assign(headers, authHeaders());
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    let json;
    try { json = JSON.parse(text); } catch(e) { json = null; }
    throw { status: res.status, body: json || text };
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res;
}
