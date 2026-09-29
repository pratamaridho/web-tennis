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
      title: 'Court 2 Assignment Confirmed',
      desc: 'Warmup call begins at 13:45 WIB. Locker #34 assigned.',
      time: '15m ago',
      icon: 'stadium',
      type: 'dispatch',
      view: 'participant-portal' as ScreenView
    },
    {
      id: 2,
      title: 'Weather Advisory • Sensor Node B-4',
      desc: 'Dry heat index 34.2°C. 10-minute hydration breaks activated.',
      time: '4 mins ago',
      icon: 'thunderstorm',
      type: 'warning',
      view: 'admin-suite' as ScreenView
    },
    {
      id: 3,
      title: 'Stringing Complete (Racket #2)',
      desc: 'Yonex VCORE 98 (54 lbs) ready at Service Hub desk 4.',
      time: '1h ago',
      icon: 'tune',
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
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">notifications_active</span>
            <h3 className="font-headline-sm text-sm font-bold text-primary">Live Notifications</h3>
            <span className="bg-error text-on-error font-caption text-caption px-1.5 py-0.2 rounded-full font-bold">3</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

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
                  <span className="material-symbols-outlined text-base">{n.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-md text-label-md font-bold text-primary group-hover:text-surface-tint">
                      {n.title}
                    </h4>
                    <span className="text-caption font-caption text-outline font-mono">{n.time}</span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">{n.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between">
          <button 
            onClick={() => { onNavigate('participant-portal'); onClose(); }}
            className="text-primary font-label-md text-label-md hover:underline font-bold"
          >
            View Player Dashboard →
          </button>
          <button 
            onClick={onClose}
            className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface"
          >
            Mark all read
          </button>
        </div>
      </div>
    </div>
  );
};
