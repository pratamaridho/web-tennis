'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface NewsItem {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  penulisId: string;
  penulisNama?: string;
  imageUrl?: string | null;
  createdAt: string;
}

export const AdminNewsTab: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNewsList(data.news || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : { news: [] }))
      .then((data) => {
        if (active) {
          setNewsList(data.news || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setJudul('');
    setIsi('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setImageUrl('');
    setFeedback(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingId(item.id);
    setJudul(item.judul);
    setIsi(item.isi);
    setTanggal(item.tanggal);
    setImageUrl(item.imageUrl || '');
    setFeedback(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const url = editingId ? `/api/news/${editingId}` : '/api/news';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul,
          isi,
          tanggal,
          imageUrl: imageUrl.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Gagal menyimpan berita' });
      } else {
        setFeedback({
          type: 'success',
          message: editingId ? 'Berita berhasil diperbarui!' : 'Berita berhasil dipublikasikan!',
        });
        setTimeout(() => {
          setIsFormOpen(false);
          fetchNews();
        }, 1200);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gangguan koneksi server saat menyimpan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus berita: "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNews();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus berita');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus berita');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#141822] border border-white/10 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              PRD F1
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              KONTEN KLUB
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Manajemen Berita & Pengumuman
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Publikasikan pengumuman resmi, hasil turnamen, dan jadwal kegiatan klub tenis.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs rounded-xl transition-all shadow-md shadow-[#ccff00]/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tulis Berita Baru</span>
        </button>
      </div>

      {/* News List */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 bg-[#12161f] border border-white/5 rounded-3xl">
          <div className="inline-block w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Memuat arsip berita klub...</p>
        </div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-16 bg-[#12161f] border border-white/5 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 mx-auto flex items-center justify-center text-xl mb-3">
            📰
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Belum Ada Berita</h3>
          <p className="text-gray-400 text-xs mb-4">
            Mulai bagikan pengumuman atau artikel pertama untuk anggota komunitas tenis Anda.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#ccff00] text-black font-bold text-xs rounded-xl cursor-pointer"
          >
            Buat Berita Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsList.map((item) => (
            <div
              key={item.id}
              className="bg-[#12161f] border border-white/10 hover:border-white/20 rounded-3xl p-5 flex flex-col justify-between transition-all shadow-lg"
            >
              <div>
                {item.imageUrl && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden mb-3 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                  <span>📅 {item.tanggal}</span>
                  <span className="text-[#ccff00] font-medium">Oleh {item.penulisNama || 'Admin'}</span>
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 mb-2">
                  {item.judul}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                  {item.isi}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.judul)}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit News Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#12161f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider">
                  {editingId ? 'EDIT KONTEN' : 'KONTEN BARU'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingId ? 'Edit Berita Klub' : 'Tulis Berita / Pengumuman'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-4 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Turnamen Musim Panas 2026 Segera Dibuka!"
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Tanggal Publikasi *
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    URL Gambar (Opsional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Isi Berita / Pengumuman *
                </label>
                <textarea
                  required
                  rows={5}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan detail berita, aturan lengkap, atau ringkasan hasil turnamen di sini..."
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  {isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Publikasikan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
