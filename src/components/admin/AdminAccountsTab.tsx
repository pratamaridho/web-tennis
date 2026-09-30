'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface UserAccount {
  id: string;
  nama: string;
  email: string;
  role: 'PENGUNJUNG' | 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB';
  aktif: boolean;
  phone?: string | null;
  club?: string | null;
  createdAt: string;
}

export const AdminAccountsTab: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [club, setClub] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/users')
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => {
        if (active) {
          setUsers(data.users || []);
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

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, phone, club }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Gagal membuat akun' });
      } else {
        setFeedback({ type: 'success', message: 'Akun Admin Komunitas berhasil dibuat!' });
        setTimeout(() => {
          setShowCreateModal(false);
          setNama('');
          setEmail('');
          setPassword('');
          setPhone('');
          setClub('');
          fetchAccounts();
        }, 1200);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Gangguan koneksi ke server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetUser: UserAccount) => {
    if (targetUser.id === currentUser?.id) {
      alert('Proteksi Keamanan: Anda tidak dapat menonaktifkan akun Anda sendiri!');
      return;
    }

    const actionText = targetUser.aktif ? 'menonaktifkan' : 'mengaktifkan';
    if (!window.confirm(`Yakin ingin ${actionText} akun ${targetUser.nama}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aktif: !targetUser.aktif }),
      });

      if (res.ok) {
        fetchAccounts();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal mengubah status akun');
      }
    } catch {
      alert('Terjadi kesalahan saat memproses');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#141822] border border-white/10 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              PRD A2 • KHUSUS ADMIN WEB
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              KEAMANAN & AKSES
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Kelola Akun Admin & Hak Akses
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Buat akun Admin Komunitas baru dan kendalikan status aktif/non-aktif seluruh pengguna.
          </p>
        </div>

        <button
          onClick={() => {
            setFeedback(null);
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Buat Admin Komunitas</span>
        </button>
      </div>

      {/* Accounts Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 bg-[#12161f] border border-white/5 rounded-3xl">
          <div className="inline-block w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Memuat data akun sistem...</p>
        </div>
      ) : (
        <div className="bg-[#12161f] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141822] text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Nama & Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Klub / Kontak</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Status (PRD A2)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const roleBadgeStyles: Record<string, string> = {
                    ADMIN_WEB: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                    ADMIN_KOMUNITAS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    MEMBER: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    PENGUNJUNG: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                  };

                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{u.nama}</span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/30 text-purple-300 font-bold">
                              ANDA
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            roleBadgeStyles[u.role] || 'bg-white/5 text-gray-300'
                          }`}
                        >
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-[11px]">
                        <div>{u.club || '-'}</div>
                        <div className="text-[10px] text-gray-500">{u.phone || ''}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.aktif
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {u.aktif ? 'AKTIF' : 'NON-AKTIF'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isSelf ? (
                          <span className="text-[11px] text-gray-500 italic">
                            Akun Aktif (Self)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              u.aktif
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {u.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Admin Komunitas Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#12161f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  PRD A2 • KHUSUS ADMIN WEB
                </span>
                <h3 className="text-lg font-bold text-white">Buat Akun Admin Komunitas</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-4 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Budi Prakoso"
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Alamat Email (Unik) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.komunitas@tennisclub.com"
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Password (Minimal 8 Karakter) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Asal Klub (Opsional)
                  </label>
                  <input
                    type="text"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    placeholder="Tennis Club Serpong"
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  {isSubmitting ? 'Memproses...' : 'Buat Akun Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
