/** Page Programme : index des niveaux, lu depuis data/niveaux.json produit par `npm run lab`. */
import { url, esc } from '../site.js';

const RANG = { libre: 0, essentiel: 1, pro: 2, elite: 3 };
const LABEL = { libre: 'Gratuit', essentiel: 'Essentiel', pro: 'Pro', elite: 'Elite' };
const heures = (niveaux) => Math.round((niveaux.reduce((a, l) => a + l.minutes, 0) / 60) * 10) / 10;

async function main() {
  const host = document.getElementById('modules');
  let data;
  try {
    const r = await fetch(url('data/niveaux.json'));
    if (!r.ok) throw new Error(String(r.status));
    data = await r.json();
  } catch {
    host.innerHTML = '<p class="notice err">Programme indisponible. Le site doit être servi depuis le dossier construit.</p>';
    return;
  }
  const tous = data.niveaux;

  document.getElementById('stats').innerHTML = [
    [data.modules.length, 'modules'],
    [tous.length, 'niveaux'],
    [`${Math.round(tous.reduce((a, l) => a + l.minutes, 0) / 60)} h`, 'de contenu'],
    [tous.filter((l) => l.questions > 0).length, 'validations'],
  ]
    .map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`)
    .join('');

  host.innerHTML = data.modules
    .map(
      (m, i) => `<article class="module ${i === 0 ? 'open' : ''}">
      <button class="module-head" type="button" aria-expanded="${i === 0}">
        <span class="module-num">${String(i).padStart(2, '0')}</span>
        <span><h3>${esc(m.titre)}</h3><span class="module-meta">${m.niveaux.length} niveaux · ${esc(m.jours || '')} · ${heures(m.niveaux)} h</span></span>
        <span class="tier-tag ${esc(m.palier === 'libre' ? 'free' : m.palier)}">${LABEL[m.palier]}</span>
      </button>
      <div class="module-body">
        <p class="muted module-summary">${esc(m.resume)}</p>
        ${m.niveaux
          .map(
            (l) => `<div class="lesson-row ${l.palier === 'libre' ? 'free' : ''}">
              <span class="day">${l.jour ? 'J' + l.jour : 'N' + l.n}</span>
              <span><span class="title">${esc(l.titre)}</span><br><span class="small muted">${esc(l.extrait)}</span></span>
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

  const cellule = (ok) => `<td class="${ok ? 'ok' : 'no'}">${ok ? 'Inclus' : '—'}</td>`;
  document.getElementById('matrix').innerHTML =
    data.modules.map((m) => `<tr><td>${esc(m.titre)}</td>${['essentiel', 'pro', 'elite'].map((t) => cellule(RANG[t] >= RANG[m.palier])).join('')}</tr>`).join('') +
    [
      ['Lives hebdomadaires et revue d’architecture', [false, true, true]],
      ['Bibliothèque de templates', [false, true, true]],
      ['Coaching 1:1 (3 × 60 min) et mastermind', [false, false, true]],
      ['Kit d’audit IEC 62443 / NIS2 / ISO 27001', [false, false, true]],
    ]
      .map(([label, cols]) => `<tr><td>${label}</td>${cols.map(cellule).join('')}</tr>`)
      .join('');
}

main();
