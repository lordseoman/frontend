import { useEffect, useState } from 'react';

export default function RecoverModal({ onClose, goLogin, defaultToken = '' }) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(defaultToken);

  useEffect(() => { setToken(defaultToken || ''); }, [defaultToken]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Password recovery</h2>
          <button className="text-gray-500 hover:text-black" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        {/* Stage 1 (request recovery): collect username, then call your /idm/pub/v1/recovery/token flow */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input className="w-full border rounded-lg px-3 py-2" value={username} onChange={e => setUsername(e.target.value)} />
          </div>

        {/* Stage 2 (set password via token): demonstrate token capture if coming from a link */}
          <div>
            <label className="block text-sm mb-1">Recovery token</label>
            <input className="w-full border rounded-lg px-3 py-2" value={token} onChange={e => setToken(e.target.value)} placeholder="(optional)" />
          </div>
        </div>

        <div className="mt-4 text-sm flex items-center justify-between">
          <button className="text-blue-600 hover:underline" onClick={goLogin}>Back to login</button>
        </div>
      </div>
    </div>
  );
}
