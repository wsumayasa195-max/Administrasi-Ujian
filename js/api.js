// Lapisan API: fetch POST text/plain (tanpa preflight CORS), token sesi di body, cache baca ringan
const Sesi = {
  get token() { try { return localStorage.getItem('ujian_token') || ''; } catch (e) { return ''; } },
  set(t, me) { try { localStorage.setItem('ujian_token', t); localStorage.setItem('ujian_me', JSON.stringify(me)); } catch (e) {} },
  get me() { try { return JSON.parse(localStorage.getItem('ujian_me') || 'null'); } catch (e) { return null; } },
  hapus() { try { localStorage.removeItem('ujian_token'); localStorage.removeItem('ujian_me'); } catch (e) {} }
};
let _ld = 0;
function loading(on) { _ld = Math.max(0, _ld + (on ? 1 : -1)); const el = document.getElementById('loading'); if (el) el.style.display = _ld ? 'block' : 'none'; }
function konfigOk() { return !/GANTI|XXXX/.test(window.APP_CONFIG.GAS_URL); }
async function api(action, data, opt) {
  opt = opt || {};
  if (!konfigOk()) return { success: false, message: 'Konfigurasi belum lengkap: isi GAS_URL di js/config.js.' };
  if (!opt.diam) loading(true);
  try {
    const r = await fetch(window.APP_CONFIG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, token: Sesi.token, data: data || {} }) });
    const j = await r.json();
    if (j && j.code === 'AUTH') { Sesi.hapus(); if (typeof tampilLogin === 'function') tampilLogin('Sesi berakhir, silakan masuk lagi.'); }
    return j;
  } catch (e) { return { success: false, message: 'Tidak dapat terhubung ke server. Periksa koneksi internet.' }; }
  finally { if (!opt.diam) loading(false); }
}
const _mem = {};
async function apiCache(action, data, ttl) {
  const k = action + JSON.stringify(data || {}), n = Date.now(), h = _mem[k];
  if (h && n - h.t < (ttl || 60000)) return h.r;
  const r = await api(action, data); if (r.success) _mem[k] = { t: n, r: r }; return r;
}
function bersihCache() { Object.keys(_mem).forEach(function (k) { delete _mem[k]; }); }
async function apiTulis(action, data) { const r = await api(action, data); if (r.success) bersihCache(); return r; }
