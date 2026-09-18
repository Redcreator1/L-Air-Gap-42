/**
 * Espace membre : tableau de bord, lecteur de leçons, quiz, notes, certificat, recherche.
 * Routes (hash) :  #/  ·  #/m/<module>/<lesson>  ·  #/certificat  ·  #/reglages
 */
import { config, url } from './site.js';
import { store } from './store.js';
import { decryptModule } from './crypto.js';
import { renderMarkdown } from './md.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const TIER_RANK = { free: 0, essentiel: 1, pro: 2, elite: 3 };
const TIER_LABEL = { free: 'Gratuit', essentiel: 'Essentiel', pro: 'Pro', elite: 'Elite' };

const state = {
  curriculum: null,
  license: store.getLicense(),
  moduleCache: new Map(), // id → { lessons: {id: payload} }
  search: null,
};

const main = $('#main');
const sidebar = $('#sidebar');

// ---------- Helpers ----------
const allLessons = () => state.curriculum.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
const canAccess = (mod, lesson) => mod.tier === 'free' || lesson.free || (state.license && TIER_RANK[state.license.tier] >= TIER_RANK[mod.tier]);
const lessonRef = (m, l) => `#/m/${m.id}/${l.id}`;
function progressOf(lessons) {
  const done = lessons.filter(({ m, l }) => store.isDone(m.id, l.id)).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}
function accessibleLessons() {
  return allLessons().filter(({ m, l }) => canAccess(m, l));
}
function streak() {
  const days = new Set(Object.values(store.getProgress()).map((p) => new Date(p.at).toDateString()));
  let n = 0;
  for (let d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) n++;
  return n;
}

async function loadLesson(mod, lesson) {
  if (mod.tier === 'free' || lesson.free) {
    const r = await fetch(url(`data/lessons/${mod.id}/${lesson.id}.json`));
    if (!r.ok) throw new Error('Leçon introuvable');
    return r.json();
  }
  if (!state.moduleCache.has(mod.id)) {
    const r = await fetch(url(`data/modules/${mod.id}.enc.json`));
    if (!r.ok) throw new Error('Module introuvable');
    const encFile = await r.json();
    state.moduleCache.set(mod.id, await decryptModule(encFile, state.license.keys));
  }
  const payload = state.moduleCache.get(mod.id).lessons[lesson.id];
  if (!payload) throw new Error('Leçon absente du module');
  return payload;
}

// ---------- Sidebar ----------
function renderSidebar(activeRef) {
  const acc = accessibleLessons();
  const p = progressOf(acc);
  const lic = state.license;
  sidebar.innerHTML = `
    <div class="side-progress">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <b>${p.pct}%</b><span class="small muted">${p.done}/${p.total} leçons</span>
      </div>
      <div class="progress"><i style="width:${p.pct}%"></i></div>
      <div class="small muted" style="margin-top:8px">${lic ? `Licence <b style="color:var(--accent)">${esc(TIER_LABEL[lic.tier])}</b> · ${esc(lic.fp)}` : `<a href="${url('acces/')}">Activer une licence →</a>`}</div>
    </div>
    <div class="side-search"><input type="text" id="search" placeholder="Rechercher une leçon…" autocomplete="off"><div id="search-results"></div></div>
    <nav id="side-nav">
      ${state.curriculum.modules
        .map((m) => {
          const mp = progressOf(m.lessons.filter((l) => canAccess(m, l)).map((l) => ({ m, l })));
          const isOpen = m.lessons.some((l) => lessonRef(m, l) === activeRef) || (!activeRef && m.id === state.curriculum.modules[0].id);
          return `<div class="side-module ${isOpen ? 'open' : ''}" data-mod="${m.id}">
          <button aria-expanded="${isOpen}"><span>${esc(m.short || m.title)}</span><small>${mp.done}/${m.lessons.length}</small></button>
          <ul class="side-lessons">${m.lessons
            .map((l) => {
              const ok = canAccess(m, l);
              const done = store.isDone(m.id, l.id);
              return `<li><a href="${ok ? lessonRef(m, l) : '#/verrou/' + m.id}" class="${lessonRef(m, l) === activeRef ? 'active' : ''}"><span class="state ${done ? 'done' : ok ? '' : 'lock'}">${done ? '✓' : ok ? '' : '🔒'}</span><span>${l.day ? `<span class="mono muted">J${l.day}</span> · ` : ''}${esc(l.title)}</span></a></li>`;
            })
            .join('')}</ul></div>`;
        })
        .join('')}
    </nav>
    <div style="margin-top:20px;display:grid;gap:8px">
      <a class="btn btn-ghost btn-sm" href="#/certificat">🎓 Mon certificat</a>
      <a class="btn btn-ghost btn-sm" href="#/reglages">⚙ Réglages</a>
    </div>`;
  $$('.side-module > button', sidebar).forEach((b) =>
    b.addEventListener('click', () => {
      const open = b.parentElement.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
    }),
  );
  $$('.side-lessons a', sidebar).forEach((a) => a.addEventListener('click', () => sidebar.classList.remove('open')));
  const input = $('#search', sidebar);
  input.addEventListener('input', () => runSearch(input.value.trim()));
}

