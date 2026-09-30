/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';

interface NewsArticle {
  id: string;
  judul: string;
  isi: string;
  summary: string;
  tanggal: string;
  penulisNama?: string;
  imageUrl?: string | null;
}

const DEFAULT_NEWS_IMAGES = [
  '/tennis-action-smash.jpg',
  '/tennis-court-aerial.jpg',
  '/tennis-racket-ball.jpg',
  '/hero-tennis-grass.jpg',
  '/hero-tennis-bg.jpg',
];

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : { news: [] }))
      .then((data) => {
        if (active) {
          setNews(data.news || []);
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

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-semibold text-surface-tint mb-2 shadow-2xs">
          <span>Kabar &amp; Artikel Resmi Klub</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Berita &amp; Pengumuman Terbaru
        </h2>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="text-center py-14 text-on-surface-variant bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs">
          <div className="inline-block w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Memuat artikel berita...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-14 bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-surface-container text-primary mx-auto flex items-center justify-center text-xl mb-3 shadow-2xs">
            📰
          </div>
          <h3 className="text-sm font-bold text-primary mb-1">Belum Ada Artikel Berita</h3>
          <p className="text-on-surface-variant text-xs max-w-md mx-auto">
            Kabar resmi, pengumuman turnamen, dan liputan kegiatan klub akan segera dipublikasikan di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((item, idx) => {
            const imageSrc = item.imageUrl || DEFAULT_NEWS_IMAGES[idx % DEFAULT_NEWS_IMAGES.length];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="group relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer border border-surface-container-high/80 bg-surface-container"
              >
                {/* 1. Foto Banner Penuh */}
                <img
                  src={imageSrc}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* 2. Gradient Overlay Halus & Elegan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-50% to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                {/* 3. Judul di atas Latar Belakang Gradient */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3 z-10">
                  <div className="pr-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#ccff00] transition-colors line-clamp-2 leading-snug drop-shadow-md">
                      {item.judul}
                    </h3>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-sm shrink-0 group-hover:bg-[#ccff00] group-hover:text-black group-hover:border-[#ccff00] group-hover:scale-110 transition-all duration-300 shadow-md">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pop-up Kecil dengan Latar Belakang Transparan & Efek Blur (Glassmorphism) */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/70 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-scaleUp"
          >
            {/* Header Pop-up: Metadata Ringkas & Tombol Tutup */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-bold text-surface-tint uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container/80 border border-surface-container-high/80">
                {selectedArticle.tanggal} • {selectedArticle.penulisNama || 'Admin Klub'}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-7 h-7 rounded-full bg-surface-container/80 hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center text-xs cursor-pointer transition-colors shadow-2xs"
              >
                ✕
              </button>
            </div>

            {/* Thumbnail Gambar Pop-up */}
            <div className="w-full h-44 rounded-2xl overflow-hidden mb-3.5 bg-surface-container shadow-xs">
              <img
                src={selectedArticle.imageUrl || DEFAULT_NEWS_IMAGES[0]}
                alt={selectedArticle.judul}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Judul Berita */}
            <h2 className="text-lg sm:text-xl font-extrabold text-primary mb-2.5 leading-snug">
              {selectedArticle.judul}
            </h2>

            {/* Isi Lengkap Berita dalam Kotak Transparan */}
            <div className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line bg-surface-container/50 p-4 rounded-2xl border border-surface-container-high/60 mb-4 max-h-56 overflow-y-auto">
              {selectedArticle.isi}
            </div>

            {/* Tombol Tutup */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="w-full py-2.5 bg-primary hover:bg-surface-tint text-on-primary font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
