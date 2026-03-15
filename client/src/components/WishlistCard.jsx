import { buildSearchUrls } from '../utils/searchUrls';

const CATEGORY_ICONS = { electric: '⚡', acoustic: '🎸', pedal: '🎛️', amp: '🔊', misc: '🎵' };

export default function WishlistCard({ item, onEdit, onDelete, onMoveToCollection }) {
  const urls = buildSearchUrls(item);
  const yearRange = item.year_from && item.year_to
    ? `${item.year_from}–${item.year_to}`
    : item.year_from || item.year_to || null;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CATEGORY_ICONS[item.category] || '🎸'}</span>
          <div>
            <p className="font-semibold text-gray-900">
              {[item.make, item.model].filter(Boolean).join(' ') || 'Unknown'}
            </p>
            <p className="text-sm text-gray-500">
              {yearRange && <span className="mr-2">{yearRange}</span>}
              {item.max_price && <span>Budget: ${Number(item.max_price).toLocaleString()}</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(item)} className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100">Edit</button>
          <button onClick={() => onDelete(item.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Del</button>
        </div>
      </div>

      {item.notes && <p className="text-sm text-gray-600 mt-2 italic">{item.notes}</p>}

      {urls.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1.5">Search on:</p>
          <div className="flex flex-wrap gap-1.5">
            {urls.map(({ label, url, color }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className={`text-xs text-white font-medium px-2.5 py-1 rounded-full transition-colors ${color}`}>
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onMoveToCollection(item)}
        className="mt-3 w-full text-xs text-[#9a7c2d] bg-[#fef9e7] hover:bg-[#fef3c7] font-medium py-1.5 rounded-lg transition-colors"
      >
        + Move to Collection (Found it!)
      </button>
    </div>
  );
}
