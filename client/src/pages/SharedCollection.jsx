import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedCollection } from '../api';
import OfferForm from '../components/OfferForm';

const CATEGORIES = ['all', 'electric', 'acoustic', 'pedal', 'amp', 'misc'];
const CAT_LABELS = { all: 'All', electric: '⚡ Electric', acoustic: '🎸 Acoustic', pedal: '🎛️ Pedals', amp: '🔊 Amps', misc: '🎵 Misc' };
const CATEGORY_ICONS = { electric: '⚡', acoustic: '🎸', pedal: '🎛️', amp: '🔊', misc: '🎵' };

function PublicGuitarCard({ guitar, onOffer }) {
  const imgSrc = guitar.cover_photo ? `/uploads/${guitar.cover_photo}` : null;
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imgSrc
          ? <img src={imgSrc} alt={guitar.model} className="w-full h-full object-cover" />
          : <span className="text-5xl">{CATEGORY_ICONS[guitar.category] || '🎸'}</span>
        }
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 leading-tight">{guitar.make} {guitar.model}</p>
        <p className="text-sm text-gray-500">{guitar.year || '—'} · {guitar.condition}</p>
        <button
          onClick={() => onOffer(guitar)}
          className="mt-2 w-full bg-[#c9a84c] hover:bg-[#b8963b] text-white text-sm font-semibold py-1.5 rounded-lg transition-colors">
          Make Offer
        </button>
      </div>
    </div>
  );
}

export default function SharedCollection() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [offerGuitar, setOfferGuitar] = useState(null);

  const load = useCallback(async () => {
    const params = category !== 'all' ? { category } : {};
    const res = await getSharedCollection(token, params);
    if (res.error) setError(res.error);
    else setData(res);
  }, [token, category]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Valid</h1>
          <p className="text-gray-500">This share link has been revoked or doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <header className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🎸</span>
        <div>
          <h1 className="font-bold text-lg leading-tight">Guitar Collection</h1>
          <p className="text-xs text-gray-400">Browse available guitars and make an offer</p>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat ? 'bg-[#c9a84c] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#fafaf7]'
              }`}>
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>

        {data.guitars.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No guitars available in this category.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.guitars.map(g => (
              <PublicGuitarCard key={g.id} guitar={g} onOffer={setOfferGuitar} />
            ))}
          </div>
        )}
      </div>

      {offerGuitar && (
        <OfferForm
          token={token}
          guitar={offerGuitar}
          onClose={() => setOfferGuitar(null)}
        />
      )}
    </div>
  );
}
