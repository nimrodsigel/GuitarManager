import { useState } from 'react';
import { submitOffer } from '../api';

export default function OfferForm({ token, guitar, onClose }) {
  const [form, setForm] = useState({ guest_name: '', guest_contact: '', offer_type: 'buy', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await submitOffer(token, { ...form, guitar_id: guitar.id });
      if (res.ok) {
        setSent(true);
      } else {
        setError(res.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to send offer');
    }
    setSending(false);
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">✅</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Offer Sent!</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your {form.offer_type === 'buy' ? 'purchase' : 'trade'} offer for the{' '}
                <strong>{guitar.make} {guitar.model}</strong> has been submitted.
              </p>
              <button onClick={onClose} className="bg-[#c9a84c] hover:bg-[#b8963b] text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Make an Offer</h2>
                  <p className="text-sm text-gray-500">{guitar.make} {guitar.model} {guitar.year ? `(${guitar.year})` : ''}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>Your Name *</label>
                  <input required className={inputCls} value={form.guest_name} onChange={e => set('guest_name', e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <label className={labelCls}>Email or Phone *</label>
                  <input required className={inputCls} value={form.guest_contact} onChange={e => set('guest_contact', e.target.value)} placeholder="email@example.com or +1 555 …" />
                </div>
                <div>
                  <label className={labelCls}>Offer Type *</label>
                  <div className="flex gap-3">
                    {['buy', 'trade'].map(type => (
                      <label key={type} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer transition-colors ${
                        form.offer_type === type
                          ? 'border-[#c9a84c] bg-[#fef9e7] text-[#7a5c20] font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                        <input type="radio" name="offer_type" value={type} checked={form.offer_type === type}
                          onChange={() => set('offer_type', type)} className="hidden" />
                        {type === 'buy' ? '💵 Buy' : '🔄 Trade'}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Message {form.offer_type === 'trade' ? '(describe your trade offer) *' : ''}</label>
                  <textarea className={inputCls} rows={3} value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder={form.offer_type === 'trade'
                      ? 'Describe the guitar(s) you\'re offering in trade…'
                      : 'Any questions or notes for the seller…'
                    }
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={sending}
                    className="flex-1 bg-[#c9a84c] hover:bg-[#b8963b] text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50">
                    {sending ? 'Sending…' : 'Send Offer'}
                  </button>
                  <button type="button" onClick={onClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
