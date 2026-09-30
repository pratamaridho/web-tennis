# PRD: Website Tennis Club (Prototype)

**Versi:** 1.0
**Status:** Draft untuk prototype
**Jenis proyek:** Klien tertentu, tahap prototype

---

## 1. Ringkasan

Website klub tenis dengan fitur turnamen sebagai pembeda utama. Tujuan prototype adalah menunjukkan ke klien bahwa alur turnamen berjalan end-to-end: dari pembuatan turnamen, pendaftaran, pembuatan bracket, input skor, sampai juara tampil di halaman publik.

## 2. Keputusan yang Sudah Dikunci

- Ada 4 role: pengunjung, member, admin komunitas (operasional), admin web (teknis/sistem).
- Member mendaftar sendiri, tanpa persetujuan admin.
- Hanya member yang bisa mengikuti turnamen. Non-member harus membuat akun terlebih dahulu.
- Format turnamen dipilih admin: **knockout** atau **round-robin**.
- MVP hanya **single**. Double (pasangan) masuk P1.
- Satu kategori peserta: **umum**. Satu kategori per turnamen.

## 3. Role

| Role | Tugas utama |
|---|---|
| Pengunjung | Melihat info klub, berita, turnamen, bracket, dan hasil tanpa login |
| Member | Daftar sendiri, login, kelola profil, daftar turnamen, lihat status pendaftaran |
| Admin komunitas | Operasional klub: kelola turnamen, verifikasi peserta, input skor, kelola berita dan member |
| Admin web | Teknis/sistem: kelola akun admin, hak akses, pengaturan |

## 4. Scope

| Prioritas | Fitur |
|---|---|
| **P0 (prototype)** | Website klub (beranda, tentang, berita, kontak), registrasi/login, profil member, CRUD turnamen, pendaftaran turnamen, verifikasi peserta, bracket/jadwal otomatis, input skor, hasil publik, kelola akun admin |
| **P1** | Turnamen double, leaderboard/ranking, galeri foto, jadwal latihan/event, riwayat pertandingan member |
| **P2** | Pembayaran online, booking lapangan, notifikasi email/WA |

**Di luar cakupan:** aplikasi mobile native, live scoring real-time, chat antar member, marketplace/merchandise.

## 5. Sitemap

**Publik:** Beranda · Tentang Klub · Berita · Turnamen (daftar, detail, bracket/klasemen, hasil) · Login/Daftar

**Member:** Profil · Turnamen Saya

**Admin komunitas:** Dashboard · Kelola Turnamen · Kelola Peserta · Input Skor · Kelola Berita · Kelola Member

**Admin web:** Kelola Admin · Pengaturan

## 6. Matriks Fitur per Role (P0)

| Fitur | Pengunjung | Member | Admin Komunitas | Admin Web |
|---|---|---|---|---|
| Beranda, profil klub, kontak | Lihat | Lihat | Kelola | Kelola |
| Berita/pengumuman | Lihat | Lihat | Kelola | Kelola |
| Daftar & detail turnamen | Lihat | Lihat | Buat/edit | Kelola |
| Bracket, skor, hasil | Lihat | Lihat | Input skor | Kelola |
| Registrasi & login | Daftar | Login | Login | Login |
| Daftar ke turnamen | - | Daftar | Verifikasi/tolak | Kelola |
| Profil member | - | Edit sendiri | Kelola member | Kelola |
| Akun & hak akses admin | - | - | - | Penuh |

## 7. User Story & Acceptance Criteria (P0)

### A. Akun

**A1. Sebagai pengunjung, saya bisa daftar dengan nama, email, dan password, lalu langsung login sebagai member.**
- Email harus unik.
- Password minimal 8 karakter.
- Setelah daftar, pengguna langsung masuk ke dashboard member.

**A2. Sebagai admin web, saya bisa membuat dan menonaktifkan akun admin komunitas.**
- Hanya admin web yang melihat menu ini.

