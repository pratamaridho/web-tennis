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
          <p className="text-xs">Memuat artikel berita terbaru...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group bg-surface-container-lowest border border-surface-container-high/90 hover:border-primary/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Thumbnail */}
                {item.imageUrl ? (
                  <div className="relative w-full h-48 overflow-hidden bg-surface-container">
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-36 bg-surface-container flex items-center justify-center text-3xl border-b border-surface-container-high">
                    🎾
                  </div>
                )}

                <div className="p-5">
                  {/* Date & Author */}
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2.5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {item.tanggal}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-surface-tint font-bold text-[10px] uppercase border border-surface-container-high">
                      {item.penulisNama || 'Admin Klub'}
                    </span>
                  </div>

                  {/* Title & Body Preview */}
                  <h3 className="text-base font-bold text-primary group-hover:text-surface-tint transition-colors line-clamp-2 mb-2 leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                    {item.isi}
                  </p>
                </div>
              </div>

              {/* Action Button Link */}
              <div className="px-5 pb-5 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-primary font-bold">
                <span>Baca Selengkapnya</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-high mb-4">
              <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider">
                BERITA RESMI KOMUNITAS
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {selectedArticle.imageUrl && (
              <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-4 bg-surface-container">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.judul}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
              <span>📅 {selectedArticle.tanggal}</span>
              <span>•</span>
              <span className="text-primary font-medium">Ditulis oleh {selectedArticle.penulisNama || 'Admin Klub'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-primary mb-4 leading-tight">
              {selectedArticle.judul}
            </h2>

            <div className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line border-t border-surface-container-high/60 pt-4">
              {selectedArticle.isi}
            </div>

            <div className="pt-6 mt-4 border-t border-surface-container-high flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-primary hover:bg-surface-tint text-on-primary font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
