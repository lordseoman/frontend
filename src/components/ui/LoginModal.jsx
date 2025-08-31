import { useState } from 'react';
import { idmLogin } from '@/lib/idm';
import { toast } from 'react-toastify';

export default function LoginModal({ onClose, goRegister, goRecover }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await idmLogin({ username: u, password: p });
      toast.success('Logged in');
      onClose?.();
    } catch (e) {
      setErr(e.message || 'Login failed');
      toast.error('Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <button className="text-gray-500 hover:text-black" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input className="w-full border rounded-lg px-3 py-2" value={u} onChange={e => setU(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="w-full border rounded-lg px-3 py-2" type="password" value={p} onChange={e => setP(e.target.value)} />
          </div>
          <button className="w-full rounded-lg py-2 border bg-black text-white hover:opacity-90 disabled:opacity-60" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm flex items-center justify-between">
          <button className="text-blue-600 hover:underline" onClick={goRecover}>Forgot password?</button>
          <button className="text-blue-600 hover:underline" onClick={goRegister}>Create an account</button>
        </div>
      </div>
    </div>
  );
}
