/**
 * Espace membre : tableau de bord, lecteur de leçons, quiz, notes, certificat, recherche.
 * Routes (hash) :  #/  ·  #/m/<module>/<lesson>  ·  #/verrou/<module>  ·  #/certificat  ·  #/reglages
 */
import { config, url, esc, TIER_LABEL } from './site.js';
import { store } from './store.js';
import { decryptModule } from './crypto.js';
import { renderMarkdown } from './md.js';
import { icon, applyIcons } from './icons.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const TIER_RANK = { free: 0, essentiel: 1, pro: 2, elite: 3 };
const QUIZ_PASS_PCT = 70;

const state = {
  curriculum: null,
  license: store.getLicense(),
  moduleCache: new Map(), // id → { lessons: {id: payload} } déchiffré
  search: null,
};

const main = $('#main');
const sidebar = $('#sidebar');

// ---------- Aides ----------
const allLessons = () => state.curriculum.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
const canAccess = (mod, lesson) => mod.tier === 'free' || lesson.free || (state.license && TIER_RANK[state.license.tier] >= TIER_RANK[mod.tier]);
const lessonRef = (m, l) => `#/m/${m.id}/${l.id}`;
const lessonHref = (m, l) => (canAccess(m, l) ? lessonRef(m, l) : `#/verrou/${m.id}`);
const accessibleLessons = () => allLessons().filter(({ m, l }) => canAccess(m, l));
const plural = (n, s) => `${n} ${s}${n > 1 ? 's' : ''}`;

function progressOf(lessons) {
  const done = lessons.filter(({ m, l }) => store.isDone(m.id, l.id)).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}
function streak() {
  const days = new Set(Object.values(store.getProgress()).map((p) => new Date(p.at).toDateString()));
  let n = 0;
  for (const d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) n++;
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
    state.moduleCache.set(mod.id, await decryptModule(await r.json(), state.license.keys));
  }
  const payload = state.moduleCache.get(mod.id).lessons[lesson.id];
  if (!payload) throw new Error('Leçon absente du module');
  return payload;
}

// ---------- Barre latérale ----------
function renderSidebar(activeRef) {
  const p = progressOf(accessibleLessons());
  const lic = state.license;
  const firstModule = state.curriculum.modules[0].id;
  sidebar.innerHTML = `
    <div class="side-progress">
      <div class="side-progress-row"><b>${p.pct}%</b><span class="small muted">${p.done}/${p.total} leçons</span></div>
      <div class="progress"><i style="width:${p.pct}%"></i></div>
      <div class="small muted mt-sm">${lic ? `Licence <b class="accent">${esc(TIER_LABEL[lic.tier])}</b> · ${esc(lic.fp)}` : `<a href="${url('acces/')}">Activer une licence</a>`}</div>
    </div>
    <div class="side-search"><label class="sr-only" for="search">Rechercher une leçon</label><input type="search" id="search" placeholder="Rechercher une leçon…" autocomplete="off"><div id="search-results" aria-live="polite"></div></div>
    <nav id="side-nav" aria-label="Modules">
      ${state.curriculum.modules
        .map((m) => {
          const mp = progressOf(m.lessons.filter((l) => canAccess(m, l)).map((l) => ({ m, l })));
          const isOpen = m.lessons.some((l) => lessonRef(m, l) === activeRef) || (!activeRef && m.id === firstModule);
          return `<div class="side-module ${isOpen ? 'open' : ''}" data-mod="${esc(m.id)}">
          <button type="button" aria-expanded="${isOpen}"><span>${esc(m.short || m.title)}</span><small>${mp.done}/${m.lessons.length}</small></button>
          <ul class="side-lessons">${m.lessons
            .map((l) => {
              const ok = canAccess(m, l);
              const done = store.isDone(m.id, l.id);
              const stateCls = done ? 'done' : ok ? '' : 'lock';
              const stateIcon = done ? icon('check') : ok ? '' : icon('lock');
              return `<li><a href="${lessonHref(m, l)}" class="${lessonRef(m, l) === activeRef ? 'active' : ''}" ${lessonRef(m, l) === activeRef ? 'aria-current="page"' : ''}><span class="state ${stateCls}">${stateIcon}</span><span>${l.day ? `<span class="mono muted">J${l.day}</span> · ` : ''}${esc(l.title)}</span></a></li>`;
            })
            .join('')}</ul></div>`;
        })
        .join('')}
    </nav>
    <div class="side-actions">
      <a class="btn btn-ghost btn-sm" href="#/certificat">${icon('award', 16)} Mon certificat</a>
      <a class="btn btn-ghost btn-sm" href="#/reglages">${icon('settings', 16)} Réglages</a>
    </div>`;
  $$('.side-module > button', sidebar).forEach((b) =>
    b.addEventListener('click', () => {
      const open = b.parentElement.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
    }),
  );
  $$('.side-lessons a', sidebar).forEach((a) => a.addEventListener('click', closeSidebar));
  $('#search', sidebar).addEventListener('input', (e) => runSearch(e.target.value.trim()));
}

