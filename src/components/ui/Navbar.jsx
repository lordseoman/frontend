import { useEffect, useState } from 'react';
import { API_APP_TITLE, API_URL } from '@/config';
import { getSession, logout as idmLogout, authHeader } from '@/lib/idm';

export default function Navbar({ onLogin, onRegister, onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getSession()?.auth_ticket);
  const [showNotifs, setShowNotifs] = useState(false);

  // Keep login state in sync if other parts of the app update localStorage
  useEffect(() => {
    const onSession = (e) => {
      const sess = e.detail?.session || null;
      setIsLoggedIn(!!sess?.auth_ticket);
      if (!sess) setShowNotifs(false);
    };
    window.addEventListener('idm:session', onSession);
    // initial sync
    setIsLoggedIn(!!getSession()?.auth_ticket);
    return () => window.removeEventListener('idm:session', onSession);
  }, []);

  async function handleLogout() {
    await idmLogout();
  }

  const goto = (key) => {
    // Provide a hook to parent if you later add routing
    if (onNavigate) onNavigate(key);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto px-10 h-14 flex items-center justify-between">
        {/* Left: Title + Nav */}
        <nav className="flex items-center gap-6">
          <div className="text-2xl font-bold tracking-tight">{API_APP_TITLE}</div>

          <button className="text-sm text-gray-700 hover:text-black" onClick={() => goto('overview')}>
            Overview
          </button>
          <button className="text-sm text-gray-700 hover:text-black" onClick={() => goto('schedule')}>
            Schedule
          </button>
          <button className="text-sm text-gray-700 hover:text-black" onClick={() => goto('venue')}>
            Venue
          </button>
          <button className="text-sm text-gray-700 hover:text-black" onClick={onRegister}>
            Register
          </button>
        </nav>

        {/* Right: session actions */}
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <button className="px-3 py-1.5 border rounded-lg" onClick={onLogin} title="Login">
              Login
            </button>
          ) : (
            <>
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Notifications"
                aria-label="Notifications"
                onClick={() => setShowNotifs((s) => !s)}
              >
                <i className="fa-regular fa-bell" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Settings" aria-label="Settings">
                <i className="fa-solid fa-gear" />
              </button>
              <button className="px-3 py-1.5 border rounded-lg" onClick={handleLogout} title="Logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {isLoggedIn && showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
    </header>
  );
}

/** Lightweight notifications modal that fetches recent session notifications. */
function NotificationsPanel({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  // Adjust this path if your backend uses a different route
  const NOTIF_PATH = `${API_URL}/event/sec/v1/notifications?limit=20`;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(NOTIF_PATH, {
          headers: { Accept: 'application/json', ...authHeader() },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        // Accept either {items:[...]} or a raw array
        const list = Array.isArray(data) ? data : (data.items || []);
        if (!cancelled) setItems(list);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load notifications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [NOTIF_PATH]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
      <div className="mt-14 mr-4 w-full max-w-md bg-white rounded-2xl shadow-2xl border">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-base font-semibold">Recent notifications</h3>
          <button className="text-gray-500 hover:text-black" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-3">
          {loading && <div className="text-sm text-gray-500 p-2">Loading…</div>}
          {error && <div className="text-sm text-red-600 p-2">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="text-sm text-gray-500 p-2">No notifications.</div>
          )}

          <ul className="space-y-2">
            {items.map((n, idx) => (
              <li key={n.id || idx} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">
                    {n.title || n.Name || 'Notification'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {n.time
                      ? new Date(n.time).toLocaleString()
                      : n.Timestamp
                      ? new Date(n.Timestamp).toLocaleString()
                      : ''}
                  </div>
                </div>
                {n.message || n.Message ? (
                  <p className="text-sm text-gray-700 mt-1">
                    {n.message || n.Message}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
