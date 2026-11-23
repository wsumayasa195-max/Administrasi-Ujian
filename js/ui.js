// Helper UI: escape, toast, modal, ikon, tabel berhalaman, grafik SVG
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
function h(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function toast(msg, tipe) { const w = $('#toast'), t = document.createElement('div'); t.className = 'toast ' + (tipe || ''); t.textContent = msg; w.appendChild(t); setTimeout(() => t.remove(), 3800); }
function modal(judul, isi, opt) {
  opt = opt || {}; const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = '<div class="modal ' + (opt.lebar || '') + '"><div class="head"><h2>' + h(judul) + '</h2><button class="btn sm" data-x>✕</button></div><div data-b></div></div>';
  document.body.appendChild(ov); const b = $('[data-b]', ov); if (typeof isi === 'string') b.innerHTML = isi; else b.appendChild(isi);
  const tutup = () => ov.remove(); $('[data-x]', ov).onclick = tutup; ov.addEventListener('mousedown', e => { if (e.target === ov) tutup(); });
  return { el: ov, body: b, tutup };
}
function konfirm(pesan) { return Promise.resolve(window.confirm(pesan)); }
const IK = {
  dash: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z', siswa: 'M12 3 2 8l10 5 10-5zM6 12v4c0 1.5 3 3 6 3s6-1.5 6-3v-4', master: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  jadwal: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', denah: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z', cetak: 'M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 14h10v7H7z',
  absen: 'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11', rekap: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', set: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
  user: 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0', ok: 'M5 13l4 4L19 7', warn: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', print: 'M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 14h10v7H7z', menu: 'M4 6h16M4 12h16M4 18h16'
};
function ico(n, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + (IK[n] || '') + '"/></svg>'; }
function tglPendek(s) { if (!s) return ''; const b = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'], d = new Date(s + 'T00:00:00'); return d.getDate() + ' ' + b[d.getMonth()] + ' ' + d.getFullYear(); }
function hariIndo(s) { return ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][new Date(s + 'T00:00:00').getDay()]; }
function tglPanjang(s) { const b = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'], d = new Date(s + 'T00:00:00'); return hariIndo(s) + ', ' + d.getDate() + ' ' + b[d.getMonth()] + ' ' + d.getFullYear(); }
function angka(n) { return Number(n || 0).toLocaleString('id-ID'); }
function debounce(f, ms) { let t; return function () { const a = arguments, c = this; clearTimeout(t); t = setTimeout(() => f.apply(c, a), ms || 250); }; }
function unduhCSV(nama, baris) { if (!baris.length) return toast('Tidak ada data.', 'err'); const k = Object.keys(baris[0]); const csv = [k.join(',')].concat(baris.map(r => k.map(c => '"' + String(r[c] === undefined ? '' : r[c]).replace(/"/g, '""') + '"').join(','))).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); a.download = nama + '.csv'; a.click(); }
function unduhXLSX(nama, baris) { muatXLSX().then(X => { const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, X.utils.json_to_sheet(baris), 'Data'); X.writeFile(wb, nama + '.xlsx'); }).catch(() => toast('Pustaka Excel gagal dimuat.', 'err')); }
let _xl; function muatXLSX() { if (window.XLSX) return Promise.resolve(window.XLSX); if (_xl) return _xl; _xl = new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = () => ok(window.XLSX); s.onerror = no; document.head.appendChild(s); }); return _xl; }
function bacaBerkas(file) {                                          // CSV atau Excel → array objek
  return new Promise((ok, no) => {
    const nm = file.name.toLowerCase();
    if (/\.xlsx?$/.test(nm)) { muatXLSX().then(X => { const r = new FileReader(); r.onload = e => { const wb = X.read(e.target.result, { type: 'array' }); ok(X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false })); }; r.readAsArrayBuffer(file); }).catch(no); return; }
    const r = new FileReader(); r.onload = e => { const t = String(e.target.result).replace(/^\ufeff/, ''), sep = (t.split('\n')[0].match(/;/g) || []).length > (t.split('\n')[0].match(/,/g) || []).length ? ';' : ',', baris = []; let cur = [], f = '', q = false;
      for (let i = 0; i < t.length; i++) { const c = t[i]; if (q) { if (c === '"' && t[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; } else if (c === '"') q = true; else if (c === sep) { cur.push(f); f = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; cur.push(f); f = ''; if (cur.join('') !== '') baris.push(cur); cur = []; } else f += c; }
      if (f !== '' || cur.length) { cur.push(f); baris.push(cur); } const hd = (baris.shift() || []).map(x => x.trim()); ok(baris.map(b => { const o = {}; hd.forEach((k, i) => o[k] = (b[i] || '').trim()); return o; })); }; r.readAsText(file);
  });
}
// Tabel berhalaman + pencarian client-side
function tabel(el, kolom, data, opt) {
  opt = opt || {}; const per = opt.per || 15; let hal = 1, q = '';
  el.innerHTML = '<div class="tools"><input class="grow" type="text" placeholder="Cari…" data-q></div><div class="tw"><table class="t"><thead><tr>' + kolom.map(k => '<th>' + h(k.t) + '</th>').join('') + '</tr></thead><tbody></tbody></table></div><div class="pg"></div>';
  const tb = $('tbody', el), pg = $('.pg', el);
  function gambar() {
    const f = data.filter(r => !q || kolom.some(k => String(k.v ? k.v(r, true) : r[k.k]).toLowerCase().indexOf(q) > -1)), n = Math.max(1, Math.ceil(f.length / per)); if (hal > n) hal = n;
    tb.innerHTML = f.slice((hal - 1) * per, hal * per).map((r, i) => '<tr data-i="' + data.indexOf(r) + '">' + kolom.map(k => '<td>' + (k.v ? k.v(r) : h(r[k.k])) + '</td>').join('') + '</tr>').join('') || '<tr><td colspan="' + kolom.length + '" class="muted" style="text-align:center;padding:28px">Belum ada data.</td></tr>';
    pg.innerHTML = '<span class="muted small">' + angka(f.length) + ' data</span><button class="btn sm" ' + (hal <= 1 ? 'disabled' : '') + ' data-p="-1">‹</button><span class="num">' + hal + '/' + n + '</span><button class="btn sm" ' + (hal >= n ? 'disabled' : '') + ' data-p="1">›</button>';
    $$('[data-p]', pg).forEach(b => b.onclick = () => { hal += Number(b.dataset.p); gambar(); }); if (opt.aksi) opt.aksi(tb, data);
  }
  $('[data-q]', el).oninput = debounce(e => { q = e.target.value.toLowerCase(); hal = 1; gambar(); }, 200); gambar();
  return { segarkan(d) { if (d) data = d; gambar(); } };
}
// Grafik garis SVG (kehadiran per hari) & donat (kesiapan)
function grafikGaris(data) {
  if (!data.length) return '<p class="muted" style="padding:40px 0;text-align:center">Belum ada data kehadiran.</p>';
  const W = 640, H = 220, pl = 40, pr = 20, pt = 24, pb = 30, mn = Math.min(95, Math.floor(Math.min.apply(null, data.map(d => d.persen)) - 1)), mx = 100;
  const x = i => pl + (data.length === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (data.length - 1)), y = v => pt + (mx - v) * (H - pt - pb) / (mx - mn);
  const pts = data.map((d, i) => x(i) + ',' + y(d.persen)).join(' ');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto"><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563EB" stop-opacity=".25"/><stop offset="1" stop-color="#2563EB" stop-opacity="0"/></linearGradient></defs>'
    + [mx, (mx + mn) / 2, mn].map(v => '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#E2E8F0" stroke-dasharray="4"/><text x="' + (pl - 6) + '" y="' + (y(v) + 4) + '" font-size="10" fill="#64748B" text-anchor="end">' + Math.round(v) + '%</text>').join('')
    + '<polygon points="' + x(0) + ',' + (H - pb) + ' ' + pts + ' ' + x(data.length - 1) + ',' + (H - pb) + '" fill="url(#gg)"/><polyline points="' + pts + '" fill="none" stroke="#2563EB" stroke-width="2.5"/>'
    + data.map((d, i) => '<circle cx="' + x(i) + '" cy="' + y(d.persen) + '" r="4.5" fill="#fff" stroke="#2563EB" stroke-width="2.5"/><text x="' + x(i) + '" y="' + (y(d.persen) - 10) + '" font-size="11" text-anchor="middle" fill="#0F172A">' + d.persen + '%</text><text x="' + x(i) + '" y="' + (H - 8) + '" font-size="10" text-anchor="middle" fill="#64748B">' + tglPendek(d.tanggal).slice(0, 6) + '</text>').join('') + '</svg>';
}
function grafikDonat(a, b, c, total) {
  const R = 54, K = 2 * Math.PI * R, seg = [[a, '#16A34A'], [b, '#F59E0B'], [c, '#EF4444']]; let off = 0;
  return '<svg viewBox="0 0 140 140" width="150" height="150"><circle cx="70" cy="70" r="' + R + '" fill="none" stroke="#E2E8F0" stroke-width="16"/>' + (total ? seg.map(s => { const l = s[0] / total * K, o = '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="' + s[1] + '" stroke-width="16" stroke-dasharray="' + l + ' ' + (K - l) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 70 70)"/>'; off += l; return o; }).join('') : '') + '<text x="70" y="72" text-anchor="middle" font-size="26" font-weight="700" fill="#0F172A">' + total + '</text><text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748B">Total Sesi</text></svg>';
}