function closeSidebar() {
  sidebar.classList.remove('open');
  $('#sidebar-toggle').setAttribute('aria-expanded', 'false');
}

async function runSearch(q) {
  const box = $('#search-results', sidebar);
  if (q.length < 2) return (box.innerHTML = '');
  if (!state.search) state.search = await (await fetch(url('data/search.json'))).json();
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const nq = norm(q);
  const hits = state.search.filter((e) => norm(e.t).includes(nq) || norm(e.x).includes(nq)).slice(0, 8);
  box.innerHTML = hits.length
    ? `<ul class="side-lessons search-hits">${hits
        .map((h) => {
          const m = state.curriculum.modules.find((x) => x.id === h.m);
          const l = m?.lessons.find((x) => x.id === h.l);
          const ok = m && l && canAccess(m, l);
          return `<li><a href="${ok ? `#/m/${h.m}/${h.l}` : `#/verrou/${h.m}`}"><span class="state ${ok ? '' : 'lock'}">${ok ? '' : icon('lock')}</span><span>${esc(h.t)}</span></a></li>`;
        })
        .join('')}</ul>`
    : `<p class="small muted search-empty">Aucun résultat.</p>`;
}

// ---------- Vues ----------
function viewDashboard() {
  const acc = accessibleLessons();
  const p = progressOf(acc);
  const last = store.lastLesson();
  const next = acc.find(({ m, l }) => !store.isDone(m.id, l.id)) || acc[0];
  const lic = state.license;
  const s = streak();
  const summary =
    p.done === 0
      ? 'Votre parcours commence ici. Une leçon par jour, 42 jours.'
      : `${plural(p.done, 'leçon')} terminée${p.done > 1 ? 's' : ''} · ${p.pct} % du parcours accessible${s > 1 ? ` · ${icon('flame', 14)} série de ${s} jours` : ''}`;
  main.innerHTML = `
    <div class="dash-hero">
      <div class="eyebrow">Tableau de bord</div>
      <h1 class="h1-sm">${lic ? `Bienvenue, membre ${esc(TIER_LABEL[lic.tier])}.` : 'Bienvenue au briefing.'}</h1>
      <p class="muted">${summary}</p>
      <div class="dash-actions">
        ${next ? `<a class="btn btn-primary" href="${lessonRef(next.m, next.l)}">${p.done ? 'Continuer' : 'Commencer'} : ${esc(next.l.title)}</a>` : ''}
        ${last && last !== (next && lessonRef(next.m, next.l)) ? `<a class="btn btn-ghost" href="${esc(last)}">Reprendre la dernière leçon</a>` : ''}
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
          return `<a class="dash-mod ${locked ? 'locked' : ''}" href="${locked ? `#/verrou/${m.id}` : lessonRef(first.m, first.l)}">
            <span class="tier-tag ${esc(m.tier)}">${TIER_LABEL[m.tier]}</span>
            <h3>${esc(m.title)}</h3>
            <div class="pct">${locked ? `${icon('lock')} verrouillé` : `${mp.done}/${mp.total} · ${mp.pct} %`}</div>
            <div class="progress"><i style="width:${mp.pct}%"></i></div>
          </a>`;
        })
        .join('')}
    </div>
    <div class="card">
      <h3>Rituels de la communauté</h3>
      <p class="muted">Live hebdomadaire <b>${esc(config.community.liveSessions.day)} ${esc(config.community.liveSessions.time)}</b> : revue d’architecture et questions-réponses.
      ${lic && TIER_RANK[lic.tier] >= TIER_RANK.pro ? `<a href="${esc(config.community.liveSessions.url)}" target="_blank" rel="noopener">Rejoindre la salle</a>` : '<span class="small">(réservé aux membres Pro et Elite)</span>'}</p>
      <div class="dash-actions"><a class="btn btn-ghost btn-sm" href="${esc(config.community.discordInvite)}" target="_blank" rel="noopener">Discord</a><a class="btn btn-ghost btn-sm" href="${esc(config.community.discussionsUrl)}" target="_blank" rel="noopener">Discussions GitHub</a></div>
    </div>`;
}

