import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  in_stock: 'bg-green-100 text-green-800',
  sold: 'bg-red-100 text-red-800',
  consignment: 'bg-blue-100 text-blue-800',
};
const STATUS_LABELS = { in_stock: 'In Stock', sold: 'Sold', consignment: 'Consignment' };
const CATEGORY_ICONS = { electric: '⚡', acoustic: '🎸', pedal: '🎛️', amp: '🔊', misc: '🎵' };

export default function GuitarCard({ guitar }) {
  const navigate = useNavigate();
  const imgSrc = guitar.cover_photo ? `/uploads/${guitar.cover_photo}` : null;

  return (
    <div
      onClick={() => navigate(`/guitar/${guitar.id}`)}
      className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer transition-shadow overflow-hidden border border-gray-100"
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imgSrc
          ? <img src={imgSrc} alt={guitar.model} className="w-full h-full object-cover" />
          : <span className="text-5xl">{CATEGORY_ICONS[guitar.category] || '🎸'}</span>
        }
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{guitar.make} {guitar.model}</p>
            <p className="text-sm text-gray-500">{guitar.year || '—'} · {guitar.condition}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[guitar.status]}`}>
            {STATUS_LABELS[guitar.status]}
          </span>
        </div>
        {guitar.price_bought && (
          <p className="text-sm text-gray-600 mt-1">
            Bought: <span className="font-medium">${guitar.price_bought.toLocaleString()}</span>
            {guitar.price_sold && <> · Sold: <span className="font-medium text-green-700">${guitar.price_sold.toLocaleString()}</span></>}
          </p>
        )}
      </div>
    </div>
  );
}