async function runSearch(q) {
  const box = $('#search-results', sidebar);
  if (q.length < 2) return (box.innerHTML = '');
  if (!state.search) state.search = await (await fetch(url('data/search.json'))).json();
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const nq = norm(q);
  const hits = state.search.filter((e) => norm(e.t).includes(nq) || norm(e.x).includes(nq)).slice(0, 8);
  box.innerHTML = hits.length
    ? `<ul class="side-lessons" style="display:block;margin-top:8px">${hits
        .map((h) => `<li><a href="#/m/${h.m}/${h.l}"><span class="state ${h.free ? '' : 'lock'}"></span><span>${esc(h.t)}</span></a></li>`)
        .join('')}</ul>`
    : `<p class="small muted" style="padding:8px 4px">Aucun résultat.</p>`;
}

// ---------- Views ----------
function viewDashboard() {
  const acc = accessibleLessons();
  const p = progressOf(acc);
  const last = store.lastLesson();
  const next = acc.find(({ m, l }) => !store.isDone(m.id, l.id)) || acc[0];
  const lic = state.license;
  const s = streak();
  main.innerHTML = `
    <div class="dash-hero">
      <div class="eyebrow">Tableau de bord</div>
      <h1 style="font-size:2rem">${lic ? `Bienvenue, membre ${esc(TIER_LABEL[lic.tier])}.` : 'Bienvenue au briefing.'}</h1>
      <p class="muted">${p.done === 0 ? 'Votre parcours commence ici. Une leçon par jour, 42 jours.' : `${p.done} leçon${p.done > 1 ? 's' : ''} terminée${p.done > 1 ? 's' : ''} · ${p.pct}% du parcours accessible${s > 1 ? ` · série de ${s} jours 🔥` : ''}`}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:10px">
        ${next ? `<a class="btn btn-primary" href="${lessonRef(next.m, next.l)}">${p.done ? 'Continuer' : 'Commencer'} : ${esc(next.l.title)}</a>` : ''}
        ${last && last !== (next && lessonRef(next.m, next.l)) ? `<a class="btn btn-ghost" href="${last}">Reprendre la dernière leçon</a>` : ''}
        ${!lic ? `<a class="btn btn-amber" href="${url('tarifs/')}">Débloquer les 42 jours</a>` : ''}
      </div>
    </div>
    <div class="dash-grid">
      ${state.curriculum.modules
        .map((m) => {
          const lessons = m.lessons.map((l) => ({ m, l }));
          const mp = progressOf(lessons);
          const locked = !lessons.some(({ m, l }) => canAccess(m, l));
          const first = lessons.find(({ m, l }) => canAccess(m, l) && !store.isDone(m.id, l.id)) || lessons[0];
          return `<a class="dash-mod ${locked ? 'locked' : ''}" href="${locked ? '#/verrou/' + m.id : lessonRef(first.m, first.l)}" style="text-decoration:none;color:inherit">
            <span class="tier-tag ${m.tier}">${TIER_LABEL[m.tier]}</span>
            <h3 style="margin-top:12px">${esc(m.title)}</h3>
            <div class="pct">${locked ? '🔒 verrouillé' : `${mp.done}/${mp.total} · ${mp.pct}%`}</div>
            <div class="progress"><i style="width:${mp.pct}%"></i></div>
          </a>`;
        })
        .join('')}
    </div>
    <div class="card">
      <h3>Rituels de la communauté</h3>
      <p class="muted">Live hebdomadaire <b>${esc(config.community.liveSessions.day)} ${esc(config.community.liveSessions.time)}</b> — revue d’architecture et Q&R.
      ${lic && TIER_RANK[lic.tier] >= 2 ? `<a href="${esc(config.community.liveSessions.url)}" target="_blank" rel="noopener">Rejoindre la salle →</a>` : '<span class="small">(réservé aux membres Pro et Elite)</span>'}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-ghost btn-sm" href="${esc(config.community.discordInvite)}" target="_blank" rel="noopener">Discord</a><a class="btn btn-ghost btn-sm" href="${esc(config.community.discussionsUrl)}" target="_blank" rel="noopener">Discussions GitHub</a></div>
    </div>`;
}

