const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RANSOM_FONTS = ['Bungee', 'Abril Fatface', 'Rubik Mono One', 'Shrikhand', 'Special Elite', 'Bagel Fat One', 'Caveat'];
const RANSOM_COLORS = [
  ['#ff6fae', '#fff'], ['#ffd23f', '#2a2130'], ['#2a2130', '#ffc2dc'], ['#fff', '#ec1c7f'],
  ['#4aa8ff', '#fff'], ['#4cc38a', '#2a2130'], ['#ff8c42', '#fff'], ['#a98bff', '#fff'],
  ['#f3e6cc', '#2a2130'], ['#ec1c7f', '#ffd23f'], ['transparent', '#2a2130'],
];
const DARK = '#2a2130';

function ransom(el, text = el.dataset.ransom ?? el.textContent) {
  const rnd = seeded(text);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  el.textContent = '';
  el.setAttribute('aria-label', text);
  el.classList.add('ransom');
  let prev = null;
  let sinceDark = 2;
  for (const word of text.split(' ')) {
    const w = document.createElement('span');
    w.className = 'r-word';
    w.setAttribute('aria-hidden', 'true');
    for (const ch of word) {
      const s = document.createElement('span');
      let c;
      do c = pick(RANSOM_COLORS);
      while (c === prev || (c[0] === DARK && sinceDark < 5));
      sinceDark = c[0] === DARK ? 0 : sinceDark + 1;
      prev = c;
      const [bg, fg] = c;
      s.className = 'r';
      s.textContent = ch;
      s.style.cssText = `font-family:'${pick(RANSOM_FONTS)}';background:${bg};color:${fg};rotate:${(rnd() * 12 - 6).toFixed(1)}deg;font-size:${(0.85 + rnd() * 0.3).toFixed(2)}em`;
      if (bg === 'transparent') s.style.boxShadow = 'none';
      w.append(s);
    }
    el.append(w);
  }
}
const ransomAll = (root = document) => $$('[data-ransom]', root).forEach((el) => ransom(el));

function confetti() {
  if (reducedMotion) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#ff6fae', '#ffd23f', '#4aa8ff', '#4cc38a', '#ff8c42', '#a98bff', '#ec1c7f'];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * 0.6}s;animation-duration:${2 + Math.random() * 1.8}s;--rx:${Math.random() * 720 - 360}deg;--dx:${Math.random() * 160 - 80}px`;
    box.append(p);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 4500);
}

// ponytail: horas sin zona se toman como Argentina (-03:00); cambiar si la fiesta es en otro huso
const toDate = (v) => {
  const s = String(v || '');
  return new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + '-03:00');
};

const isYes = (v) => v === true || /^s[ií]|^true$/i.test(String(v));

function respuestaDe(rows, slug) {
  const r = rows.filter((x) => x.slug === slug);
  if (!r.length) return null;
  return {
    fecha: r[0].fecha,
    mensaje: r[0].mensaje || '',
    miembros: r.map((x) => ({ nombre: x.nombre, asiste: isYes(x.asiste) })),
  };
}

const API = (() => {
  const url = CONFIG.SCRIPT_URL;
  const demo = !url;
  const KEY = 'demo-db';

  const demoDb = () => store.get(KEY) || {
    invitados: CONFIG.MOCK_INVITADOS.map((i) => ({ slug: i.slug, familia: i.familia, miembros: i.miembros.join(', '), grupo: i.grupo || '' })),
    grupos: CONFIG.MOCK_GRUPOS,
    respuestas: [],
    compras: CONFIG.MOCK_COMPRAS,
  };
  const miembrosDe = (i) => String(i.miembros).split(',').map((s) => s.trim()).filter(Boolean);
  const delay = (v) => new Promise((ok) => setTimeout(() => ok(v), 250));

  async function get(params) {
    const r = await fetch(url + '?' + new URLSearchParams(params));
    return r.json();
  }
  async function post(body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    return r.json();
  }

  return {
    demo,
    async invite(slug) {
      if (!demo) return get({ action: 'invite', inv: slug });
      const db = demoDb();
      const i = db.invitados.find((x) => x.slug === slug);
      if (!i) return delay({ ok: false, error: 'not_found' });
      const g = String(i.grupo || '').trim().toLowerCase();
      const grupo = (db.grupos || []).find((x) => g && String(x.grupo).trim().toLowerCase() === g) || null;
      return delay({ ok: true, invitado: { slug, familia: i.familia, miembros: miembrosDe(i), grupo: i.grupo || '' }, respuesta: respuestaDe(db.respuestas, slug), grupo });
    },
    async rsvp(body) {
      if (!demo) return post({ action: 'rsvp', ...body });
      const db = demoDb();
      const i = db.invitados.find((x) => x.slug === body.inv);
      if (!i) return { ok: false, error: 'not_found' };
      const fecha = new Date().toISOString();
      db.respuestas = db.respuestas.filter((r) => r.slug !== body.inv).concat(
        body.miembros.map((m) => ({ slug: body.inv, fecha, nombre: m.nombre, asiste: m.asiste ? 'Sí' : 'No', mensaje: body.mensaje })),
      );
      store.set(KEY, db);
      return delay({ ok: true });
    },
    async status(key) {
      if (!demo) return get({ action: 'status', key });
      return delay({ ok: true, ...demoDb() });
    },
    async save(key, sheet, rows) {
      if (!demo) return post({ action: 'save', key, sheet, rows });
      const db = demoDb();
      db[sheet.toLowerCase()] = rows;
      store.set(KEY, db);
      return delay({ ok: true });
    },
    resetDemo() { localStorage.removeItem(KEY); },
  };
})();