### B. Turnamen (admin komunitas)

**B1. Saya bisa membuat turnamen** dengan data: nama, deskripsi, tanggal, lokasi, kuota, batas daftar, aturan, dan format (knockout/round-robin).
- Status turnamen berjalan: Draft → Pendaftaran Dibuka → Berlangsung → Selesai.
- Hanya turnamen berstatus Pendaftaran Dibuka yang bisa didaftari.

**B2. Saya bisa mengedit turnamen** selama belum berstatus Berlangsung.

### C. Pendaftaran

**C1. Sebagai member, saya bisa mendaftar ke turnamen yang dibuka.**
- Tombol daftar hanya muncul jika sudah login, kuota belum penuh, dan belum lewat batas daftar.
- Satu member hanya bisa mendaftar satu kali per turnamen.

**C2. Sebagai member, saya bisa melihat status pendaftaran** (Menunggu / Diterima / Ditolak).

**C3. Sebagai admin komunitas, saya bisa menerima atau menolak pendaftar.**
- Jumlah peserta Diterima tidak boleh melebihi kuota.

### D. Bracket & Skor

**D1. Sebagai admin, saya bisa menutup pendaftaran dan meng-generate bracket.**
- Knockout: bagan per babak. Jika peserta ganjil, sebagian peserta mendapat bye.
- Round-robin: semua pasangan pertandingan dibuat, plus tabel klasemen.
- Bracket terkunci setelah skor pertama diinput.

**D2. Sebagai admin, saya bisa menginput skor per pertandingan.**
- Knockout: pemenang otomatis maju ke babak berikutnya.
- Round-robin: klasemen otomatis ter-update (menang, kalah, poin).

**D3. Turnamen otomatis berstatus Selesai dan juara ditampilkan** setelah semua pertandingan berskor.

### E. Hasil Publik

**E1. Sebagai pengunjung, saya bisa melihat** daftar turnamen, bracket/klasemen, skor, dan juara tanpa login.

### F. Konten

**F1. Sebagai admin komunitas, saya bisa CRUD berita** dan mengelola daftar member.

## 8. Aturan Bisnis

- Hanya member yang login yang bisa mendaftar turnamen.
- Pendaftaran ditutup otomatis setelah batas tanggal atau kuota penuh.
- Bracket dikunci setelah skor pertama diinput.
- Skor cukup skor akhir per pertandingan (belum per set/game).
- Peserta yang mundur setelah bracket jadi ditangani lewat walk-over manual oleh admin.

## 9. Model Data (Garis Besar)

| Tabel | Kolom utama |
|---|---|
| `users` | id, nama, email, password, role, aktif |
| `tournaments` | id, nama, deskripsi, tanggal, lokasi, kuota, batas_daftar, aturan, format, status, juara_id |
| `registrations` | id, tournament_id, user_id, status |
| `matches` | id, tournament_id, ronde, urutan, player1_id, player2_id, skor, winner_id |
| `news` | id, judul, isi, tanggal, penulis_id |

## 10. Alur Inti (Harus Jalan di Prototype)

Admin membuat turnamen (pilih format) → member mendaftar → admin menerima → sistem membuat bracket → admin input skor → pengunjung melihat hasil dan juara.

## 11. Urutan Pengerjaan yang Disarankan

1. Auth dan role
2. CRUD turnamen
3. Pendaftaran dan verifikasi peserta
4. Generate bracket (knockout dulu, round-robin menyusul)
5. Input skor dan hasil publik
6. Website klub dan berita

Generate bracket dan propagasi pemenang adalah bagian paling berisiko, jadi dikerjakan lebih awal agar masalah cepat ketahuan.

## 12. Tahap Berikutnya

- **P1:** turnamen double, leaderboard, galeri, jadwal latihan, riwayat pertandingan.
- **P2:** pembayaran online, booking lapangan, notifikasi email/WA.
