#!/usr/bin/env node
/**
 * Vérifications avant build et en intégration continue :
 *   1. curriculum.json cohérent (identifiants uniques, fichiers présents, jours croissants)
 *   2. chaque leçon porte une épreuve unique, dont la réponse est saisissable en shell
 *   3. les liens internes des pages du site pointent vers des fichiers existants
 *   4. l'archive de niveaux correspond à content/niveaux.json (taille et empreinte)
 *   5. un niveau libre se déchiffre réellement avec openssl, comme chez l'apprenant
 *
 * Aucune dépendance npm. Sort avec un code ≠ 0 en cas d'erreur.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import os from 'node:os';

import { normaliserReponse } from './build-lab.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const erreurs = [];
const alertes = [];
const err = (m) => erreurs.push(m);
/** Les épreuves dans l'ordre du curriculum — c'est aussi l'ordre des niveaux. */
const epreuves = [];

// ---------- 1 & 2 : curriculum et quiz ----------
const cur = JSON.parse(await fs.readFile(path.join(ROOT, 'content/curriculum.json'), 'utf8'));
const ids = new Set();
let lecons = 0;
for (const m of cur.modules) {
  if (!['free', 'essentiel', 'pro', 'elite'].includes(m.tier)) err(`Module ${m.id} : palier inconnu « ${m.tier} »`);
  if (ids.has(m.id)) err(`Module ${m.id} : identifiant dupliqué`);
  ids.add(m.id);
  let dernierJour = 0;
  for (const l of m.lessons) {
    lecons++;
    const cle = `${m.id}/${l.id}`;
    if (ids.has(cle)) err(`Leçon ${cle} : identifiant dupliqué`);
    ids.add(cle);
    if (l.day !== undefined) {
      if (l.day <= dernierJour) err(`Leçon ${cle} : jour ${l.day} non croissant`);
      dernierJour = l.day;
    }
    const fichier = path.join(ROOT, 'content/modules', m.dir, l.file);
    let brut;
    try {
      brut = await fs.readFile(fichier, 'utf8');
    } catch {
      err(`Leçon ${cle} : fichier manquant ${path.relative(ROOT, fichier)}`);
      continue;
    }
    const mots = brut.split(/\s+/).length;
    if (mots < 150) alertes.push(`Leçon ${cle} : contenu court (${mots} mots)`);

    // Chaque leçon porte exactement une épreuve : c'est la serrure du niveau suivant.
    // Sans elle, la chaîne est rompue et plus personne ne peut avancer.
    const blocs = [...brut.matchAll(/```epreuve\s*\n([\s\S]*?)```/g)];
    if (blocs.length === 0) {
      err(`Leçon ${cle} : aucun bloc \`\`\`epreuve — la chaîne des niveaux serait rompue`);
      continue;
    }
    if (blocs.length > 1) err(`Leçon ${cle} : ${blocs.length} épreuves, une seule est attendue`);
    let ep;
    try {
      ep = JSON.parse(blocs[0][1]);
    } catch (e) {
      err(`Leçon ${cle} : épreuve JSON invalide (${e.message})`);
      continue;
    }
    if (typeof ep.enonce !== 'string' || !ep.enonce.trim()) err(`Leçon ${cle} : épreuve sans énoncé`);
    if (typeof ep.reponse !== 'string' || !ep.reponse.trim()) {
      err(`Leçon ${cle} : épreuve sans réponse`);
      continue;
    }
    const rep = normaliserReponse(ep.reponse);
    // Le lanceur normalise en shell avec `tr` et `sed`, qui ne connaissent que l'ASCII :
    // une réponse accentuée deviendrait impossible à saisir correctement.
    if (!/^[a-z0-9][a-z0-9 ._:/-]*$/.test(rep)) err(`Leçon ${cle} : réponse « ${rep} » — minuscules ASCII, chiffres, espace et . _ : / - uniquement`);
    if (rep.length < 2) err(`Leçon ${cle} : réponse « ${rep} » trop courte pour être une serrure`);
    if (typeof ep.enonce === 'string' && ep.enonce.toLowerCase().includes(rep)) err(`Leçon ${cle} : la réponse figure dans son propre énoncé`);
    if (!brut.toLowerCase().includes(rep)) alertes.push(`Leçon ${cle} : la réponse n’apparaît nulle part dans la leçon — est-elle vraiment dérivable ?`);
    epreuves.push({ cle, id: `${m.id}-${l.id}`, reponse: rep });
  }
}

