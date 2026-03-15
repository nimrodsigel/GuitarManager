import { useEffect, useState } from 'react';
import { getWishlist, createWishlistItem, updateWishlistItem, deleteWishlistItem, createGuitar } from '../api';
import WishlistCard from '../components/WishlistCard';
import WishlistForm from '../components/WishlistForm';
import GuitarForm from '../components/GuitarForm';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);

  const load = () => getWishlist().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editItem) await updateWishlistItem(editItem.id, form);
    else await createWishlistItem(form);
    setShowForm(false);
    setEditItem(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove from wishlist?')) return;
    await deleteWishlistItem(id);
    load();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleMoveToCollection = (item) => {
    setMoveItem(item);
  };

  const handleMoveSave = async (form, files) => {
    await createGuitar(form);
    await deleteWishlistItem(moveItem.id);
    setMoveItem(null);
    load();
  };

  // Pre-fill GuitarForm from wishlist item
  const movePreFill = moveItem ? {
    make: moveItem.make || '',
    model: moveItem.model || '',
    year: moveItem.year_from || '',
    category: moveItem.category || 'electric',
    comments: moveItem.notes || '',
  } : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
          <p className="text-sm text-gray-500">Guitars you're hunting for — search marketplaces with one click</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="bg-[#c9a84c] hover:bg-[#b8963b] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
          + Add to Wishlist
        </button>
      </div>

      {items.length === 0
        ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">🔍</p>
            <p>Your wishlist is empty. Add guitars you're looking for!</p>
          </div>
        )
        : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(item => (
              <WishlistCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMoveToCollection={handleMoveToCollection}
              />
            ))}
          </div>
        )
      }

      {showForm && (
        <WishlistForm initial={editItem} onSave={handleSave} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      )}

      {moveItem && (
        <GuitarForm initial={movePreFill} onSave={handleMoveSave} onCancel={() => setMoveItem(null)} />
      )}
    </div>
  );
}
