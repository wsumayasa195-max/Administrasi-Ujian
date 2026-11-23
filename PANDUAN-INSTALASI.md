# PANDUAN INSTALASI — Administrasi Ujian SMPN 3 Kediri

Aplikasi terdiri dari dua bagian:

| Bagian | Isi | Tempat |
|---|---|---|
| **Backend** | `Kode.gs`, `Data.gs`, `Cetak.gs`, `Notifikasi.gs`, `appsscript.json` | Google Apps Script (akun Google sekolah) |
| **Frontend** | `ujian-smpn3-frontend.zip` (index.html, css/, js/, ikon, PWA) | GitHub Pages |

> Gunakan **satu akun Google sekolah** untuk semuanya. Jangan menambah editor proyek Apps Script sembarangan: siapa pun yang punya akses *edit* bisa melihat Script Properties (tempat semua rahasia).

---

## A. BACKEND (Google Apps Script)

1. Buka https://script.google.com → **Proyek baru**. Beri nama `Administrasi Ujian SMPN 3`.
2. Di panel kiri, klik ⚙️ **Setelan proyek** → centang **"Tampilkan berkas manifes appsscript.json di editor"**.
3. Buat 4 berkas skrip (tombol **+** → Skrip) bernama `Kode`, `Data`, `Cetak`, `Notifikasi`, lalu tempel isi masing-masing berkas `.gs` yang sama namanya. Hapus isi bawaan `Code.gs`.
4. Buka `appsscript.json` → ganti seluruh isinya dengan berkas `appsscript.json` dari paket ini.
5. Pilih fungsi **`setupAppEnvironment`** di dropdown → ▶ **Jalankan** (cukup sekali; aman diulang karena tidak menimpa data/rahasia).
   - Klik **Tinjau izin** → izinkan akses Drive, Sheets, Docs, Gmail (email).
   - Buka **Log eksekusi**. **Catat kata sandi akses darurat** (muncul sekali):
     ```
     Nama pengguna : darurat
     Kata sandi    : (acak 16 karakter)
     ```
   - Terbentuk otomatis: folder Drive `📁 Administrasi Ujian…` (Arsip PDF, Template, Temp), spreadsheet database 18 sheet, dan trigger antrean notifikasi (1 menit) serta blast (5 menit).
6. **Deploy → Deployment baru → Aplikasi web**
   - *Jalankan sebagai*: **Saya**
   - *Yang memiliki akses*: **Siapa saja**
   - Klik **Deploy** → **salin URL yang berakhiran `/exec`**.
7. Setelah mengubah kode di kemudian hari: **Deploy → Kelola deployment → ✏️ → Versi baru → Deploy** (URL tetap sama).

### Rahasia — otomatis vs diisi manual

| Nilai | Cara | Di mana |
|---|---|---|
| `SESSION_SECRET`, hash sandi darurat, ID spreadsheet/folder | **Otomatis** saat setup | Script Properties |
| `GOOGLE_CLIENT_ID` | Diisi **Super Admin** (masuk akses darurat) → Pengaturan → Keamanan | Script Properties |
| `FONNTE_TOKEN` | Diisi **Super Admin** → Pengaturan → WhatsApp & Notifikasi | Script Properties |

Cadangan manual: Apps Script → ⚙️ Setelan proyek → **Properti skrip** → tambah/ubah.
Tidak ada rahasia di kode, di Google Sheets, maupun di frontend. Sandi darurat **wajib diganti** setelah login pertama (Pengaturan → Keamanan → *Ganti sandi darurat*) karena log eksekusi tersimpan di riwayat Apps Script.
Lupa sandi darurat? Jalankan fungsi `resetAksesDarurat` dari editor.

## B. LOGIN GOOGLE (Client ID)

1. https://console.cloud.google.com → buat proyek → **API & Layanan → Layar persetujuan OAuth** (jenis *Internal* bila memakai Google Workspace sekolah).
2. **Kredensial → Buat kredensial → ID klien OAuth → Aplikasi web.**
3. *Asal JavaScript yang diizinkan*: `https://NAMA-GITHUB.github.io` (tanpa garis miring di akhir).
4. Salin **Client ID** (berakhiran `.apps.googleusercontent.com`) → masuk aplikasi dengan akses darurat → **Pengaturan → Keamanan → Simpan Client ID**.
5. Pengguna masuk dengan email yang cocok dengan sheet **Guru** (peran Admin/Pengawas/Kepala Sekolah) atau sheet **Siswa** (kolom Email). Email yang tidak terdaftar ditolak.

## C. FRONTEND (GitHub Pages)

**Folder kerja = isi ZIP.** Ekstrak `ujian-smpn3-frontend.zip` sehingga `index.html` langsung ada di folder hasil ekstrak. **Folder itulah** yang di-`git init` (bukan folder di atasnya).