// ---------- 2 bis : engagements commerciaux ----------
// Ce qui est affiché sur le site engage le vendeur. On vérifie que chaque service annoncé
// dispose au moins de ce qu'il faut pour être tenu.
const config = (await import(path.join(SITE, 'config.js'))).default;
const engagements = config.engagements || {};
const prerequis = {
  lives: [['community.liveSessions.url', config.community?.liveSessions?.url], ['community.discordInvite', config.community?.discordInvite]],
  replays: [['community.discordInvite', config.community?.discordInvite]],
  mastermind: [['community.discordInvite', config.community?.discordInvite]],
  revuePairs: [['community.discordInvite', config.community?.discordInvite]],
};
const utilisable = (v) => typeof v === 'string' && /^https?:\/\//.test(v) && !/REMPLACER/i.test(v);
for (const [cle, actif] of Object.entries(engagements)) {
  if (!actif) continue;
  for (const [nom, valeur] of prerequis[cle] || []) {
    if (!utilisable(valeur)) err(`Engagement « ${cle} » activé mais ${nom} n’est pas configuré : le site promet un service injoignable.`);
  }
}
const actifs = Object.entries(engagements).filter(([, v]) => v).map(([k]) => k);
if (actifs.length) alertes.push(`Engagements affichés sur le site (vous devrez les tenir) : ${actifs.join(', ')}`);

