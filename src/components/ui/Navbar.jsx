import { API_APP_TITLE }    from '@/config'

export default function Navbar({ onLogin, onRegister, onRecover }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto  px-10 h-14 flex items-center justify-between">
        {/* Left: Title + Nav */}
        <nav className="flex items-center gap-4">
          <div className="font-semibold">{API_APP_TITLE}</div>
          {/* Minimal placeholders; add real links later */}
          <a href="#" className="text-sm text-gray-600 hover:text-black">Overview</a>
          <a href="#" className="text-sm text-gray-600 hover:text-black">Schedule</a>
          <a href="#" className="text-sm text-gray-600 hover:text-black">Venue</a>
        </nav>

        {/* Right: Notifications + Settings + Login */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100" title="Notifications" aria-label="Notifications">
            <i className="fa-regular fa-bell" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100" title="Settings" aria-label="Settings">
            <i className="fa-solid fa-gear" />
          </button>
          <button className="px-3 py-1.5 border rounded-lg" onClick={onLogin} title="Login">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
