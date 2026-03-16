import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gm_user')); } catch { return null; }
  });
  const [ready, setReady] = useState(false);

  // Verify stored user against server on startup
  useEffect(() => {
    const stored = user;
    if (!stored?.id) { setReady(true); return; }

    fetch('/api/auth/me', { headers: { 'X-User-Id': String(stored.id) } })
      .then(r => {
        if (!r.ok) { localStorage.removeItem('gm_user'); setUser(null); }
        setReady(true);
      })
      .catch(() => setReady(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData) => {
    localStorage.setItem('gm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('gm_user');
    setUser(null);
  };

  // Don't render until we've verified the session
  if (!ready) return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
      <span className="text-4xl animate-pulse">🎸</span>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
