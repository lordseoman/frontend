export default function RegisterModal({ onClose, goLogin }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create an account</h2>
          <button className="text-gray-500 hover:text-black" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        {/* TODO: your registration fields */}
        <div className="text-sm text-gray-600">Registration form goes here.</div>

        <div className="mt-4 text-sm flex items-center justify-between">
          <button className="text-blue-600 hover:underline" onClick={goLogin}>Back to login</button>
        </div>
      </div>
    </div>
  );
}