```
ujian-smpn3-frontend/        ← folder ini yang di-git init
├── index.html
├── manifest.json
├── sw.js
├── README.md
├── PANDUAN-INSTALASI.md
├── css/style.css
├── js/ (config.js, api.js, ui.js, app.js, pages.js, pages2.js)
└── icons/ (icon-192.png, icon-512.png)
```

1. **Isi dulu** `js/config.js`: ganti `GANTI_DENGAN_ID_DEPLOYMENT` dengan URL `/exec` Anda (seluruh URL).
2. Buat repository kosong di GitHub (mis. `ujian-smpn3`), **Public**.
3. Di terminal, masuk ke folder hasil ekstrak, lalu:
   ```bash
   git init
   git add .
   git commit -m "Versi pertama"
   git branch -M main
   git remote add origin https://github.com/NAMA-GITHUB/ujian-smpn3.git
   git push -u origin main
   ```
   Saat diminta password, gunakan **Personal Access Token** (bukan password akun). Tidak ada huruf yang tampil saat mengetik — itu normal.
4. GitHub → repo → **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**. Tunggu 1–2 menit, situs tampil di `https://NAMA-GITHUB.github.io/ujian-smpn3/`.
5. Isi **Pengaturan → Sekolah → "Alamat situs ini"** dengan alamat di atas agar QR dokumen mengarah ke halaman verifikasi.
6. Update di kemudian hari: ubah berkas → `git add .` → `git commit -m "Update"` → `git push`.

> Jangan unggah lewat tombol "Upload files" di web GitHub — struktur folder bisa rusak (CSS/JS menjadi 404).

## D. PWA (pasang di ponsel)

Buka situs di Chrome Android → menu ⋮ → **Pasang aplikasi**. iPhone: Safari → Bagikan → **Tambahkan ke Layar Utama**. Panggilan ke server tidak di-cache; berkas tampilan tetap bisa dibuka cepat.

## E. LANGKAH PERTAMA SETELAH TERPASANG

1. Masuk **akses darurat** → ganti sandi darurat → isi Client ID Google.
2. **Pengaturan → Sekolah**: nama, kepala sekolah, tahun ajaran, alamat situs.
3. **Data Siswa & Guru → Impor** (CSV/Excel; ada tombol *Unduh template*; gunakan *Pindai* dulu). Isi peran guru: `Admin`, `Pengawas`, atau `Kepala Sekolah`.
4. **Master Data**: mata pelajaran dan ruang (baris × kolom kursi).
5. **Penyusun Jadwal**: sistem menolak bentrok pengawas, ruang ganda, dan kapasitas kurang.
6. **Penempatan & Denah → Jalankan** (acak/berurutan), tukar posisi bila perlu.
7. **Pusat Cetak**: pratinjau → *Buat PDF & arsipkan* (PDF tersimpan di Drive per tahun ajaran).
8. **Pengaturan → WhatsApp**: saklar WA/Email, matriks kejadian, token Fonnte, blast per batch 10/20/50. **CRM Kontak** → *Sinkron dari Siswa & Guru*.
9. **Pengaturan → Template Dokumen**: rancang surat di Google Docs dengan penanda `{{NAMA}}`, `{{KELAS}}`, `{{NOMOR}}`, `{{TANGGAL}}`, atau penanda bebas; pindai, simpan, lalu *Terbitkan* atau *Massal siswa*.

## F. Migrasi data lama (bila ada)

Impor Excel/CSV bersifat aman diulang (kunci NIS/NIP/Kode): impor kedua tidak menggandakan data, dan *Pindai* tidak menulis apa pun. Untuk memindah dari spreadsheet lama, ekspor sheet ke CSV lalu impor per jenis (siswa, guru, mapel, ruang). Sesi login tidak ikut pindah — pengguna cukup masuk ulang.

## G. Batasan & catatan jujur

- Kuota Google (6 menit/eksekusi, pembuatan PDF harian): cetak massal dibagi **50 halaman per proses**; PDF yang sudah jadi tersimpan di Drive.
- Kartu/label memuat QR dari layanan api.qrserver.com (butuh internet saat PDF dibuat); bila gagal, dokumen tetap terbit dengan kode teks.
- Foto siswa pada kartu (seperti di desain referensi) belum disertakan; dapat ditambah lewat modul Template Dokumen atau iterasi berikutnya.
- Cek nomor WA butuh paket Fonnte yang mendukung *validate*; blast tetap bisa tanpa itu.
- QR/eTTD memverifikasi **keaslian dokumen terbit**; ini bukan tanda tangan elektronik tersertifikasi.
- Hari pertama: jalankan **uji coba lapangan** satu kelas sebelum ujian resmi (tahap uji PRD #8).
