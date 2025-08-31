const STORAGE_KEY = 'idm.session.v1';
import { API_URL, API_AUTH_SOURCE } from '@/config';

function emitSession(session) {
  window.dispatchEvent(new CustomEvent('idm:session', { detail: { session } }));
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } 
  catch { return null; }
}
export function setSession(sess) {
  if (!sess) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(sess));
  emitSession(sess);
}
export function clearSession() { 
  localStorage.removeItem(STORAGE_KEY);
  emitSession(null);
}

const getJSON = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : {};
};

export async function idmLogin({ username, password }) {
  const url = `${API_URL}/idm/pub/v1/auth`;
  const body = JSON.stringify({ username, password, source: API_AUTH_SOURCE });
  const data = await getJSON(await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body
  }));
  const auth = data?.result?.auth_ticket;
  const refresh = data?.result?.refresh_ticket;
  if (!auth || !refresh) throw new Error('Login response missing tickets');
  setSession({ auth_ticket: auth, refresh_ticket: refresh });
  return data;
}

export async function refreshAuthTicket() {
  const s = getSession();
  if (!s?.refresh_ticket) throw new Error('No refresh ticket');
  const data = await getJSON(await fetch(`${API_URL}/idm/pub/v1/refresh`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${s.refresh_ticket}` },
  }));
  const next = data?.result?.auth_ticket;
  if (!next) throw new Error('Refresh response missing auth_ticket');
  setSession({ ...s, auth_ticket: next });
  return next;
}

export async function logout() {
  const s = getSession();
  try {
    await fetch(`${API_URL}/idm/sec/v1/logout`, {
      method: 'GET',
      headers: s?.auth_ticket ? { Authorization: `Bearer ${s.auth_ticket}` } : {},
    });
  } finally {
    clearSession();
  }
}

export function authHeader() {
  const s = getSession();
  return s?.auth_ticket ? { Authorization: `Bearer ${s.auth_ticket}` } : {};
}
