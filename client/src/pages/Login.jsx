import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Email and password are required');
    if (mode === 'register' && !name) return setError('Name is required');
    if (mode === 'register' && password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register' ? { name, email, password } : { email, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Something went wrong');
      login(data);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎸</div>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Guitar Manager</h1>
          <p className="text-gray-500 mt-1">Track your gear collection</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >Sign In</button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'register' ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Nimrod"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            {mode === 'register' && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 accent-[#c9a84c]" />
                <span className="text-xs text-gray-500">
                  I agree to the{' '}
                  <button type="button" onClick={() => setShowDisclaimer(true)} className="underline text-[#1e3a5f]">
                    Terms of Use
                  </button>
                  {' '}— this app is for personal use only.
                </span>
              </label>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Disclaimer modal */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowDisclaimer(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg text-[#1e3a5f] mb-3">Terms of Use & Disclaimer</h3>
              <div className="text-sm text-gray-600 space-y-3">
                <p><strong>Personal Use Only.</strong> Guitar Manager is intended solely for personal, non-commercial use to track your own gear collection.</p>
                <p><strong>No Liability.</strong> The developers of this app are not responsible for any loss, damage, or disputes arising from the use of this application, including but not limited to inaccurate valuations, lost data, or transactions between users.</p>
                <p><strong>Your Responsibility.</strong> You are solely responsible for the accuracy of information you enter, any transactions you make with other users, and maintaining the confidentiality of your account credentials.</p>
                <p><strong>No Warranty.</strong> This app is provided "as is" without any warranties. Service availability is not guaranteed.</p>
                <p><strong>Data.</strong> Your data is stored on shared servers. Do not enter sensitive financial information.</p>
              </div>
              <button onClick={() => setShowDisclaimer(false)}
                className="mt-5 w-full bg-[#1e3a5f] text-white py-2.5 rounded-xl font-medium text-sm">
                I Understand
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
