'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenView } from '../types';

interface FooterProps {
  onNavigate?: (view: ScreenView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container-high py-8 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Ringkasan */}
        <div className="flex items-center gap-3">
          <img 
            alt="Logo" 
            className="h-7 w-auto object-contain" 
            src={ASSETS.logo} 
          />
          <div className="text-xs">
            <span className="font-bold text-primary mr-1">Tyrannosaurus Tennis Club</span>
            <span className="text-on-surface-variant">• House of Tennis GS</span>
          </div>
        </div>

        {/* Tautan Cepat */}
        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <button 
            onClick={() => onNavigate?.('overview-and-schedule')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <button 
            onClick={() => onNavigate?.('tournament-bracket')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Bagan Turnamen
          </button>
          <button 
            onClick={() => onNavigate?.('registration')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Daftar Tim
          </button>
          <button 
            onClick={() => onNavigate?.('participant-portal')} 
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Portal Member
          </button>
        </div>

        {/* Hak Cipta Ringkas */}
        <div className="text-[11px] text-on-surface-variant">
          © 2026 Tyrannosaurus Tennis Club.
        </div>
      </div>
    </footer>
  );
};
