const HEADERS = {
  Invitados: ['slug', 'familia', 'miembros', 'grupo'],
  Respuestas: ['slug', 'fecha', 'nombre', 'asiste', 'mensaje'],
  Grupos: ['grupo', 'horaTexto', 'inicio', 'fin'],
  Compras: ['item', 'xPersona', 'cantidad', 'precio', 'comprado'],
};
const EDITABLE = ['Invitados', 'Grupos', 'Compras'];

function grupo_(nombre) {
  const n = String(nombre || '').trim().toLowerCase();
  return n ? rows_('Grupos').find((g) => String(g.grupo).trim().toLowerCase() === n) || null : null;
}

function setup() {
  Object.keys(HEADERS).forEach(sheet_);
}

function statusKey_() {
  return PropertiesService.getScriptProperties().getProperty('STATUS_KEY');
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(HEADERS[name]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_(name) {
  const values = sheet_(name).getDataRange().getValues();
  const head = values.shift();
  return values
    .filter((r) => r.join('') !== '')
    .map((r) => Object.fromEntries(head.map((k, i) => [k, r[i] instanceof Date ? r[i].toISOString() : r[i]])));
}

function safe_(v) {
  const s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function invitado_(slug) {
  const i = rows_('Invitados').find((r) => String(r.slug).trim().toLowerCase() === slug);
  if (!i) return null;
  return { slug, familia: i.familia, grupo: i.grupo || '', miembros: String(i.miembros).split(',').map((s) => s.trim()).filter(Boolean) };
}

function respuesta_(slug) {
  const r = rows_('Respuestas').filter((x) => x.slug === slug);
  if (!r.length) return null;
  return {
    fecha: r[0].fecha,
    mensaje: r[0].mensaje,
    miembros: r.map((x) => ({ nombre: x.nombre, asiste: /^s/i.test(x.asiste) })),
  };
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function authorized_(key) {
  const k = statusKey_();
  return Boolean(k) && key === k;
}

function doGet(e) {
  const p = e.parameter;
  try {
    if (p.action === 'invite') {
      const inv = invitado_(String(p.inv || '').trim().toLowerCase());
      return json_(inv ? { ok: true, invitado: inv, respuesta: respuesta_(inv.slug), grupo: grupo_(inv.grupo) } : { ok: false, error: 'not_found' });
    }
    if (p.action === 'status') {
      if (!authorized_(p.key)) return json_({ ok: false, error: 'unauthorized' });
      return json_({ ok: true, invitados: rows_('Invitados'), grupos: rows_('Grupos'), respuestas: rows_('Respuestas'), compras: rows_('Compras') });
    }
    return json_({ ok: false, error: 'bad_action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const b = JSON.parse(e.postData.contents);

    if (b.action === 'rsvp') {
      const inv = invitado_(String(b.inv || '').trim().toLowerCase());
      if (!inv) return json_({ ok: false, error: 'not_found' });
      const sh = sheet_('Respuestas');
      const values = sh.getDataRange().getValues();
      for (let i = values.length - 1; i >= 1; i--) if (values[i][0] === inv.slug) sh.deleteRow(i + 1);
      const allowed = new Set(inv.miembros);
      const fecha = new Date();
      const nuevas = (b.miembros || [])
        .filter((m) => allowed.has(m.nombre))
        .map((m) => [inv.slug, fecha, safe_(m.nombre), m.asiste ? 'Sí' : 'No', safe_(b.mensaje)]);
      if (nuevas.length) sh.getRange(sh.getLastRow() + 1, 1, nuevas.length, nuevas[0].length).setValues(nuevas);
      return json_({ ok: true });
    }

    if (b.action === 'save') {
      if (!authorized_(b.key)) return json_({ ok: false, error: 'unauthorized' });
      if (EDITABLE.indexOf(b.sheet) < 0) return json_({ ok: false, error: 'bad_sheet' });
      const head = HEADERS[b.sheet];
      const sh = sheet_(b.sheet);
      sh.clearContents();
      sh.getRange(1, 1, 1, head.length).setValues([head]);
      const vals = (b.rows || []).slice(0, 500).map((r) => head.map((k) => (typeof r[k] === 'boolean' ? (r[k] ? 'Sí' : 'No') : safe_(r[k]))));
      if (vals.length) sh.getRange(2, 1, vals.length, head.length).setNumberFormat('@').setValues(vals);
      return json_({ ok: true });
    }

    return json_({ ok: false, error: 'bad_action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