function viewLocked(modId) {
  const m = state.curriculum.modules.find((x) => x.id === modId);
  const tier = config.checkout.tiers.find((t) => t.id === (m?.tier || 'essentiel'));
  main.innerHTML = `
    <div class="lock-screen">
      <div class="icon-box">🔒</div>
      <h2>${esc(m?.title || 'Module verrouillé')}</h2>
      <p class="muted" style="max-width:52ch;margin-inline:auto">Ce module fait partie du palier <b>${esc(TIER_LABEL[m?.tier])}</b>. ${state.license ? `Votre licence ${esc(TIER_LABEL[state.license.tier])} ne l’inclut pas : passez au palier supérieur en nous écrivant, nous déduisons ce que vous avez déjà payé.` : 'Activez une licence ou rejoignez le programme pour y accéder.'}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px">
        <a class="btn btn-primary" href="${url('tarifs/#tier-' + (tier?.id || 'pro'))}">Voir l’offre ${esc(tier?.name || '')}</a>
        ${!state.license ? `<a class="btn btn-ghost" href="${url('acces/')}">J’ai déjà une licence</a>` : `<a class="btn btn-ghost" href="mailto:${esc(config.site.contactEmail)}?subject=Upgrade%20${esc(m?.tier)}">Demander un upgrade</a>`}
      </div>
    </div>`;
}

