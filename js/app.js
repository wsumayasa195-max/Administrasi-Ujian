// Shell aplikasi: login (Google + akses darurat), menu per peran, router hash, dashboard, verifikasi publik
const MENU = {
  dashboard: { t: 'Dashboard', i: 'dash', r: ['admin','superadmin','pengawas','kepsek'] },
  beranda:   { t: 'Beranda Saya', i: 'dash', r: ['siswa'] },
  data:      { t: 'Data Siswa & Guru', i: 'siswa', r: ['admin','superadmin'] },
  master:    { t: 'Master Data', i: 'master', r: ['admin','superadmin'] },
  jadwal:    { t: 'Penyusun Jadwal', i: 'jadwal', r: ['admin','superadmin','pengawas','kepsek','siswa'] },
  denah:     { t: 'Penempatan & Denah', i: 'denah', r: ['admin','superadmin','kepsek'] },
  cetak:     { t: 'Pusat Cetak', i: 'cetak', r: ['admin','superadmin','pengawas','kepsek'] },
  absensi:   { t: 'Absensi & Berita Acara', i: 'absen', r: ['admin','superadmin','pengawas'] },
  rekap:     { t: 'Rekap & Arsip', i: 'rekap', r: ['admin','superadmin','kepsek'] },
  pengaturan:{ t: 'Pengaturan', i: 'set', r: ['admin','superadmin'] }
};
const App = { me: null, boot: null, halaman: {} };
const ROLE_LABEL = { admin: 'Admin Panitia', superadmin: 'Super Admin', pengawas: 'Guru / Pengawas', kepsek: 'Kepala Sekolah', siswa: 'Siswa' };

