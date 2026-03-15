import { useState } from 'react';
import { deletePhoto, setCoverPhoto, uploadPhotos } from '../api';

export default function PhotoGallery({ photos, guitarId, onRefresh }) {
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    await uploadPhotos(guitarId, files);
    onRefresh();
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await deletePhoto(id);
    onRefresh();
  };

  const handleCover = async (id) => {
    await setCoverPhoto(id);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">Photos ({photos.length})</h3>
        <label className="cursor-pointer bg-[#c9a84c] hover:bg-[#b8963b] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
          {uploading ? 'Uploading…' : '+ Add Photos'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {photos.length === 0 ? (
        <div className="h-32 flex items-center justify-center bg-[#fafaf7] rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
          No photos yet
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map(p => (
            <div key={p.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
              <img
                src={`/uploads/${p.filename}`}
                alt=""
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightbox(p)}
              />
              {p.is_cover === 1 && (
                <span className="absolute top-1 left-1 bg-[#c9a84c] text-white text-xs px-1.5 py-0.5 rounded">Cover</span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-2 gap-1 opacity-0 group-hover:opacity-100">
                {p.is_cover !== 1 && (
                  <button onClick={() => handleCover(p.id)}
                    className="bg-[#c9a84c] text-white text-xs px-2 py-1 rounded">Cover</button>
                )}
                <button onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={`/uploads/${lightbox.filename}`} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
