import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPendingOffersCount } from '../api';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/collection', label: 'Collection' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/offers', label: 'Offers' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [pendingCount, setPendingCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = () => getPendingOffersCount().then(d => setPendingCount(d.count || 0));
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-[#1e3a5f] text-white shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-[#c9a84c]">🎸 Guitar Manager</span>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  isActive ? 'bg-[#c9a84c] text-gray-900' : 'text-gray-300 hover:text-white hover:bg-[#2a4f7a]'
                }`
              }
            >
              {label}
              {label === 'Offers' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-none">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-300 hover:text-white p-1"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#2a4f7a] px-4 py-2 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                  isActive ? 'bg-[#c9a84c] text-gray-900' : 'text-gray-300 hover:text-white hover:bg-[#2a4f7a]'
                }`
              }
            >
              {label}
              {label === 'Offers' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-none">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
