import { useState } from 'react';

const CATEGORIES = ['electric', 'acoustic', 'bass', 'pedal', 'amp', 'misc'];
const EMPTY = { make: '', model: '', year_from: '', year_to: '', max_price: '', category: 'electric', notes: '' };

export default function WishlistForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{initial ? 'Edit Wishlist Item' : 'Add to Wishlist'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Make</label>
                <input className={inputCls} value={form.make} onChange={e => set('make', e.target.value)} placeholder="Gibson, Fender…" />
              </div>
              <div>
                <label className={labelCls}>Model</label>
                <input className={inputCls} value={form.model} onChange={e => set('model', e.target.value)} placeholder="Les Paul, Strat…" />
              </div>
              <div>
                <label className={labelCls}>Year From</label>
                <input type="number" className={inputCls} value={form.year_from} onChange={e => set('year_from', e.target.value)} placeholder="1960" />
              </div>
              <div>
                <label className={labelCls}>Year To</label>
                <input type="number" className={inputCls} value={form.year_to} onChange={e => set('year_to', e.target.value)} placeholder="1969" />
              </div>
              <div>
                <label className={labelCls}>Max Price ($)</label>
                <input type="number" step="0.01" className={inputCls} value={form.max_price} onChange={e => set('max_price', e.target.value)} placeholder="5000" />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea className={inputCls} rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Must have original case…" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8963b] text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
