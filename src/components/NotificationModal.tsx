'use client';

import React from 'react';
import { ScreenView } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ScreenView) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Jadwal Lapangan 2',
      desc: 'Panggilan pukul 13:45 WIB. Loker #34.',
      time: '15m lalu',
      icon: 'notifications',
      type: 'dispatch',
      view: 'participant-portal' as ScreenView
    },
    {
      id: 2,
      title: 'Peringatan Suhu Lapangan',
      desc: 'Suhu 34.2°C. Istirahat hidrasi 10 menit diaktifkan.',
      time: '4m lalu',
      icon: 'notifications',
      type: 'warning',
      view: 'admin-suite' as ScreenView
    },
    {
      id: 3,
      title: 'Stringing Raket Selesai',
      desc: 'Yonex VCORE 98 (54 lbs) siap diambil di Meja 4.',
      time: '1j lalu',
      icon: 'notifications',
      type: 'equipment',
      view: 'participant-portal' as ScreenView
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex justify-end p-4 animate-in fade-in duration-150">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-surface-container-high flex flex-col h-fit max-h-[85vh] mt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="font-bold text-sm text-primary">Notifikasi</h3>
            <span className="bg-error text-on-error text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Daftar Notifikasi */}
        <div className="p-3 divide-y divide-surface-container-high overflow-y-auto space-y-2">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => { onNavigate(n.view); onClose(); }}
              className="pt-2 cursor-pointer hover:bg-surface-container-low p-2 rounded-xl transition-colors group"
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-lg shrink-0 ${
                  n.type === 'warning' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-primary group-hover:text-surface-tint">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-outline font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{n.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Modal */}
        <div className="p-3 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-xs">
          <button 
            onClick={() => { onNavigate('participant-portal'); onClose(); }}
            className="text-primary font-bold hover:underline"
          >
            Portal Atlet →
          </button>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface"
          >
            Tandai dibaca
          </button>
        </div>
      </div>
    </div>
  );
};