async function viewLesson(modId, lessonId) {
  const m = state.curriculum.modules.find((x) => x.id === modId);
  const l = m?.lessons.find((x) => x.id === lessonId);
  if (!m || !l) return (main.innerHTML = `<div class="notice err">Leçon introuvable.</div>`);
  if (!canAccess(m, l)) return viewLocked(m.id);
  main.innerHTML = `<p class="muted mono">Déchiffrement de la leçon…</p>`;
  let payload;
  try {
    payload = await loadLesson(m, l);
  } catch (e) {
    return (main.innerHTML = `<div class="notice err">Impossible de charger la leçon : ${esc(e.message)}. <a href="${url('acces/')}">Réactiver la licence</a>.</div>`);
  }
  store.setLastLesson(lessonRef(m, l));
  const list = allLessons();
  const idx = list.findIndex((x) => x.m.id === m.id && x.l.id === l.id);
  const prev = list[idx - 1];
  const next = list[idx + 1];
  const done = store.isDone(m.id, l.id);

  main.innerHTML = `
    <header class="lesson-head">
      <div class="crumbs">${esc(m.title)}${l.day ? ` · Jour ${l.day}` : ''}</div>
      <h1>${esc(l.title)}</h1>
      <div class="lesson-meta"><span>⏱ ${l.minutes} min</span><span>📄 ${l.words} mots</span>${payload.quiz?.length ? `<span>✎ quiz ${payload.quiz.length} q.</span>` : ''}<span class="tier-tag ${m.tier}">${TIER_LABEL[m.tier]}</span></div>
    </header>
    <article class="prose" id="lesson-body">${renderMarkdown(payload.body)}</article>
    ${payload.resources?.length ? `<div class="resources"><h3>Ressources</h3>${payload.resources.map((r) => `<a href="${esc(r.url)}" target="_blank" rel="noopener">📎 ${esc(r.label)}</a>`).join('')}</div>` : ''}
    ${payload.quiz?.length ? `<section class="quiz" id="quiz"><h2>Validez vos acquis</h2>${payload.quiz.map((q, qi) => `<div class="quiz-q" data-q="${qi}"><p>${qi + 1}. ${esc(q.q)}</p>${q.choices.map((c, ci) => `<label><input type="radio" name="q${qi}" value="${ci}"> <span>${esc(c)}</span></label>`).join('')}<p class="explain" hidden>${esc(q.explain || '')}</p></div>`).join('')}<button class="btn btn-primary" id="quiz-submit" style="margin-top:14px">Corriger</button><div class="quiz-result" id="quiz-result"></div></section>` : ''}
    <section class="notes">
      <h3>Mes notes <span class="small muted">(privées, stockées dans ce navigateur)</span></h3>
      <textarea id="note" placeholder="Vos décisions, questions, points à appliquer chez vous…">${esc(store.getNote(m.id, l.id))}</textarea>
    </section>
    <div class="lesson-actions">
      <button class="btn ${done ? 'btn-ghost' : 'btn-primary'}" id="toggle-done">${done ? '✓ Terminée — marquer à refaire' : 'Marquer comme terminée'}</button>
      ${next ? `<a class="btn btn-ghost" href="${canAccess(next.m, next.l) ? lessonRef(next.m, next.l) : '#/verrou/' + next.m.id}">Leçon suivante →</a>` : ''}
      <span class="small muted">Partagez vos questions sur cette leçon dans la discussion ci-dessous ou sur Discord.</span>
    </div>
    <nav class="lesson-nav">
      ${prev ? `<a href="${canAccess(prev.m, prev.l) ? lessonRef(prev.m, prev.l) : '#/verrou/' + prev.m.id}"><span class="small">← Précédent</span><b>${esc(prev.l.title)}</b></a>` : '<span></span>'}
      ${next ? `<a class="next" href="${canAccess(next.m, next.l) ? lessonRef(next.m, next.l) : '#/verrou/' + next.m.id}"><span class="small">Suivant →</span><b>${esc(next.l.title)}</b></a>` : '<span></span>'}
    </nav>
    <section id="comments" style="margin-top:40px"></section>`;

  window.scrollTo({ top: 0 });
  $('#note').addEventListener('input', (e) => store.setNote(m.id, l.id, e.target.value));
  $('#toggle-done').addEventListener('click', () => {
    if (store.isDone(m.id, l.id)) store.markUndone(m.id, l.id);
    else store.markDone(m.id, l.id);
    renderSidebar(lessonRef(m, l));
    viewLesson(modId, lessonId);
  });
  const qs = $('#quiz-submit');
  if (qs)
    qs.addEventListener('click', () => {
      let score = 0;
      payload.quiz.forEach((q, qi) => {
        const box = $(`.quiz-q[data-q="${qi}"]`);
        const chosen = $(`input[name=q${qi}]:checked`, box);
        $$('label', box).forEach((lab, ci) => {
          lab.classList.remove('good', 'bad');
          if (ci === q.answer) lab.classList.add('good');
          else if (chosen && Number(chosen.value) === ci) lab.classList.add('bad');
        });
        $('.explain', box).hidden = !q.explain;
        if (chosen && Number(chosen.value) === q.answer) score++;
      });
      const pct = Math.round((score / payload.quiz.length) * 100);
      $('#quiz-result').innerHTML = `Score : <b style="color:${pct >= 70 ? 'var(--success)' : 'var(--accent-2)'}">${score}/${payload.quiz.length}</b> ${pct >= 70 ? '— validé ✓' : '— relisez les points en surbrillance et réessayez.'}`;
      if (pct >= 70 && !store.isDone(m.id, l.id)) {
        store.markDone(m.id, l.id, { score: pct });
        renderSidebar(lessonRef(m, l));
        $('#toggle-done').textContent = '✓ Terminée — marquer à refaire';
        $('#toggle-done').className = 'btn btn-ghost';
      }
    });
  mountComments(m, l);
}