async function mulai() {
  if (/^#verifikasi-/.test(location.hash)) return halamanVerifikasi(location.hash.replace('#verifikasi-', ''));
  if (!konfigOk()) return tampilLogin('Konfigurasi belum lengkap: buka js/config.js dan isi GAS_URL dengan URL /exec dari Apps Script.');
  if (Sesi.token) { const r = await api('boot'); if (r.success) { App.me = r.data.me; App.boot = r.data; return bangunShell(); } }
  tampilLogin();
}
function tampilLogin(pesan) {
  $('#root').innerHTML = '<div class="login"><div class="box"><div style="text-align:center;margin-bottom:20px"><div class="brand" style="justify-content:center;border:0"><div class="logo" style="background:#0F2B5B;color:#fff">S3</div></div><h2 style="margin-top:8px">Administrasi Ujian</h2><p class="muted" style="margin:4px 0 0">SMP Negeri 3 Kediri</p></div>'
    + (pesan ? '<div class="alert warn" style="margin-bottom:14px">' + h(pesan) + '</div>' : '')
    + '<div id="gbtn" style="display:flex;justify-content:center;min-height:44px"></div><p class="muted small" style="text-align:center">Masuk dengan akun Google yang terdaftar di sekolah.</p>'
    + '<details style="margin-top:14px"><summary class="muted small" style="cursor:pointer">Akses darurat (admin)</summary><div style="margin-top:10px"><div class="fg"><input type="text" id="du" placeholder="Nama pengguna" autocomplete="off"></div><div class="fg"><input type="password" id="dp" placeholder="Kata sandi" autocomplete="off"></div><button class="btn n" style="width:100%" id="bdr">Masuk</button></div></details></div></div>';
  $('#bdr').onclick = async () => { const r = await api('auth.darurat', { username: $('#du').value.trim(), password: $('#dp').value }); $('#dp').value = ''; if (!r.success) return toast(r.message, 'err'); masuk(r.data); };
  initGoogle();
}
async function initGoogle() {
  if (!konfigOk()) return; const c = await api('auth.config', {}, { diam: true });
  if (!c.success || !c.data.googleClientId) { $('#gbtn').innerHTML = '<span class="muted small">Login Google belum dikonfigurasi. Gunakan akses darurat.</span>'; return; }
  const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
  s.onload = () => { google.accounts.id.initialize({ client_id: c.data.googleClientId, callback: async resp => { const r = await api('auth.google', { idToken: resp.credential }); if (!r.success) return toast(r.message, 'err'); masuk(r.data); } }); google.accounts.id.renderButton($('#gbtn'), { theme: 'outline', size: 'large', text: 'signin_with', locale: 'id', width: 300 }); };
  document.head.appendChild(s);
}
async function masuk(d) { Sesi.set(d.token, d.me); App.me = d.me; const r = await api('boot'); App.boot = r.success ? r.data : { sekolah: {}, pengumuman: [] }; bangunShell(); }
function keluar() { Sesi.hapus(); App.me = null; location.hash = ''; tampilLogin(); }

function bangunShell() {
  const me = App.me, sk = (App.boot && App.boot.sekolah) || {}, items = Object.keys(MENU).filter(k => MENU[k].r.indexOf(me.role) > -1);
  $('#root').innerHTML = '<div id="app"><aside class="sidebar" id="sb"><div class="brand"><div class="logo">S3</div><div><b>SMPN 3 Kediri</b><small>Sistem Administrasi Ujian</small></div></div><nav class="nav">'
    + items.map(k => '<a data-m="' + k + '" href="#' + k + '">' + ico(MENU[k].i) + '<span>' + MENU[k].t + '</span></a>').join('') + '</nav><div class="sb-foot">Ujian Server Online v1.0</div></aside>'
    + '<div class="main"><header class="topbar"><button class="burger" id="bg">' + ico('menu', 24) + '</button><div class="search"><input type="text" placeholder="Cari siswa, pengawas, ruang…" id="gs"></div><span class="chip">TA ' + h(sk.ta || '') + ' ' + h(sk.semester || '') + '</span>'
    + '<div class="profil"><div class="avatar">' + h((me.nama || '?')[0]) + '</div><div><b>' + h(me.nama) + '</b><br><small class="muted">' + h(ROLE_LABEL[me.role] || me.role) + '</small></div><button class="btn sm" id="kl">Keluar</button></div></header><main class="page" id="isi"></main></div></div>';
  $('#bg').onclick = () => $('#sb').classList.toggle('buka');
  $('#kl').onclick = keluar;
  $('#gs').onkeydown = e => { if (e.key === 'Enter' && e.target.value.trim()) { App.cari = e.target.value.trim(); location.hash = me.role === 'admin' || me.role === 'superadmin' ? '#data' : '#jadwal'; } };
  window.onhashchange = rute; rute();
}
async function rute() {
  const me = App.me; if (!me) return; let k = (location.hash || '').replace('#', '').split('?')[0];
  const ok = Object.keys(MENU).filter(x => MENU[x].r.indexOf(me.role) > -1); if (ok.indexOf(k) === -1) k = ok[0];
  $$('.nav a').forEach(a => a.classList.toggle('aktif', a.dataset.m === k)); $('#sb').classList.remove('buka');
  const el = $('#isi'); el.innerHTML = '<div class="card"><div class="skel" style="width:40%"></div><div class="skel"></div><div class="skel" style="width:70%"></div></div>';
  try { await App.halaman[k](el); } catch (e) { console.error(e); el.innerHTML = '<div class="alert">Halaman gagal dimuat: ' + h(e.message) + '</div>'; }
}
function judul(t, sub, aksi) { return '<div class="head"><div><h1>' + h(t) + '</h1>' + (sub ? '<p class="muted" style="margin:4px 0 0">' + h(sub) + '</p>' : '') + '</div><div class="tools" style="margin:0">' + (aksi || '') + '</div></div>'; }
function badgeStatus(s) { const m = { Hadir: 'ok', Izin: 'wait', Sakit: 'wait', Alpa: 'no', Terkirim: 'ok', Gagal: 'no', Antri: 'wait', Berjalan: 'info', Selesai: 'ok', Terbit: 'ok' }; return '<span class="badge b-' + (m[s] || 'mut') + '">' + h(s || '-') + '</span>'; }

// ---------------- Dashboard ----------------
App.halaman.dashboard = async function (el) {
  const r = await api('dashboard'); if (!r.success) return el.innerHTML = '<div class="alert">' + h(r.message) + '</div>';
  const d = r.data, sk = App.boot.sekolah || {}, adm = App.me.role === 'admin' || App.me.role === 'superadmin', rata = d.grafikKehadiran.length ? (d.grafikKehadiran.reduce((a, b) => a + b.persen, 0) / d.grafikKehadiran.length).toFixed(2) : '–';
  const stat = (cls, lab, val, ikon, kiri, tuju) => '<div class="stat ' + cls + '"><div class="row"><div><div class="lab">' + lab + '</div><div class="val" style="color:var(--text)">' + val + '</div></div><div class="ic">' + ico(ikon, 22) + '</div></div><div class="ft"><span>' + kiri + '</span><a href="#' + tuju + '">Lihat detail →</a></div></div>';
  el.innerHTML = '<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px"><div><h2>' + h(sk.ujian || 'Ujian') + ' <span class="badge b-ok">Aktif</span></h2><p class="muted" style="margin:4px 0 0">Pusat Kendali Administrasi & Rekapitulasi Berkas ' + h(sk.nama) + '</p></div><div class="tools" style="margin:0">' + (adm ? '<a class="btn p" href="#denah">' + ico('ok') + 'Verifikasi Ruang</a>' : '') + '</div></div>'
    + '<div class="grid g4" style="margin-bottom:24px">' + stat('s-biru', 'Peserta Ujian', angka(d.peserta), 'user', 'Kelas VII, VIII, IX', 'data') + stat('s-hijau', 'Pengawas Terjadwal', angka(d.pengawasTerjadwal), 'ok', d.pengawasTotal ? Math.round(d.pengawasTerjadwal / d.pengawasTotal * 100) + '% dialokasikan' : '–', 'jadwal')
    + stat('s-ungu', 'Tingkat Kehadiran', d.kehadiran === null ? '–' : d.kehadiran + '%', 'absen', 'Hari ke-' + d.grafikKehadiran.length + ' Ujian', 'rekap') + stat('s-kuning', 'Kesiapan Ujian', d.kesiapan + '%', 'ok', d.bentrok ? d.bentrok + ' sesi perlu verifikasi' : 'Semua sesi aman', 'jadwal') + '</div>'
    + '<div class="grid g32"><div class="card"><div class="head"><div><h3>Kehadiran per Hari Ujian</h3><p class="muted small" style="margin:2px 0 0">Monitoring presensi harian seluruh peserta didik</p></div></div>' + grafikGaris(d.grafikKehadiran) + '<p class="small"><span style="color:#2563EB">●</span> Rata-rata Kehadiran: <b>' + rata + (rata === '–' ? '' : '%') + '</b></p></div>'
    + '<div class="card"><div class="head"><h3>Pengumuman Panitia</h3>' + (adm ? '<button class="btn sm" id="bp">+ Baru</button>' : '') + '</div>' + (d.pengumuman.length ? d.pengumuman.map(p => '<div style="background:var(--canvas);border-radius:10px;padding:12px;margin-bottom:10px"><b>' + h(p.Judul) + '</b> <span class="muted small" style="float:right">' + tglPendek(p.Tanggal) + '</span><div class="muted small">' + h(String(p.Isi).slice(0, 110)) + '</div></div>').join('') : '<p class="muted">Belum ada pengumuman.</p>') + '</div></div>'
    + '<div class="grid g2"><div class="card"><div class="head"><div><h3>Status Kesiapan Jadwal</h3><p class="muted small" style="margin:2px 0 0">Total alokasi sesi ruang & ketersediaan pengawas</p></div></div><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">' + grafikDonat(d.sesiAman, d.menungguPengawas, d.bentrok, d.totalSesi)
    + '<div style="flex:1;min-width:160px"><p><span style="color:#16A34A">●</span> Sesi Terjadwal <b class="num" style="float:right;color:#16A34A">' + d.sesiAman + '</b></p><p><span style="color:#F59E0B">●</span> Menunggu Pengawas <b class="num" style="float:right;color:#B45309">' + d.menungguPengawas + '</b></p><p><span style="color:#EF4444">●</span> Bentrok / Konflik <b class="num" style="float:right;color:#EF4444">' + d.bentrok + '</b></p></div></div></div>'
    + '<div class="card"><div class="head"><div><h3>Jadwal Ujian Terdekat</h3><p class="muted small" style="margin:2px 0 0">Distribusi ruang dan status pelaksanaan</p></div><a class="btn n sm" href="#cetak">' + ico('print', 16) + 'Pusat Cetak</a></div>'
    + (d.mendatang.length ? d.mendatang.map(j => '<div style="background:var(--canvas);border-radius:10px;padding:12px;margin-bottom:10px;display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap"><div><b>' + h(j.Mapel) + '</b> <span class="badge b-info">Kelas ' + h(j.Tingkat) + '</span><div class="muted small">' + tglPendek(j.Tanggal) + ' · ' + h(j.Jam) + ' · Ruang ' + h(j.Ruang) + '</div></div>' + (j.Masalah.length ? '<span class="badge b-no">Bentrok</span>' : '<span class="badge b-ok">Aman</span>') + '</div>').join('') : '<p class="muted">Belum ada jadwal mendatang.</p>') + '</div></div>';
  const bp = $('#bp'); if (bp) bp.onclick = () => formPengumuman();
};
function formPengumuman() {
  const m = modal('Buat Pengumuman', '<div class="fg"><label>Judul</label><input type="text" id="pj"></div><div class="fg"><label>Isi</label><textarea id="pi"></textarea></div><button class="btn p" id="ps">Simpan</button>');
  $('#ps', m.el).onclick = async () => { const r = await apiTulis('pengumuman.simpan', { data: { Judul: $('#pj', m.el).value.trim(), Isi: $('#pi', m.el).value.trim() } }); if (!r.success) return toast(r.message, 'err'); toast('Pengumuman tersimpan.', 'ok'); m.tutup(); rute(); };
}

// ---------------- Verifikasi publik (QR) ----------------
async function halamanVerifikasi(kode) {
  $('#root').innerHTML = '<div class="login"><div class="box" style="text-align:center"><h2>Verifikasi Dokumen</h2><p class="muted">Memeriksa kode ' + h(kode) + '…</p><div id="vh"></div></div></div>';
  const r = await api('verifikasi.cek', { kode: kode }); const v = r.data;
  $('#vh').innerHTML = !r.success ? '<div class="alert">' + h(r.message) + '</div>' : v.valid ? '<div class="alert ok" style="display:block"><b>✔ Dokumen sah</b><br>' + h(v.sekolah) + '<br>Jenis: ' + h(v.jenis) + (v.nomor ? '<br>Nomor: ' + h(v.nomor) : '') + '<br>Diterbitkan: ' + h(v.dibuat) + '</div>' : '<div class="alert">Dokumen tidak ditemukan atau sudah ditarik.</div>';
}
