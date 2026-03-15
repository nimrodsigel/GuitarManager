export function buildSearchUrls(item) {
  const { make, model, year_from, year_to } = item;
  const parts = [
    make,
    model,
    year_from && year_to ? `${year_from}-${year_to}` : year_from || year_to,
  ].filter(Boolean);
  const query = parts.join(' ');
  if (!query.trim()) return [];
  const enc = encodeURIComponent(query);

  return [
    {
      label: 'Reverb',
      url: `https://reverb.com/marketplace?query=${enc}`,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      label: 'eBay',
      url: `https://www.ebay.com/sch/i.html?_nkw=${enc}&_sacat=619`,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      label: 'Guitar Center',
      url: `https://www.guitarcenter.com/search#q=${enc}&t=All`,
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      label: 'Sweetwater',
      url: `https://www.sweetwater.com/used/listings?query=${enc}`,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Music Go Round',
      url: `https://musicgoround.com/search.php?section=product&search_query=${enc}&Condition=Used&Country=US`,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      label: "Dave's Guitar",
      url: `https://www.davesguitar.com/search?q=${enc}&options%5Bprefix%5D=last`,
      color: 'bg-amber-700 hover:bg-amber-800',
    },
    {
      label: 'GBase',
      url: `https://www.gbase.com/gear?q=${enc}&f=t`,
      color: 'bg-slate-600 hover:bg-slate-700',
    },
    {
      label: 'Facebook',
      url: `https://www.facebook.com/marketplace/search/?query=${enc}`,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      label: 'CL · LA',
      url: `https://losangeles.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · NY',
      url: `https://newyork.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Boston',
      url: `https://boston.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Denver',
      url: `https://denver.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Houston',
      url: `https://houston.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Seattle',
      url: `https://seattle.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Orlando',
      url: `https://orlando.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Chicago',
      url: `https://chicago.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Detroit',
      url: `https://detroit.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Phoenix',
      url: `https://phoenix.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Nashville',
      url: `https://nashville.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'CL · Las Vegas',
      url: `https://lasvegas.craigslist.org/search/msg?query=${enc}`,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'Mercatino',
      url: `https://www.mercatinomusicale.com/ann/search.asp?ns=1&kw=${enc}`,
      color: 'bg-teal-600 hover:bg-teal-700',
    },
  ];
}