function viewLocked(modId) {
  const m = state.curriculum.modules.find((x) => x.id === modId);
  const tierId = m?.tier || 'essentiel';
  const tier = config.checkout.tiers.find((t) => t.id === tierId);
  const lic = state.license;
  main.innerHTML = `
    <div class="lock-screen">
      <div class="icon-box">${icon('lock')}</div>
      <h2>${esc(m?.title || 'Module verrouillé')}</h2>
      <p class="muted">Ce module fait partie du palier <b>${esc(TIER_LABEL[tierId])}</b>. ${
        lic
          ? `Votre licence ${esc(TIER_LABEL[lic.tier])} ne l’inclut pas : passez au palier supérieur en nous écrivant, nous déduisons ce que vous avez déjà payé.`
          : 'Activez une licence ou rejoignez le programme pour y accéder.'
      }</p>
      <div class="lock-actions">
        <a class="btn btn-primary" href="${url(`tarifs/#tier-${tier?.id || 'pro'}`)}">Voir l’offre ${esc(tier?.name || '')}</a>
        ${lic ? `<a class="btn btn-ghost" href="mailto:${esc(config.site.contactEmail)}?subject=${encodeURIComponent(`Upgrade ${TIER_LABEL[tierId]}`)}">Demander un upgrade</a>` : `<a class="btn btn-ghost" href="${url('acces/')}">J’ai déjà une licence</a>`}
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
  const quiz = payload.quiz || [];

  main.innerHTML = `
    <header class="lesson-head">
      <div class="crumbs">${esc(m.title)}${l.day ? ` · Jour ${l.day}` : ''}</div>
      <h1>${esc(l.title)}</h1>
      <div class="lesson-meta">
        <span>${icon('clock')} ${l.minutes} min</span>
        <span>${icon('file')} ${l.words} mots</span>
        ${quiz.length ? `<span>${icon('edit')} quiz ${plural(quiz.length, 'question')}</span>` : ''}
        <span class="tier-tag ${esc(m.tier)}">${TIER_LABEL[m.tier]}</span>
      </div>
    </header>
    <article class="prose" id="lesson-body">${renderMarkdown(payload.body)}</article>
    ${payload.resources?.length ? `<div class="resources"><h3>Ressources</h3>${payload.resources.map((r) => `<a href="${esc(r.url)}" target="_blank" rel="noopener">${icon('paperclip')} ${esc(r.label)}</a>`).join('')}</div>` : ''}
    ${
      quiz.length
        ? `<section class="quiz" id="quiz" aria-labelledby="quiz-title"><h2 id="quiz-title">Validez vos acquis</h2>${quiz
            .map(
              (q, qi) => `<fieldset class="quiz-q" data-q="${qi}"><legend><p>${qi + 1}. ${esc(q.q)}</p></legend>${q.choices
                .map((c, ci) => `<label><input type="radio" name="q${qi}" value="${ci}"> <span>${esc(c)}</span></label>`)
                .join('')}<p class="explain" hidden>${esc(q.explain || '')}</p></fieldset>`,
            )
            .join('')}<button class="btn btn-primary mt-sm" type="button" id="quiz-submit">Corriger</button><div class="quiz-result" id="quiz-result" aria-live="polite"></div></section>`
        : ''
    }
    <section class="notes">
      <h3><label for="note">Mes notes</label> <span class="small muted">(privées, stockées dans ce navigateur)</span></h3>
      <textarea id="note" placeholder="Vos décisions, questions, points à appliquer chez vous…">${esc(store.getNote(m.id, l.id))}</textarea>
    </section>
    <div class="lesson-actions">
      <button class="btn ${done ? 'btn-ghost' : 'btn-primary'}" type="button" id="toggle-done">${done ? 'Terminée · marquer à refaire' : 'Marquer comme terminée'}</button>
      ${next ? `<a class="btn btn-ghost" href="${lessonHref(next.m, next.l)}">Leçon suivante</a>` : ''}
      <span class="small muted">Vos questions sur cette leçon : discussion ci-dessous ou salon Discord <b>#${esc(m.id)}</b>.</span>
    </div>
    <nav class="lesson-nav" aria-label="Leçons voisines">
      ${prev ? `<a href="${lessonHref(prev.m, prev.l)}"><span class="small">Précédent</span><b>${esc(prev.l.title)}</b></a>` : '<span></span>'}
      ${next ? `<a class="next" href="${lessonHref(next.m, next.l)}"><span class="small">Suivant</span><b>${esc(next.l.title)}</b></a>` : '<span></span>'}
    </nav>
    <section id="comments" class="mt-lg"></section>`;

  window.scrollTo({ top: 0 });
  $('#note').addEventListener('input', (e) => store.setNote(m.id, l.id, e.target.value));
  $('#toggle-done').addEventListener('click', () => {
    if (store.isDone(m.id, l.id)) store.markUndone(m.id, l.id);
    else store.markDone(m.id, l.id);
    renderSidebar(lessonRef(m, l));
    viewLesson(modId, lessonId);
  });
  $('#quiz-submit')?.addEventListener('click', () => gradeQuiz(m, l, quiz));
  mountComments(m, l);
}

