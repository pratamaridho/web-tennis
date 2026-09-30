# Rule: Tennis Club Prototype PRD Guidelines

Seluruh pengembangan fitur, komponen UI, modul logika, dan validasi data harus mengacu pada spesifikasi di prd.md:

## 1. Role & Hak Akses
- **Pengunjung (Guest):** Akses publik read-only ke info klub, berita, turnamen, bagan/bracket, dan hasil juara tanpa login.
- **Member:** Pendaftaran mandiri (tanpa approval admin), akses profil pribadi, pendaftaran turnamen, dan pemantauan status registrasi.
- **Admin Komunitas:** Manajemen turnamen, verifikasi peserta (approve/reject kuota), input skor pertandingan, kurasi berita, dan data member.
- **Admin Web:** Manajemen akun admin, peran hak akses, dan konfigurasi teknis sistem.

## 2. Batasan Scope Pengembangan
- **P0 (Prioritas Saat Ini / Prototype):**
  - Alur turnamen end-to-end (Draft -> Pendaftaran Dibuka -> Berlangsung -> Selesai).
  - Pendaftaran & verifikasi peserta oleh admin komunitas.
  - Bracket otomatis:
    - Format Knockout (dengan penanganan otomatis bye untuk jumlah peserta ganjil).
    - Format Round-Robin (dengan tabel klasemen otomatis).
  - Kategori tunggal (Single umum).
  - Input skor akhir per pertandingan & publikasi juara ke halaman publik.
- **P1 (Tahap Berikutnya):** Turnamen ganda (Double), leaderboard/ranking global, galeri foto, jadwal latihan/mabar, riwayat tanding member.
- **P2:** Integrasi payment gateway online, reservasi lapangan, notifikasi email/WhatsApp.
- **Out of Scope:** Mobile app native, live streaming realtime scoring point-by-point, marketplace merchandise.

## 3. Invarian Bisnis Turnamen & Pendaftaran
- **Pendaftaran Peserta**:
  - Hanya member yang sudah login yang bisa mendaftar.
  - Pendaftaran hanya bisa dilakukan jika status turnamen adalah `PENDAFTARAN_DIBUKA`, kuota peserta diterima belum penuh, dan belum melewati tanggal batas daftar.
  - Satu member hanya bisa mendaftar satu kali per turnamen.
- **Visibilitas Publik & Status**:
  - Pengunjung tanpa login dapat melihat semua turnamen non-DRAFT (`PENDAFTARAN_DIBUKA`, `BERLANGSUNG`, `SELESAI`) beserta bracket, skor, dan juara.
  - Member dapat melihat status pendaftarannya (`MENUNGGU`, `DITERIMA`, `DITOLAK`) di halaman Turnamen Saya (cukup ter-update saat halaman/data dimuat ulang, tanpa overhead WebSocket realtime).
- **Alur & Kunci Status**:
  - Status turnamen berjalan: `DRAFT` → `PENDAFTARAN_DIBUKA` → `BERLANGSUNG` → `SELESAI`.
  - Turnamen hanya bisa diedit selama belum berstatus `BERLANGSUNG`.
  - Verifikasi pendaftar oleh Admin Komunitas: jumlah peserta dengan status `DITERIMA` tidak boleh melebihi kuota.
  - Bracket dikunci otomatis segera setelah skor pertama diinput.
  - Propagasi pemenang babak knockout otomatis mengisi slot babak berikutnya.
  - Turnamen otomatis berstatus 'SELESAI' saat semua pertandingan final/putaran memiliki skor dan pemenang.
  - Peserta yang mundur setelah bracket dibuat ditangani lewat walk-over manual oleh admin.

