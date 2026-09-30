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

      {/* Modal Detail Berita - Desain Showcase Terinspirasi Referensi Astra Honda */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex flex-col justify-start md:justify-center items-center p-4 sm:p-8 lg:p-12 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl mx-auto my-auto animate-scaleUp"
          >
            {/* Tombol Kembali / Back Arrow (Khas Referensi Gambar) */}
            <div className="flex items-center mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Kembali"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="text-2xl sm:text-3xl font-bold group-hover:-translate-x-1.5 transition-transform duration-200">
                  ←
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 group-hover:text-white transition-colors">
                  Kembali
                </span>
              </button>
            </div>

            {/* Konten Utama 2 Kolom (Landscape Widescreen) */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start w-full">
              {/* Sisi Kiri: Foto / Banner Poster */}
              <div className="w-full lg:w-1/2 shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                <img
                  src={selectedArticle.imageUrl || DEFAULT_NEWS_IMAGES[0]}
                  alt={selectedArticle.judul}
                  className="w-full h-auto object-cover max-h-[460px]"
                />
              </div>

              {/* Sisi Kanan: Judul, Subjudul, Deskripsi, dan Spesifikasi Tabel */}
              <div className="flex-1 flex flex-col text-left w-full">
                {/* 1. Judul Utama (Besar & Tegas) */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                  {selectedArticle.judul}
                </h2>

                {/* 2. Subjudul / Kategori Status */}
                <p className="text-base sm:text-lg font-bold text-gray-200 mb-4">
                  Kabar Resmi Klub & Komunitas
                </p>

                {/* 3. Paragraf Isi Berita Lengkap (Bersih, Nyaman Dibaca) */}
                <div className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line mb-6 font-normal">
                  {selectedArticle.isi}
                </div>

                {/* 4. Tabel Metadata / Spesifikasi Khas Referensi Astra Honda */}
                <div className="space-y-2.5 w-full text-xs sm:text-sm">
                  {/* Row 1: Waktu */}
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      WAKTU
                    </span>
                    <span className="text-gray-200 font-medium">
                      {selectedArticle.tanggal}
                    </span>
                  </div>

                  {/* Row 2: Penulis */}
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      PENULIS
                    </span>
                    <span className="text-gray-200 font-medium">
                      {selectedArticle.penulisNama || 'Admin Klub Tyrannosaurus'}
                    </span>
                  </div>

                  {/* Row 3: Klub */}
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      KOMUNITAS
                    </span>
                    <span className="text-[#ccff00] font-semibold">
                      Tyrannosaurus Tennis Club Gading Serpong
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