function mountComments(m, l) {
  const g = config.community.giscus;
  const host = $('#comments');
  if (!g.enabled || !g.repoId || !g.categoryId) {
    host.innerHTML = `<div class="notice"><b>Discussion de la leçon.</b> Posez vos questions sur <a href="${esc(config.community.discussionsUrl)}" target="_blank" rel="noopener">GitHub Discussions</a> ou dans le salon Discord <b>#${esc(m.id)}</b>.</div>`;
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  Object.entries({
    repo: g.repo,
    repoId: g.repoId,
    category: g.category,
    categoryId: g.categoryId,
    mapping: 'specific',
    term: `${m.id}/${l.id} — ${l.title}`,
    strict: '1',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: 'transparent_dark',
    lang: 'fr',
  }).forEach(([k, v]) => s.setAttribute('data-' + k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()), v));
  s.crossOrigin = 'anonymous';
  s.async = true;
  host.appendChild(s);
}

function viewCertificate() {
  const acc = accessibleLessons();
  const p = progressOf(acc);
  const paid = acc.filter(({ m }) => m.tier !== 'free');
  const pp = progressOf(paid);
  const name = store.getName();
  const eligible = state.license && pp.total > 0 && pp.pct === 100;
  main.innerHTML = `
    <div class="no-print" style="margin-bottom:22px">
      <div class="eyebrow">Certificat</div>
      <h1 style="font-size:1.9rem">Certificat de programme</h1>
      <p class="muted">Délivré lorsque 100 % des leçons de votre palier sont validées. Progression actuelle : <b>${pp.done}/${pp.total}</b> leçons payantes (${p.done}/${p.total} au total).</p>
      <div class="field"><label for="cert-name">Nom à faire figurer</label><input type="text" id="cert-name" value="${esc(name)}" placeholder="Prénom Nom"></div>
      ${eligible ? `<button class="btn btn-primary" onclick="window.print()">Imprimer / enregistrer en PDF</button>` : `<div class="notice warn">Terminez toutes les leçons de votre palier pour débloquer le certificat.</div>`}
    </div>
    <div class="certificate" style="${eligible ? '' : 'filter:grayscale(1);opacity:.45'}">
      <div class="eyebrow" style="justify-content:center">${esc(config.site.name)}</div>
      <h1>Certificat de réussite</h1>
      <p class="muted">atteste que</p>
      <div class="name" id="cert-name-out">${esc(name || '— votre nom —')}</div>
      <p>a complété avec succès le programme <b>${esc(config.site.name)}</b> — palier <b>${esc(TIER_LABEL[state.license?.tier || 'free'])}</b>,<br>${pp.total} leçons sur la conception, l’exploitation et l’audit des systèmes isolés.</p>
      <div class="meta">Délivré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · Licence ${esc(state.license?.fp || '')} · ${esc(config.site.url)}</div>
    </div>`;
  $('#cert-name').addEventListener('input', (e) => {
    store.setName(e.target.value);
    $('#cert-name-out').textContent = e.target.value || '— votre nom —';
  });
}

