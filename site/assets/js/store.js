/**
 * État local (localStorage) : licence, progression, notes, préférences.
 * Tout est enveloppé dans try/catch : navigation privée ou stockage bloqué → mode volatile.
 */
const NS = 'ag42:';
const mem = new Map();

function read(key, fallback) {
  try {
    const v = localStorage.getItem(NS + key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return mem.has(key) ? mem.get(key) : fallback;
  }
}
function write(key, value) {
  mem.set(key, value);
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* volatile */
  }
}
function remove(key) {
  mem.delete(key);
  try {
    localStorage.removeItem(NS + key);
  } catch {
    /* volatile */
  }
}

export const store = {
  // ---- Licence ----
  getLicense: () => read('license', null), // { tier, keys:{tier:b64}, fp, activatedAt }
  setLicense: (lic) => write('license', lic),
  clearLicense: () => remove('license'),

  // ---- Progression ----
  getProgress: () => read('progress', {}), // { "<module>/<lesson>": { done:true, at, score } }
  markDone(moduleId, lessonId, extra = {}) {
    const p = read('progress', {});
    p[`${moduleId}/${lessonId}`] = { done: true, at: Date.now(), ...extra };
    write('progress', p);
    return p;
  },
  markUndone(moduleId, lessonId) {
    const p = read('progress', {});
    delete p[`${moduleId}/${lessonId}`];
    write('progress', p);
    return p;
  },
  isDone(moduleId, lessonId) {
    return Boolean(read('progress', {})[`${moduleId}/${lessonId}`]?.done);
  },
  lastLesson: () => read('last', null),
  setLastLesson: (ref) => write('last', ref),

  // ---- Notes ----
  getNote: (moduleId, lessonId) => read(`note:${moduleId}/${lessonId}`, ''),
  setNote: (moduleId, lessonId, text) => write(`note:${moduleId}/${lessonId}`, text),

  // ---- Identité pour le certificat ----
  getName: () => read('name', ''),
  setName: (n) => write('name', n),

  // ---- Préférences ----
  getPref: (k, d) => read(`pref:${k}`, d),
  setPref: (k, v) => write(`pref:${k}`, v),

  // ---- Export / import (portabilité entre appareils) ----
  exportAll() {
    const out = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(NS) && !k.startsWith(NS + 'license')) out[k.slice(NS.length)] = JSON.parse(localStorage.getItem(k));
      }
    } catch {
      for (const [k, v] of mem) if (k !== 'license') out[k] = v;
    }
    return out;
  },
  importAll(obj) {
    for (const [k, v] of Object.entries(obj || {})) if (k !== 'license') write(k, v);
  },
  /** Efface progression, notes, nom et préférences ; conserve la licence. */
  resetProgress() {
    for (const k of [...mem.keys()]) if (k !== 'license') mem.delete(k);
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(NS) && k !== NS + 'license')
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* volatile */
    }
  },
};
