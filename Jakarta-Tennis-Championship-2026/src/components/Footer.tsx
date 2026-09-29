import React from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenView } from '../types';

interface FooterProps {
  onNavigate?: (view: ScreenView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl pt-space-xl pb-space-lg border-t border-surface-container-high">
      <div className="w-full px-gutter max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg pb-space-lg">
          {/* Col 1: Brand & Sanctioning */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <img 
                alt="Jakarta Tennis Championship 2026 Logo" 
                className="h-8 w-auto object-contain" 
                src={ASSETS.logo} 
              />
              <span className="font-headline-sm text-headline-sm text-primary font-bold">JTC 2026</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              The pinnacle of Southeast Asian lawn tennis. Sanctioned by International Tennis Federation (ITF) and Pelti Indonesia.
            </p>
            <div className="flex items-center gap-space-sm mt-space-xs">
              <span className="inline-flex items-center px-2 py-1 rounded bg-surface-container-high font-caption text-caption text-on-surface-variant font-bold uppercase">
                ITF World Tour
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-surface-container-high font-caption text-caption text-on-surface-variant font-bold uppercase">
                Pelti Grade 1
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider mb-space-xs font-bold">
              Quick Navigation
            </span>
            <button 
              onClick={() => onNavigate?.('overview-and-schedule')} 
              className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Tournament Schedule & Orders
            </button>
            <button 
              onClick={() => onNavigate?.('tournament-bracket')} 
              className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Men's & Women's Singles Draws
            </button>
            <button 
              onClick={() => onNavigate?.('participant-portal')} 
              className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Participant Player Portal & Pass
            </button>
            <button 
              onClick={() => onNavigate?.('admin-suite')} 
              className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Admin & Dispatch Control Center
            </button>
            <button 
              onClick={() => onNavigate?.('registration')} 
              className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Official Player Registration Form
            </button>
          </div>

          {/* Col 3: Live Court Weather */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider mb-space-xs font-bold">
              Live Court Weather
            </span>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex flex-col gap-1 border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">31°C</span>
                <span className="material-symbols-outlined text-secondary text-2xl">wb_sunny</span>
              </div>
              <div className="flex justify-between font-caption text-caption text-on-surface-variant">
                <span>Senayan Centre Court</span>
                <span>Humidity: 68%</span>
              </div>
              <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-1 pt-1 border-t border-surface-container-high">
                <span>Wind: 8 km/h ENE</span>
                <span className="text-tertiary-container font-bold">Roof: OPEN</span>
              </div>
            </div>
          </div>

          {/* Col 4: Sanctioning & Partners */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider mb-space-xs font-bold">
              Sanctioning & Partners
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-xs">
              Official tournament partners and broadcast networks across Asia-Pacific.
            </p>
            <div className="flex flex-wrap gap-space-xs">
              <span className="px-2.5 py-1 bg-surface-container font-caption text-caption text-on-surface font-semibold rounded shadow-2xs">
                Bank Mandiri
              </span>
              <span className="px-2.5 py-1 bg-surface-container font-caption text-caption text-on-surface font-semibold rounded shadow-2xs">
                Garuda Indonesia
              </span>
              <span className="px-2.5 py-1 bg-surface-container font-caption text-caption text-on-surface font-semibold rounded shadow-2xs">
                Wilson Tennis
              </span>
              <span className="px-2.5 py-1 bg-surface-container font-caption text-caption text-on-surface font-semibold rounded shadow-2xs">
                Sportfive
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md border-t border-surface-container-high text-on-surface-variant font-body-sm text-body-sm gap-space-sm">
          <p>© 2026 Jakarta Tennis Championship Committee. All rights reserved.</p>
          <div className="flex items-center gap-space-md text-caption font-caption">
            <a className="hover:text-on-surface transition-colors cursor-pointer" href="#rules">Regulations & Rules</a>
            <a className="hover:text-on-surface transition-colors cursor-pointer" href="#antidoping">Anti-Doping Policy</a>
            <a className="hover:text-on-surface transition-colors cursor-pointer" href="#privacy">Privacy Notice</a>
            <a className="hover:text-on-surface transition-colors cursor-pointer" href="#referee">Contact Referee Desk</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
