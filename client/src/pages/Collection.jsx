import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGuitars, createGuitar, uploadPhotos } from '../api';
import GuitarCard from '../components/GuitarCard';
import GuitarForm from '../components/GuitarForm';
import ShareModal from '../components/ShareModal';

const CATEGORIES = ['all', 'electric', 'acoustic', 'pedal', 'amp', 'misc'];
const CAT_LABELS = { all: 'All', electric: '⚡ Electric', acoustic: '🎸 Acoustic', pedal: '🎛️ Pedals', amp: '🔊 Amps', misc: '🎵 Misc' };

export default function Collection() {
  const [guitars, setGuitars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const setCategory = (cat) => setSearchParams(cat === 'all' ? {} : { category: cat });

  const load = useCallback(() => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (status !== 'all') params.status = status;
    if (search) params.search = search;
    getGuitars(params).then(setGuitars);
  }, [category, status, search]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form, files) => {
    const guitar = await createGuitar(form);
    if (files && files.length > 0) await uploadPhotos(guitar.id, files);
    setShowForm(false);
    load();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Collection</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowShare(true)}
            className="bg-[#2a4f7a] hover:bg-[#335e8e] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-1.5">
            🔗 Share
          </button>
          <button onClick={() => setShowForm(true)}
            className="bg-[#c9a84c] hover:bg-[#b8963b] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            + ADD
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat ? 'bg-[#c9a84c] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#fafaf7]'
              }`}>
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-1.5 text-sm bg-white text-gray-600 focus:outline-none">
          <option value="all">All Statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="sold">Sold</option>
          <option value="consignment">Consignment</option>
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search make, model, serial…"
          className="border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4b86a] flex-1 min-w-40" />
      </div>

      {guitars.length === 0
        ? <div className="text-center py-20 text-gray-400">No guitars found</div>
        : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {guitars.map(g => <GuitarCard key={g.id} guitar={g} />)}
          </div>
      }

      {showForm && <GuitarForm initialCategory={category !== 'all' ? category : 'electric'} onSave={handleSave} onCancel={() => setShowForm(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  );
}
