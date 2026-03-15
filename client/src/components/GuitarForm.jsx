import { useState, useEffect } from 'react';

const CATEGORIES = ['electric', 'acoustic', 'pedal', 'amp', 'misc'];
const CONDITIONS = ['Mint', 'Excellent', 'Good', 'Fair', 'Poor'];
const STATUSES = ['in_stock', 'sold', 'consignment'];
const STATUS_LABELS = { in_stock: 'In Stock', sold: 'Sold', consignment: 'Consignment' };

const EMPTY = {
  make: '', model: '', year: '', serial_number: '', category: 'electric',
  condition: 'Good', status: 'in_stock', price_bought: '', year_bought: '',
  price_sold: '', comments: '',
};

export default function GuitarForm({ initial, initialCategory, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : { ...EMPTY, category: initialCategory || 'electric' });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form, files);
    setSaving(false);
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{initial ? 'Edit Item' : 'Add to Collection'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Make *</label>
                <input required className={inputCls} value={form.make} onChange={e => set('make', e.target.value)} placeholder="Fender, Gibson…" />
              </div>
              <div>
                <label className={labelCls}>Model *</label>
                <input required className={inputCls} value={form.model} onChange={e => set('model', e.target.value)} placeholder="Stratocaster, Les Paul…" />
              </div>
              <div>
                <label className={labelCls}>Year</label>
                <input type="number" className={inputCls} value={form.year} onChange={e => set('year', e.target.value)} placeholder="1965" min="1900" max="2099" />
              </div>
              <div>
                <label className={labelCls}>Serial Number</label>
                <input className={inputCls} value={form.serial_number} onChange={e => set('serial_number', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Condition</label>
                <select className={inputCls} value={form.condition} onChange={e => set('condition', e.target.value)}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Year Bought</label>
                <input type="number" className={inputCls} value={form.year_bought} onChange={e => set('year_bought', e.target.value)} placeholder="2022" />
              </div>
              <div>
                <label className={labelCls}>Price Bought ($)</label>
                <input type="number" step="0.01" className={inputCls} value={form.price_bought} onChange={e => set('price_bought', e.target.value)} placeholder="0.00" />
              </div>
              {form.status === 'sold' && (
                <div>
                  <label className={labelCls}>Price Sold ($)</label>
                  <input type="number" step="0.01" className={inputCls} value={form.price_sold} onChange={e => set('price_sold', e.target.value)} placeholder="0.00" />
                </div>
              )}
            </div>
            <div>
              <label className={labelCls}>Comments</label>
              <textarea className={inputCls} rows={3} value={form.comments} onChange={e => set('comments', e.target.value)} />
            </div>
            {!initial && (
              <div>
                <label className={labelCls}>Photos</label>
                <input type="file" accept="image/*" multiple className="text-sm text-gray-600"
                  onChange={e => setFiles(Array.from(e.target.files))} />
              </div>
            )}
            <div className="flex gap-3 pt-2">
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
