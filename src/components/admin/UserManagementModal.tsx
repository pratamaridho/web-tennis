'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  id: string;
  nama: string;
  email: string;
  role: 'PENGUNJUNG' | 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB';
  aktif: boolean;
  phone?: string | null;
  club?: string | null;
  createdAt: string;
}

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [club, setClub] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
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
    if (isOpen && role === 'ADMIN_WEB') {
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
    }
    return () => {
      active = false;
    };
  }, [isOpen, role]);

  if (!isOpen || role !== 'ADMIN_WEB') return null;

  const handleCreateAdminKomunitas = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, phone, club }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal membuat akun');
      } else {
        setSuccessMsg('Akun Admin Komunitas berhasil dibuat!');
        setNama('');
        setEmail('');
        setPassword('');
        setPhone('');
        setClub('');
        setShowCreateForm(false);
        fetchUsers();
      }
    } catch {
      setErrorMsg('Kesalahan koneksi saat membuat akun');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, aktif: !currentStatus }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch {
      // ignore
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#12161f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                ADMIN WEB SUITE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Kelola Pengguna & Peran Komunitas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              (PRD Story A2) Buat akun Admin Komunitas, atur peran pengguna, dan kelola status aktif/nonaktif.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Button & Messages */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{showCreateForm ? 'Tutup Form' : 'Tambah Admin Komunitas Baru'}</span>
          </button>

          {successMsg && (
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              {successMsg}
            </span>
          )}
          {errorMsg && (
            <span className="text-red-400 text-xs font-semibold bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
              {errorMsg}
            </span>
          )}
        </div>

        {/* Create Admin Komunitas Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateAdminKomunitas}
            className="mb-6 p-5 bg-[#181d28] border border-[#ccff00]/20 rounded-2xl animate-fadeIn space-y-4"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#ccff00]">
              Form Pembuatan Admin Komunitas Baru
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.komunitas@padangtennis.com"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Password (min 8)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Nama Klub / Komunitas</label>
                <input
                  type="text"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="Contoh: Komunitas Tennis Padang"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Admin Komunitas'}
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-[#181d28] sticky top-0 border-b border-white/10 text-gray-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Memuat data pengguna dari database PostgreSQL...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Belum ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.nama}</div>
                      <div className="text-[11px] text-gray-400">{u.email}</div>
                      {u.club && <div className="text-[10px] text-gray-500 mt-0.5">{u.club}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="ADMIN_KOMUNITAS">ADMIN_KOMUNITAS</option>
                        <option value="ADMIN_WEB">ADMIN_WEB</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.aktif
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {u.aktif ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleAktif(u.id, u.aktif)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          u.aktif
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {u.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
