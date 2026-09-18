/** Page Programme : rendu du curriculum public (data/curriculum.json). */
import { url, esc, TIER_LABEL } from '../site.js';

const RANK = { free: 0, essentiel: 1, pro: 2, elite: 3 };
const hours = (lessons) => Math.round((lessons.reduce((a, l) => a + l.minutes, 0) / 60) * 10) / 10;
const isFree = (m, l) => m.tier === 'free' || l.free;

async function main() {
  const host = document.getElementById('modules');
  let cur;
  try {
    const r = await fetch(url('data/curriculum.json'));
    if (!r.ok) throw new Error(String(r.status));
    cur = await r.json();
  } catch {
    host.innerHTML = '<p class="notice err">Programme indisponible. Le site doit être servi depuis le dossier construit (npm run build).</p>';
    return;
  }
  const lessons = cur.modules.flatMap((m) => m.lessons);

  document.getElementById('stats').innerHTML = [
    [cur.modules.length, 'modules'],
    [lessons.length, 'leçons'],
    [`${Math.round(lessons.reduce((a, l) => a + l.minutes, 0) / 60)} h`, 'de contenu'],
    [lessons.filter((l) => l.hasQuiz).length, 'quiz'],
  ]
    .map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`)
    .join('');

  host.innerHTML = cur.modules
    .map(
      (m, i) => `<article class="module ${i === 0 ? 'open' : ''}">
      <button class="module-head" type="button" aria-expanded="${i === 0}">
        <span class="module-num">${String(i).padStart(2, '0')}</span>
        <span><h3>${esc(m.title)}</h3><span class="module-meta">${m.lessons.length} leçons · ${esc(m.days)} · ${hours(m.lessons)} h</span></span>
        <span class="tier-tag ${esc(m.tier)}">${TIER_LABEL[m.tier]}</span>
      </button>
      <div class="module-body">
        <p class="muted module-summary">${esc(m.summary || '')}</p>
        ${m.lessons
          .map(
            (l) => `<div class="lesson-row ${isFree(m, l) ? 'free' : ''}">
              <span class="day">${l.day ? 'J' + l.day : '—'}</span>
              <span><span class="title">${isFree(m, l) ? `<a href="${url(`app/#/m/${m.id}/${l.id}`)}">${esc(l.title)}</a>` : esc(l.title)}</span><br><span class="small muted">${esc(l.excerpt)}</span></span>
              <span class="dur">${l.minutes} min</span>
            </div>`,
          )
          .join('')}
      </div>
    </article>`,
    )
    .join('');

  for (const b of host.querySelectorAll('.module-head')) {
    b.addEventListener('click', () => {
      const open = b.parentElement.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
    });
  }

  const cell = (ok) => `<td class="${ok ? 'ok' : 'no'}">${ok ? 'Inclus' : '—'}</td>`;
  document.getElementById('matrix').innerHTML =
    cur.modules.map((m) => `<tr><td>${esc(m.title)}</td>${['essentiel', 'pro', 'elite'].map((t) => cell(RANK[t] >= RANK[m.tier])).join('')}</tr>`).join('') +
    [
      ['Lives hebdomadaires et revue d’architecture', [false, true, true]],
      ['Bibliothèque de templates', [false, true, true]],
      ['Coaching 1:1 (3 × 60 min) et mastermind', [false, false, true]],
      ['Kit d’audit IEC 62443 / NIS2 / ISO 27001', [false, false, true]],
    ]
      .map(([label, cols]) => `<tr><td>${label}</td>${cols.map(cell).join('')}</tr>`)
      .join('');
}

main();
