import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuitar, updateGuitar, deleteGuitar } from '../api';
import GuitarForm from '../components/GuitarForm';
import PhotoGallery from '../components/PhotoGallery';

const STATUS_COLORS = { in_stock: 'bg-green-100 text-green-800', sold: 'bg-red-100 text-red-800', consignment: 'bg-blue-100 text-blue-800' };
const STATUS_LABELS = { in_stock: 'In Stock', sold: 'Sold', consignment: 'Consignment' };

function Field({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}

export default function GuitarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guitar, setGuitar] = useState(null);
  const [editing, setEditing] = useState(false);

  const load = () => getGuitar(id).then(setGuitar);
  useEffect(() => { load(); }, [id]);

  const handleSave = async (form) => {
    await updateGuitar(id, form);
    setEditing(false);
    load();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this guitar? This cannot be undone.')) return;
    await deleteGuitar(id);
    navigate('/collection');
  };

  if (!guitar) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  const profit = guitar.price_sold && guitar.price_bought
    ? (guitar.price_sold - guitar.price_bought).toFixed(2)
    : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1">
        ← Back
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{guitar.make} {guitar.model}</h1>
          <p className="text-gray-500">{guitar.year || '—'} · {guitar.category} · {guitar.condition}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[guitar.status]}`}>
            {STATUS_LABELS[guitar.status]}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="text-sm bg-[#c9a84c] hover:bg-[#b8963b] text-white px-3 py-1.5 rounded-lg transition-colors">Edit</button>
            <button onClick={handleDelete} className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b border-gray-100 pb-2">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Serial Number" value={guitar.serial_number} />
            <Field label="Category" value={guitar.category} />
            <Field label="Condition" value={guitar.condition} />
            <Field label="Status" value={STATUS_LABELS[guitar.status]} />
            <Field label="Price Bought" value={guitar.price_bought ? `$${guitar.price_bought.toLocaleString()}` : null} />
            <Field label="Year Bought" value={guitar.year_bought} />
            {guitar.price_sold && <Field label="Price Sold" value={`$${guitar.price_sold.toLocaleString()}`} />}
            {profit !== null && (
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Profit/Loss</p>
                <p className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}${profit}
                </p>
              </div>
            )}
          </div>
          {guitar.comments && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Comments</p>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{guitar.comments}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow p-5">
          <PhotoGallery photos={guitar.photos} guitarId={id} onRefresh={load} />
        </div>
      </div>

      {editing && (
        <GuitarForm initial={guitar} onSave={handleSave} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
}
