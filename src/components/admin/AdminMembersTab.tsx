'use client';

import React, { useState, useEffect } from 'react';

interface MemberData {
  id: string;
  nama: string;
  email: string;
  role: string;
  aktif: boolean;
  phone?: string | null;
  club?: string | null;
  ntrpRating?: string | null;
  racket?: string | null;
  hand?: string | null;
  createdAt: string;
}

export const AdminMembersTab: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/users?role=MEMBER')
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => {
        if (active) {
          setMembers(data.users || []);
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

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.nama.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.club && m.club.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#141822] border border-white/10 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              PRD F1
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              DATABASE ANGGOTA
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Daftar Member Komunitas
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Pantau atlet & member terdaftar, klub asal, serta level rating kemampuan (NTRP).
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, klub..."
            className="w-full sm:w-64 px-3.5 py-2.5 bg-[#0d1017] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 bg-[#12161f] border border-white/5 rounded-3xl">
          <div className="inline-block w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Memuat daftar anggota klub...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-[#12161f] border border-white/5 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 mx-auto flex items-center justify-center text-xl mb-3">
            👥
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Tidak Ada Member Ditemukan</h3>
          <p className="text-gray-400 text-xs">
            {searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada member yang terdaftar.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#12161f] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141822] text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Nama & Akun</th>
                  <th className="py-3 px-4">Kontak (WA)</th>
                  <th className="py-3 px-4">Klub Asal</th>
                  <th className="py-3 px-4 text-center">NTRP</th>
                  <th className="py-3 px-4 text-center">Tangan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">{m.nama}</div>
                      <div className="text-[11px] text-gray-400">{m.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {m.phone || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {m.club || <span className="text-gray-500 italic">Independen</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-[#ccff00]/15 text-[#ccff00] font-bold text-[10px]">
                        {m.ntrpRating || '3.5'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-400 text-[11px]">
                      {m.hand || 'Kanan'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.aktif
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {m.aktif ? 'AKTIF' : 'NON-AKTIF'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