function gradeQuiz(m, l, quiz) {
  let score = 0;
  quiz.forEach((q, qi) => {
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
  const pct = Math.round((score / quiz.length) * 100);
  const passed = pct >= QUIZ_PASS_PCT;
  $('#quiz-result').innerHTML = `Score : <b class="${passed ? 'ok-text' : 'warn-text'}">${score}/${quiz.length}</b> ${passed ? '· validé' : '· relisez les points en surbrillance et réessayez.'}`;
  if (passed && !store.isDone(m.id, l.id)) {
    store.markDone(m.id, l.id, { score: pct });
    renderSidebar(lessonRef(m, l));
    const btn = $('#toggle-done');
    btn.textContent = 'Terminée · marquer à refaire';
    btn.className = 'btn btn-ghost';
  }
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
  const attrs = {
    repo: g.repo,
    'repo-id': g.repoId,
    category: g.category,
    'category-id': g.categoryId,
    mapping: 'specific',
    term: `${m.id}/${l.id} — ${l.title}`,
    strict: '1',
    'reactions-enabled': '1',
    'emit-metadata': '0',
    'input-position': 'top',
    theme: 'transparent_dark',
    lang: 'fr',
  };
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(`data-${k}`, v);
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
  const eligible = Boolean(state.license) && pp.total > 0 && pp.pct === 100;
  main.innerHTML = `
    <div class="no-print mb-md">
      <div class="eyebrow">Certificat</div>
      <h1 class="h1-sm">Certificat de programme</h1>
      <p class="muted">Délivré lorsque 100 % des leçons de votre palier sont validées. Progression : <b>${pp.done}/${pp.total}</b> leçons du palier (${p.done}/${p.total} au total).</p>
      <div class="field"><label for="cert-name">Nom à faire figurer</label><input type="text" id="cert-name" value="${esc(name)}" placeholder="Prénom Nom" autocomplete="name"></div>
      ${eligible ? `<button class="btn btn-primary" type="button" id="print">Imprimer ou enregistrer en PDF</button>` : `<div class="notice warn">Terminez toutes les leçons de votre palier pour débloquer le certificat.</div>`}
    </div>
    <div class="certificate ${eligible ? '' : 'pending'}">
      <div class="eyebrow eyebrow-center">${esc(config.site.name)}</div>
      <h1>Certificat de réussite</h1>
      <p class="muted">atteste que</p>
      <div class="name" id="cert-name-out">${esc(name || '— votre nom —')}</div>
      <p>a complété avec succès le programme <b>${esc(config.site.name)}</b>, palier <b>${esc(TIER_LABEL[state.license?.tier || 'free'])}</b>,<br>${pp.total} leçons sur la conception, l’exploitation et l’audit des systèmes isolés.</p>
      <div class="meta">Délivré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · Licence ${esc(state.license?.fp || '')} · ${esc(config.site.url)}</div>
    </div>`;
  $('#cert-name').addEventListener('input', (e) => {
    store.setName(e.target.value);
    $('#cert-name-out').textContent = e.target.value || '— votre nom —';
  });
  $('#print')?.addEventListener('click', () => window.print());
}

function viewSettings() {
  const lic = state.license;
  main.innerHTML = `
    <div class="eyebrow">Réglages</div>
    <h1 class="h1-sm">Votre espace</h1>
    <div class="card mb-sm">
      <h3>Licence</h3>
      ${lic ? `<p class="muted">Palier <b>${esc(TIER_LABEL[lic.tier])}</b> · empreinte <code>${esc(lic.fp)}</code> · activée le ${new Date(lic.activatedAt).toLocaleDateString('fr-FR')}</p><button class="btn btn-ghost btn-sm" type="button" id="logout">Retirer la licence de cet appareil</button>` : `<p class="muted">Aucune licence active.</p><a class="btn btn-primary btn-sm" href="${url('acces/')}">Activer</a>`}
    </div>
    <div class="card mb-sm">
      <h3>Progression et notes</h3>
      <p class="muted">Stockées localement dans ce navigateur. Exportez pour changer d’appareil ou conserver une sauvegarde (la licence n’est jamais incluse).</p>
      <div class="settings-actions">
        <button class="btn btn-ghost btn-sm" type="button" id="export">Exporter (JSON)</button>
        <label class="btn btn-ghost btn-sm">Importer <input type="file" accept="application/json" id="import" hidden></label>
        <button class="btn btn-ghost btn-sm btn-danger-text" type="button" id="reset">Réinitialiser la progression</button>
      </div>
      <p id="settings-msg" class="small mt-sm" aria-live="polite"></p>
    </div>
    <div class="card">
      <h3>Support</h3>
      <p class="muted">Accès, facture, upgrade : <a href="mailto:${esc(config.site.contactEmail)}">${esc(config.site.contactEmail)}</a></p>
    </div>`;
  $('#logout')?.addEventListener('click', () => {
    store.clearLicense();
    location.href = url('acces/');
  });
  $('#export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store.exportAll(), null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `airgap42-progression-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    URL.revokeObjectURL(a.href);
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
    if (!window.confirm('Effacer toute la progression et les notes de cet appareil ?')) return;
    store.resetProgress();
    renderSidebar();
    $('#settings-msg').textContent = 'Progression réinitialisée.';
  });
}

// ---------- Routeur ----------
function route() {
  const h = location.hash || '#/';
  const parts = h.slice(2).split('/').filter(Boolean);
  const activeRef = parts[0] === 'm' ? h : null;
  renderSidebar(activeRef);
  let view;
  if (parts[0] === 'm' && parts[1] && parts[2]) view = viewLesson(parts[1], parts[2]);
  else if (parts[0] === 'verrou') view = viewLocked(parts[1]);
  else if (parts[0] === 'certificat') view = viewCertificate();
  else if (parts[0] === 'reglages') view = viewSettings();
  else view = viewDashboard();
  Promise.resolve(view).then(() => applyIcons(main));
}

async function init() {
  try {
    const r = await fetch(url('data/curriculum.json'));
    if (!r.ok) throw new Error(String(r.status));
    state.curriculum = await r.json();
  } catch {
    main.innerHTML = `<div class="notice err">Impossible de charger le programme. Lancez <code>npm run build</code> puis servez <code>dist/</code>.</div>`;
    return;
  }
  const toggle = $('#sidebar-toggle');
  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  window.addEventListener('hashchange', route);
  route();
}
init();
