import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSummary } from '../api';
import GuitarCard from '../components/GuitarCard';

const CATEGORY_ICONS = { electric: '⚡', acoustic: '🎸', pedal: '🎛️', amp: '🔊', misc: '🎵' };

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-xl p-5 text-white ${color}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-sm opacity-70 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { getSummary().then(setData); }, []);

  if (!data) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  const profit = (data.totalSold - data.totalBought).toFixed(2);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="In Collection" value={data.total}  color="bg-[#1e3a5f]" />
        <StatCard label="Sold"          value={data.sold}   color="bg-[#374151]" />
        <StatCard label="Total Invested" value={`$${Number(data.totalBought).toLocaleString()}`} color="bg-[#2a4f7a]" />
        <StatCard label="Total Sold"    value={`$${Number(data.totalSold).toLocaleString()}`}
          sub={`P&L: ${profit >= 0 ? '+' : ''}$${profit}`} color="bg-[#a07830]" />
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">By Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
        {['electric','acoustic','pedal','amp','misc'].map(cat => {
          const entry = data.byCategory.find(b => b.category === cat);
          return (
            <button key={cat} onClick={() => navigate(`/collection?category=${cat}`)}
              className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow hover:border-[#c9a84c] transition-all">
              <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
              <p className="text-sm text-gray-500 mt-1 capitalize">{cat}</p>
              <p className="text-xl font-bold text-gray-900">{entry ? entry.count : 0}</p>
            </button>
          );
        })}
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">Recent Additions</h2>
      {data.recent.length === 0
        ? <p className="text-gray-400 text-sm">No guitars yet. <button className="text-[#c9a84c] underline" onClick={() => navigate('/collection')}>Add one!</button></p>
        : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.recent.map(g => <GuitarCard key={g.id} guitar={g} />)}
          </div>
      }
    </div>
  );
}
