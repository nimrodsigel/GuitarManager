import { useEffect, useState, useCallback } from 'react';
import { getOffers, updateOfferStatus } from '../api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
};
const OFFER_TYPE_LABELS = { buy: '💵 Buy', trade: '🔄 Trade' };
const CATEGORY_ICONS = { electric: '⚡', acoustic: '🎸', pedal: '🎛️', amp: '🔊', misc: '🎵' };

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = useCallback(() => getOffers(filter).then(setOffers), [filter]);
  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    await updateOfferStatus(id, status);
    load();
  };

  const filters = ['all', 'pending', 'accepted', 'declined'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
          <p className="text-sm text-gray-500">Buy and trade requests from your guests</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-[#c9a84c] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#fafaf7]'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">📭</p>
          <p>No {filter !== 'all' ? filter : ''} offers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white rounded-xl border border-gray-100 shadow p-4">
              <div className="flex items-start gap-4">
                {/* Guitar thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {offer.cover_photo
                    ? <img src={`/uploads/${offer.cover_photo}`} alt="" className="w-full h-full object-cover" />
                    : <span className="text-2xl">{CATEGORY_ICONS[offer.category] || '🎸'}</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {offer.make} {offer.model} {offer.year ? `(${offer.year})` : ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        from <strong>{offer.guest_name}</strong>
                        {' · '}{offer.guest_contact}
                        {' · '}via <span className="italic">{offer.share_name}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {OFFER_TYPE_LABELS[offer.offer_type]}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[offer.status]}`}>
                        {offer.status}
                      </span>
                    </div>
                  </div>

                  {offer.message && (
                    <p className="text-sm text-gray-600 mt-2 bg-[#fafaf7] rounded-lg p-2 italic">
                      "{offer.message}"
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{new Date(offer.created_at).toLocaleString()}</p>
                    {offer.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(offer.id, 'accepted')}
                          className="text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors">
                          Accept
                        </button>
                        <button onClick={() => handleStatus(offer.id, 'declined')}
                          className="text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition-colors">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
