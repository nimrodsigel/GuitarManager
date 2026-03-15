const VERSION = '1.0.0';
const UPDATED = 'March 2026';

const features = [
  {
    icon: '🎸',
    title: 'Collection',
    desc: 'Track every guitar, amp, and pedal you own — with photos, condition, price history, and serial numbers.',
  },
  {
    icon: '⭐',
    title: 'Wishlist',
    desc: 'Save gear you want and search 15+ marketplaces (Reverb, eBay, Sweetwater, Craigslist and more) with one click.',
  },
  {
    icon: '💬',
    title: 'Offers',
    desc: 'Receive and manage buy/sell offers from interested buyers via a shareable link.',
  },
  {
    icon: '📊',
    title: 'Dashboard',
    desc: 'Get a quick overview of your collection value, recent activity, and gear stats.',
  },
  {
    icon: '🔗',
    title: 'Share',
    desc: 'Generate a read-only public link to showcase your collection to anyone.',
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    desc: 'Fully responsive — works on phone, tablet, and desktop.',
  },
];

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-3">🎸</div>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-1">Guitar Manager</h1>
        <p className="text-gray-500 text-sm">v{VERSION} · {UPDATED}</p>
        <p className="mt-4 text-gray-600 text-base leading-relaxed">
          A personal tool for musicians and collectors to manage their gear —
          track what you own, hunt for what you want, and share your collection with the world.
        </p>
      </div>

      {/* Features */}
      <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {features.map(f => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3">
            <span className="text-2xl mt-0.5">{f.icon}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Version info + contact */}
      <div className="bg-[#1e3a5f] text-white rounded-xl p-5 text-center">
        <p className="text-[#c9a84c] font-bold text-lg">Guitar Manager</p>
        <p className="text-gray-300 text-sm mt-1">Version {VERSION} · {UPDATED}</p>
        <p className="text-gray-400 text-xs mt-2">Built for personal use and gear enthusiasts.</p>
        <div className="mt-4 pt-4 border-t border-[#2a4f7a]">
          <p className="text-gray-300 text-sm font-medium">Created by <span className="text-[#c9a84c]">NimrodZi</span></p>
          <a
            href="mailto:NimrodSigelman@gmail.com"
            className="inline-block mt-2 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors"
          >
            ✉️ NimrodSigelman@gmail.com
          </a>
        </div>
      </div>

    </div>
  );
}
