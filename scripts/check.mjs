#!/usr/bin/env node
/**
 * Vérifications avant build et en intégration continue :
 *   1. curriculum.json cohérent (identifiants uniques, fichiers présents, jours croissants)
 *   2. chaque leçon a un quiz valide dont la réponse figure parmi les choix
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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const erreurs = [];
const alertes = [];
const err = (m) => erreurs.push(m);

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
    const blocs = [...brut.matchAll(/```quiz\s*\n([\s\S]*?)```/g)];
    if (blocs.length === 0) alertes.push(`Leçon ${cle} : aucun quiz, le niveau sera validé sans question`);
    for (const [, json] of blocs) {
      let q;
      try {
        q = JSON.parse(json);
      } catch (e) {
        err(`Leçon ${cle} : quiz JSON invalide (${e.message})`);
        continue;
      }
      for (const [i, item] of (Array.isArray(q) ? q : [q]).entries()) {
        if (!item.q || !Array.isArray(item.choices) || item.choices.length < 2) err(`Leçon ${cle} : quiz #${i + 1} incomplet`);
        else if (typeof item.answer !== 'number' || item.answer < 0 || item.answer >= item.choices.length) err(`Leçon ${cle} : quiz #${i + 1} réponse hors choix`);
        else if (item.choices.length > 4) err(`Leçon ${cle} : quiz #${i + 1} — 4 choix maximum (le lanceur attend a, b, c ou d)`);
      }
    }
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

    // Déchiffrement réel d'un niveau libre, avec la même commande que le lanceur.
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ag42-'));
    try {
      execFileSync('tar', ['xzf', archive, '-C', tmp], { stdio: 'pipe' });
      const base = path.join(tmp, 'airgap42-labs', 'niveaux');
      const libre = niveaux.niveaux.find((n) => n.palier === 'libre');
      const ouvrir = (fichier, passe) =>
        execFileSync('openssl', ['enc', '-d', '-aes-256-cbc', '-pbkdf2', '-iter', '310000', '-md', 'sha256', '-base64', '-pass', `pass:${passe}`, '-in', fichier], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      const cle = ouvrir(path.join(base, `${libre.id}.k.libre`), `libre:${libre.id}`).split('\n')[1];
      const texte = ouvrir(path.join(base, `${libre.id}.enc`), cle);
      if (!texte.startsWith('AG42/1')) err('Niveau libre : marqueur d’intégrité absent après déchiffrement.');
      if (texte.length < 500) err('Niveau libre : contenu déchiffré anormalement court.');
      // Une clé bidon ne doit rien ouvrir.
      let ouvertParErreur = false;
      try {
        ouvertParErreur = ouvrir(path.join(base, `${libre.id}.enc`), 'cle-invalide').startsWith('AG42/1');
      } catch {
        /* openssl échoue : comportement attendu */
      }
      if (ouvertParErreur) err('Une clé invalide a ouvert un niveau.');
      // Un niveau payant ne doit pas être ouvrable avec la licence publique.
      const paye = niveaux.niveaux.find((n) => n.palier !== 'libre');
      if (paye) {
        const enveloppes = (await fs.readdir(base)).filter((f) => f.startsWith(`${paye.id}.k.`));
        if (enveloppes.includes(`${paye.id}.k.libre`)) err(`Niveau payant ${paye.id} : une enveloppe « libre » a été publiée.`);
        if (enveloppes.length === 0) err(`Niveau payant ${paye.id} : aucune enveloppe de clé.`);
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
console.log('✔ curriculum, quiz, liens et archive de niveaux OK\n');