// ---------- 3 : liens internes ----------
async function parcourir(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await parcourir(p)));
    else out.push(p);
  }
  return out;
}
const genere = new Set(['sitemap.xml', 'feed.xml', 'robots.txt', 'CNAME', 'data']);
for (const fichier of (await parcourir(SITE)).filter((f) => f.endsWith('.html'))) {
  const html = (await fs.readFile(fichier, 'utf8')).replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [, ref] of html.matchAll(/(?<![\w-])(?:href|src)="([^"#?]+)/g)) {
    if (/^(https?:|mailto:|data:|\/\/|#)/.test(ref) || ref.startsWith('/L-Air-Gap-42/') || ref.includes('${')) continue;
    const cible = path.resolve(path.dirname(fichier), ref.replace(/#.*$/, ''));
    const rel = path.relative(SITE, cible);
    if (genere.has(rel.split(path.sep)[0])) continue;
    const existe = await fs
      .stat(cible)
      .then((s) => (s.isDirectory() ? fs.stat(path.join(cible, 'index.html')).then(() => true) : true))
      .catch(() => false);
    if (!existe) err(`${path.relative(ROOT, fichier)} : lien cassé « ${ref} »`);
  }
}

// ---------- 4 & 5 : archive de niveaux ----------
const niveaux = await fs.readFile(path.join(ROOT, 'content/niveaux.json'), 'utf8').then(JSON.parse).catch(() => null);
if (!niveaux) {
  err('content/niveaux.json absent : lancez « npm run lab ».');
} else {
  if (niveaux.niveaux.length !== lecons) err(`L’archive décrit ${niveaux.niveaux.length} niveaux pour ${lecons} leçons : relancez « npm run lab ».`);
  const archive = path.join(SITE, 'telechargements', niveaux.archive.nom);
  const contenu = await fs.readFile(archive).catch(() => null);
  if (!contenu) err(`Archive ${niveaux.archive.nom} absente : lancez « npm run lab ».`);
  else {
    if (contenu.length !== niveaux.archive.octets) err('Taille de l’archive différente de content/niveaux.json : relancez « npm run lab ».');
    const empreinte = createHash('sha256').update(contenu).digest('hex');
    if (empreinte !== niveaux.archive.sha256) err('Empreinte de l’archive différente de content/niveaux.json : relancez « npm run lab ».');

    // Partie simulée de bout en bout, avec la même commande openssl que le lanceur.
    // C'est LE contrôle qui compte : un maillon cassé au build, et l'apprenant se
    // retrouve définitivement bloqué sans pouvoir rien y faire.
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ag42-'));
    try {
      execFileSync('tar', ['xzf', archive, '-C', tmp], { stdio: 'pipe' });
      const base = path.join(tmp, 'airgap42-labs', 'niveaux');
      const ouvrir = (fichier, passe) =>
        execFileSync('openssl', ['enc', '-d', '-aes-256-cbc', '-pbkdf2', '-iter', '310000', '-md', 'sha256', '-base64', '-pass', `pass:${passe}`, '-in', fichier], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      const essaie = (fichier, passe) => {
        try {
          const t = ouvrir(fichier, passe);
          return t.startsWith('AG42/1') ? t.split('\n').slice(1).join('\n') : null;
        } catch {
          return null; // openssl refuse : c'est un échec de déchiffrement, pas un bug
        }
      };

      if (epreuves.length !== niveaux.niveaux.length) err(`${epreuves.length} épreuves pour ${niveaux.niveaux.length} niveaux : l’archive est désynchronisée du contenu.`);

      // Les licences ne sont pas dans le dépôt : sans elles on ne rejoue que les niveaux
      // libres, ce qui reste suffisant pour valider la mécanique de chaînage.
      const lic = await fs.readFile(path.join(ROOT, 'lab/licences.json'), 'utf8').then(JSON.parse).catch(() => null);
      let joues = 0;
      for (const [i, nv] of niveaux.niveaux.entries()) {
        const ep = epreuves[i];
        if (!ep) break;

        // a. Le témoin de réponse s'ouvre avec la réponse, et avec elle seule.
        const temoin = essaie(path.join(base, `${nv.id}.v`), ep.reponse);
        if (temoin === null) err(`Niveau ${nv.n} : la réponse « ${ep.reponse} » n’ouvre pas son témoin.`);
        else if (temoin.trim() !== nv.id) err(`Niveau ${nv.n} : témoin de réponse incohérent.`);

        // b. Le contenu s'ouvre avec la licence du palier ET la réponse précédente.
        const licence = nv.palier === 'libre' ? 'libre' : lic?.[nv.palier];
        if (!licence) continue;
        const maillon = i > 0 ? `:${epreuves[i - 1].reponse}` : '';
        const cle = essaie(path.join(base, `${nv.id}.k.${nv.palier}`), `${licence}:${nv.id}${maillon}`);
        if (cle === null) {
          err(`Niveau ${nv.n} : la réponse du niveau ${i} n’ouvre pas ce niveau — la chaîne est rompue ici.`);
          continue;
        }
        const texte = essaie(path.join(base, `${nv.id}.enc`), cle.trim());
        if (texte === null) err(`Niveau ${nv.n} : contenu illisible avec sa propre clé.`);
        else if (texte.length < 400) err(`Niveau ${nv.n} : contenu déchiffré anormalement court.`);
        joues++;
      }
      alertes.push(lic ? `Partie simulée : ${joues}/${niveaux.niveaux.length} niveaux rejoués de bout en bout.` : `Partie simulée : ${joues} niveaux libres rejoués (lab/licences.json absent, paliers payants non vérifiés).`);

      // c. Ce qui ne doit surtout PAS marcher.
      const n2 = niveaux.niveaux[1];
      if (n2 && essaie(path.join(base, `${n2.id}.k.${n2.palier}`), `libre:${n2.id}:mauvaise-reponse`) !== null) err('Une réponse fausse a ouvert le niveau 2.');
      if (essaie(path.join(base, `${niveaux.niveaux[0].id}.enc`), 'cle-invalide') !== null) err('Une clé invalide a ouvert un niveau.');
      const paye = niveaux.niveaux.find((n) => n.palier !== 'libre');
      if (paye) {
        const enveloppes = (await fs.readdir(base)).filter((f) => f.startsWith(`${paye.id}.k.`));
        if (enveloppes.includes(`${paye.id}.k.libre`)) err(`Niveau payant ${paye.id} : une enveloppe « libre » a été publiée.`);
        if (enveloppes.length === 0) err(`Niveau payant ${paye.id} : aucune enveloppe de clé.`);
      }
      // d. Les sceaux de licence, qui servent à « ./airgap42 licence ».
      for (const t of ['essentiel', 'pro', 'elite']) {
        const sceau = path.join(base, `sceau.${t}`);
        if (!(await fs.stat(sceau).catch(() => null))) err(`Sceau de licence manquant pour le palier ${t}.`);
        else if (lic && essaie(sceau, lic[t])?.trim() !== t) err(`Sceau ${t} : la licence ne l’ouvre pas — « ./airgap42 licence » refusera la clé vendue.`);
      }
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  }
}

// ---------- rapport ----------
console.log(`\n▶ check : ${cur.modules.length} modules, ${lecons} leçons, ${niveaux?.niveaux.length ?? 0} niveaux`);
for (const a of alertes) console.log(`  ⚠ ${a}`);
if (erreurs.length) {
  for (const e of erreurs) console.error(`  ✖ ${e}`);
  console.error(`\n✖ ${erreurs.length} erreur(s)\n`);
  process.exit(1);
}
console.log('✔ curriculum, épreuves, liens, archive et chaîne des niveaux OK\n');