function viewSettings() {
  const lic = state.license;
  main.innerHTML = `
    <div class="eyebrow">Réglages</div>
    <h1 style="font-size:1.9rem">Votre espace</h1>
    <div class="card" style="margin-bottom:16px">
      <h3>Licence</h3>
      ${lic ? `<p class="muted">Palier <b>${esc(TIER_LABEL[lic.tier])}</b> · empreinte <code>${esc(lic.fp)}</code> · activée le ${new Date(lic.activatedAt).toLocaleDateString('fr-FR')}</p><button class="btn btn-ghost btn-sm" id="logout">Retirer la licence de cet appareil</button>` : `<p class="muted">Aucune licence active.</p><a class="btn btn-primary btn-sm" href="${url('acces/')}">Activer</a>`}
    </div>
    <div class="card" style="margin-bottom:16px">
      <h3>Progression & notes</h3>
      <p class="muted">Tout est stocké localement dans ce navigateur. Exportez pour changer d’appareil ou conserver une sauvegarde (la licence n’est jamais incluse).</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" id="export">Exporter (JSON)</button>
        <label class="btn btn-ghost btn-sm">Importer <input type="file" accept="application/json" id="import" hidden></label>
        <button class="btn btn-ghost btn-sm" id="reset" style="color:var(--danger)">Réinitialiser la progression</button>
      </div>
      <p id="settings-msg" class="small" style="margin-top:12px"></p>
    </div>
    <div class="card">
      <h3>Support</h3>
      <p class="muted">Un problème d’accès, une facture, un upgrade ? <a href="mailto:${esc(config.site.contactEmail)}">${esc(config.site.contactEmail)}</a></p>
    </div>`;
  $('#logout')?.addEventListener('click', () => {
    store.clearLicense();
    location.href = url('acces/');
  });
  $('#export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store.exportAll(), null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `airgap42-progression-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
  });
  $('#import').addEventListener('change', async (e) => {
    try {
      store.importAll(JSON.parse(await e.target.files[0].text()));
      $('#settings-msg').textContent = 'Progression importée.';
      renderSidebar();
    } catch {
      $('#settings-msg').textContent = 'Fichier invalide.';
    }
  });
  $('#reset').addEventListener('click', () => {
    if (!confirm('Effacer toute la progression et les notes de cet appareil ?')) return;
    store.importAll({});
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('ag42:') && !k.startsWith('ag42:license'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    renderSidebar();
    $('#settings-msg').textContent = 'Progression réinitialisée.';
  });
}

// ---------- Router ----------
function route() {
  const h = location.hash || '#/';
  const parts = h.slice(2).split('/').filter(Boolean);
  const activeRef = parts[0] === 'm' ? h : null;
  renderSidebar(activeRef);
  if (parts[0] === 'm' && parts[1] && parts[2]) return viewLesson(parts[1], parts[2]);
  if (parts[0] === 'verrou') return viewLocked(parts[1]);
  if (parts[0] === 'certificat') return viewCertificate();
  if (parts[0] === 'reglages') return viewSettings();
  return viewDashboard();
}

async function init() {
  try {
    state.curriculum = await (await fetch(url('data/curriculum.json'))).json();
  } catch {
    main.innerHTML = `<div class="notice err">Impossible de charger le programme. Lancez <code>npm run build</code> puis servez <code>dist/</code>.</div>`;
    return;
  }
  $('#sidebar-toggle').addEventListener('click', () => sidebar.classList.toggle('open'));
  window.addEventListener('hashchange', route);
  route();
}
init();
