'use client';

import React from 'react';
import { CLUB_SPONSORS } from '../../data/mockData';

export const SponsorsSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12">
      <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high text-center">
        <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider font-display block mb-1">
          Mitra &amp; Sponsor
        </span>
        <h3 className="text-base font-bold text-primary mb-4 font-display">
          Didukung oleh Partner Resmi Turnamen
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CLUB_SPONSORS.map((s, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container-high text-xs font-bold text-primary shadow-2xs font-display"
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
