'use client';

import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ScreenView) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { title: "Alex Morgan [3] vs Daniel Lee [8]", type: 'Live Match', view: 'overview-and-schedule' as ScreenView, icon: 'sports_tennis' },
    { title: "Carlos Alcaraz [1] vs Alex Morgan [3]", type: 'Quarterfinal 1', view: 'tournament-bracket' as ScreenView, icon: 'account_tree' },
    { title: "Official Player Registration Form ($149.50)", type: 'Registration', view: 'registration' as ScreenView, icon: 'badge' },
    { title: "Digital Credential & Player Pass (#JTC26-9842)", type: 'Pass', view: 'participant-portal' as ScreenView, icon: 'qr_code_2' },
    { title: "Admin & Tournament Dispatch Control Center", type: 'Operations', view: 'admin-suite' as ScreenView, icon: 'dashboard' },
    { title: "Senayan Centre Court & Facilities Matrix", type: 'Venue', view: 'overview-and-schedule' as ScreenView, icon: 'stadium' },
  ];

  const filtered = quickActions.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div 
        className="bg-surface-container-lowest rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-surface-container-high"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-surface-container-high flex items-center gap-3">
          <span className="material-symbols-outlined text-outline text-xl">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, draws, courts, matches or rules..."
            className="w-full bg-transparent border-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none"
          />
          <kbd className="font-caption text-caption bg-surface-container-high px-2 py-1 rounded text-on-surface-variant font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1 text-caption font-caption text-on-surface-variant font-bold uppercase tracking-wider">
            Quick Navigation & Matches
          </div>
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-container text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-primary font-bold">{item.title}</div>
                    <div className="text-caption font-caption text-on-surface-variant">{item.type}</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary text-base transition-colors">
                  arrow_forward
                </span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-body-sm text-on-surface-variant">
              No results found for &quot;{query}&quot;. Try searching &quot;Morgan&quot;, &quot;Alcaraz&quot;, &quot;Bracket&quot;, or &quot;Pass&quot;.
            </div>
          )}
        </div>

        <div className="p-2.5 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-caption font-caption text-on-surface-variant">
          <span>Jakarta Tennis Championship 2026 Engine</span>
          <span className="flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> System v2.6 Ready
          </span>
        </div>
      </div>
    </div>
  );
};
