import React from 'react';
import { Loader2 } from 'lucide-react';

export default function FullPageOverlay({ message = 'Loading…' }) {
  return (
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      {message && (
        <div className="mt-4 text-lg text-gray-700">
          {message}
        </div>
      )}
    </div>
  );
}
