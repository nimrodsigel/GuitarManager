import { useState, useEffect } from 'react';
import { getShares, createShare, revokeShare } from '../api';

const BASE_ORIGIN = window.location.origin;

export default function ShareModal({ onClose }) {
  const [shares, setShares] = useState([]);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(null);

  const load = () => getShares().then(setShares);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await createShare(newName.trim());
    setNewName('');
    setCreating(false);
    load();
  };

  const handleRevoke = async (id) => {
    if (!confirm('Revoke this link? The recipient will no longer be able to access your collection.')) return;
    await revokeShare(id);
    load();
  };

  const handleCopy = (token) => {
    navigator.clipboard.writeText(`${BASE_ORIGIN}/share/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const active = shares.filter(s => s.active === 1);
  const revoked = shares.filter(s => s.active === 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share Collection</h2>
              <p className="text-sm text-gray-500">Create links for guests to browse & make offers</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
          </div>

          {/* Create new link */}
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Recipient name (e.g. John Smith)"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
            <button type="submit" disabled={creating || !newName.trim()}
              className="bg-[#c9a84c] hover:bg-[#b8963b] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
              {creating ? '…' : 'Create'}
            </button>
          </form>

          {/* Active links */}
          {active.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Active Links</p>
              <div className="space-y-2">
                {active.map(s => (
                  <div key={s.id} className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleCopy(s.token)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                            copied === s.token
                              ? 'bg-green-500 text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-[#fafaf7]'
                          }`}>
                          {copied === s.token ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button onClick={() => handleRevoke(s.id)}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50 transition-colors">
                          Revoke
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-mono truncate">
                      {BASE_ORIGIN}/share/{s.token}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active.length === 0 && shares.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">No share links yet. Create one above.</p>
          )}

          {/* Revoked links */}
          {revoked.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Revoked</p>
              <div className="space-y-1">
                {revoked.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-3 py-2 bg-[#fafaf7] rounded-lg">
                    <p className="text-sm text-gray-400 line-through">{s.name}</p>
                    <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
