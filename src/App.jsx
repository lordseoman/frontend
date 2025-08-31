import './App.css';

import { useEffect, useState } from 'react';
import Navbar from './components/ui/Navbar';
import LoginModal from './components/ui/LoginModal';
import RegisterModal from './components/ui/RegisterModal';
import RecoverModal from './components/ui/RecoverModal';

export default function App() {
  const [modal, setModal] = useState(null); // 'login' | 'register' | 'recover' | null
  const [recoverToken, setRecoverToken] = useState('');

  // --- Optional: keep modal in the URL (?modal=login|register|recover&token=...)
  useEffect(() => {
    const syncFromUrl = () => {
      const sp = new URLSearchParams(window.location.search);
      const m = sp.get('modal');
      const t = sp.get('token') || '';
      if (m === 'login' || m === 'register' || m === 'recover') {
        setModal(m);
        setRecoverToken(t);
      } else {
        setModal(null);
        setRecoverToken('');
      }
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const openModal = (m, opts = {}) => {
    setModal(m);
    if (m === 'recover') setRecoverToken(opts.token || '');
    // reflect in URL (no route lib needed)
    const sp = new URLSearchParams(window.location.search);
    if (m) sp.set('modal', m); else sp.delete('modal');
    if (opts.token) sp.set('token', opts.token); else sp.delete('token');
    const q = sp.toString();
    const url = `${window.location.pathname}${q ? `?${q}` : ''}${window.location.hash}`;
    window.history.pushState({}, '', url);
  };

  const closeModal = () => openModal(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onLogin={() => openModal('login')}
        onRegister={() => openModal('register')}
        onRecover={() => openModal('recover')}
      />

      <main className="mx-auto px-10 py-6">
        <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
        <p className="text-sm text-gray-600">Event details will appear here.</p>
      </main>

      {modal === 'login' && (
        <LoginModal
          onClose={closeModal}
          goRegister={() => openModal('register')}
          goRecover={() => openModal('recover')}
        />
      )}

      {modal === 'register' && (
        <RegisterModal
          onClose={closeModal}
          goLogin={() => openModal('login')}
        />
      )}

      {modal === 'recover' && (
        <RecoverModal
          onClose={closeModal}
          goLogin={() => openModal('login')}
          defaultToken={recoverToken}
        />
      )}
    </div>
  );
}
