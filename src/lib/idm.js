const STORAGE_KEY = 'idm.session.v1';
import { API_URL, API_AUTH_SOURCE } from '../config';

export function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
export function setSession(sess) {
  if (!sess) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(sess));
}

export async function idmLogin({ username, password }) {
  const url = `${API_URL}/idm/pub/v1/auth`;
  const body = JSON.stringify({ username, password, source: API_AUTH_SOURCE });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText} — ${txt}`);
  }
  const data = await res.json();
  const auth = data?.result?.auth_ticket;
  const refresh = data?.result?.refresh_ticket;
  if (!auth || !refresh) throw new Error('Login response missing tickets');
  setSession({ auth_ticket: auth, refresh_ticket: refresh });
  return data;
}
