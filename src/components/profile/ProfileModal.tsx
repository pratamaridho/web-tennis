'use client';

import React, { useState } from 'react';
import { useAuth, UserProfile } from '@/context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileFormProps {
  user: UserProfile;
  onClose: () => void;
  onSaveSuccess: () => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onClose, onSaveSuccess }) => {
  const [nama, setNama] = useState(user.nama || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [club, setClub] = useState(user.club || '');
  const [ntrpRating, setNtrpRating] = useState(user.ntrpRating || '4.0');
  const [racket, setRacket] = useState(user.racket || '');
  const [hand, setHand] = useState(user.hand || 'Tangan Kanan');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, phone, club, ntrpRating, racket, hand }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil Anda berhasil disimpan!' });
        await onSaveSuccess();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan profil' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi gangguan jaringan saat menyimpan' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
            Nomor WhatsApp / HP
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812xxxxxxxx"
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
            Klub / Asal Komunitas
          </label>
          <input
            type="text"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            placeholder="Contoh: Padang Tennis Club"
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
            NTRP Rating
          </label>
          <select
            value={ntrpRating}
            onChange={(e) => setNtrpRating(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          >
            <option value="2.5">2.5 (Beginner)</option>
            <option value="3.0">3.0 (Intermediate)</option>
            <option value="3.5">3.5 (Solid Intermediate)</option>
            <option value="4.0">4.0 (Advanced)</option>
            <option value="4.5">4.5 (Competitive)</option>
            <option value="5.0">5.0 (Semi-Pro / Pro)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
            Raket Andalan
          </label>
          <input
            type="text"
            value={racket}
            onChange={(e) => setRacket(e.target.value)}
            placeholder="Contoh: Wilson Pro Staff v14"
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
            Tangan Dominan
          </label>
          <select
            value={hand}
            onChange={(e) => setHand(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          >
            <option value="Tangan Kanan">Tangan Kanan</option>
            <option value="Tangan Kiri (Kidal)">Tangan Kiri (Kidal)</option>
          </select>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl"
        >
          Tutup
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#ccff00]/20 disabled:opacity-50"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>
    </form>
  );
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#141822] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ccff00] to-emerald-500 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-[#ccff00]/20">
            {user.nama.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{user.nama}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        <ProfileForm
          key={user.id + user.nama + (user.phone || '')}
          user={user}
          onClose={onClose}
          onSaveSuccess={refreshUser}
        />
      </div>
    </div>
  );
};
