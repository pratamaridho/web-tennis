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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <span className="text-[11px] font-bold text-[#ccff00] uppercase tracking-wider">
              KABAR & ARTIKEL RESMI KLUB
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Berita & Pengumuman Terbaru
          </h2>
        </div>
        <p className="text-xs text-gray-400 max-w-md">
          Informasi terkini mengenai kalender kompetisi, update komunitas, liputan turnamen, dan tips tenis terkini.
        </p>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400 bg-[#12161f] border border-white/5 rounded-3xl">
          <div className="inline-block w-6 h-6 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs">Memuat berita terbaru...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12 bg-[#12161f] border border-white/5 rounded-3xl p-6">
          <p className="text-gray-400 text-xs">Belum ada artikel berita yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group bg-[#12161f] border border-white/10 hover:border-[#ccff00]/40 rounded-3xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div>
                {item.imageUrl ? (
                  <div className="w-full h-40 rounded-2xl overflow-hidden mb-3.5 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-[#1a2130] to-[#0e121a] flex items-center justify-center text-3xl mb-3.5 border border-white/5">
                    🎾
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                  <span>📅 {item.tanggal}</span>
                  <span className="text-[#ccff00] font-semibold">{item.penulisNama || 'Klub'}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#ccff00] transition-colors line-clamp-2 mb-2">
                  {item.judul}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {item.isi}
                </p>
              </div>

              <div className="pt-3.5 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#ccff00] font-bold">
                <span>Baca Selengkapnya</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#12161f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="text-[11px] font-bold text-[#ccff00] uppercase tracking-wider">
                BERITA RESMI KOMUNITAS
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedArticle.imageUrl && (
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.judul}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>📅 {selectedArticle.tanggal}</span>
              <span>•</span>
              <span className="text-white font-medium">Ditulis oleh {selectedArticle.penulisNama || 'Admin Klub'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
              {selectedArticle.judul}
            </h2>

            <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line border-t border-white/5 pt-4">
              {selectedArticle.isi}
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl cursor-pointer"
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
