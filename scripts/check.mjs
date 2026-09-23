#!/usr/bin/env node
/**
 * Vérifications du dépôt public, avant build et en intégration continue :
 *   1. les liens internes des pages pointent vers des fichiers existants
 *   2. chaque service annoncé sur le site dispose de quoi être tenu
 *   3. l'archive de niveaux correspond à content/niveaux.json (taille et empreinte)
 *   4. l'archive s'ouvre vraiment : un niveau libre se déchiffre avec openssl, et ce qui
 *      ne doit pas s'ouvrir ne s'ouvre pas
 *
 * Ce dépôt ne contient AUCUNE leçon et AUCUNE réponse : elles vivent dans le dépôt privé
 * Jeux42, qui produit l'archive et la pousse ici. On ne peut donc vérifier ici que le
 * premier maillon de la chaîne — celui qui n'exige aucun secret. C'est voulu : la partie
 * entière est rejouée du côté de la source, avant publication.
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

// ---------- 1 : engagements commerciaux ----------
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

// ---------- 2 : liens internes ----------
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

// ---------- 3 & 4 : archive de niveaux ----------
const niveaux = await fs.readFile(path.join(ROOT, 'content/niveaux.json'), 'utf8').then(JSON.parse).catch(() => null);
if (!niveaux) {
  err('content/niveaux.json absent : il est produit par le dépôt privé Jeux42.');
} else {
  const archive = path.join(SITE, 'telechargements', niveaux.archive.nom);
  const contenu = await fs.readFile(archive).catch(() => null);
  if (!contenu) err(`Archive ${niveaux.archive.nom} absente : elle est poussée ici par le dépôt privé Jeux42.`);
  else {
    if (contenu.length !== niveaux.archive.octets) err('Taille de l’archive différente de content/niveaux.json : les deux fichiers ne viennent pas de la même publication.');
    if (createHash('sha256').update(contenu).digest('hex') !== niveaux.archive.sha256) err('Empreinte de l’archive différente de content/niveaux.json : l’empreinte affichée sur la page Jouer serait fausse.');

    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ag42-'));
    try {
      execFileSync('tar', ['xzf', archive, '-C', tmp], { stdio: 'pipe' });
      const base = path.join(tmp, 'airgap42-labs', 'niveaux');
      const essaie = (fichier, passe) => {
        try {
          const t = execFileSync(
            'openssl',
            ['enc', '-d', '-aes-256-cbc', '-pbkdf2', '-iter', '310000', '-md', 'sha256', '-base64', '-pass', `pass:${passe}`, '-in', fichier],
            { stdio: ['ignore', 'pipe', 'ignore'] },
          ).toString();
          return t.startsWith('AG42/1') ? t.split('\n').slice(1).join('\n') : null;
        } catch {
          return null; // openssl refuse : échec de déchiffrement, pas un bug
        }
      };

      // Le premier niveau est le seul vérifiable sans secret : il n'a pas de maillon
      // précédent, et sa licence est la licence publique « libre ».
      const n1 = niveaux.niveaux[0];
      const cle = essaie(path.join(base, `${n1.id}.k.libre`), `libre:${n1.id}`);
      if (cle === null) err('Niveau 1 : la licence publique ne l’ouvre pas — l’archive publiée est inutilisable en l’état.');
      else {
        const texte = essaie(path.join(base, `${n1.id}.enc`), cle.trim());
        if (texte === null) err('Niveau 1 : contenu illisible avec sa propre clé.');
        else if (texte.length < 400) err('Niveau 1 : contenu déchiffré anormalement court.');
      }

      // Ce qui ne doit surtout pas marcher.
      if (essaie(path.join(base, `${n1.id}.enc`), 'cle-invalide') !== null) err('Une clé invalide a ouvert un niveau.');
      const n2 = niveaux.niveaux[1];
      if (n2 && essaie(path.join(base, `${n2.id}.k.${n2.palier}`), `libre:${n2.id}`) !== null) err('Le niveau 2 s’ouvre sans la réponse du niveau 1 : la chaîne ne tient pas.');
      const paye = niveaux.niveaux.find((n) => n.palier !== 'libre');
      if (paye) {
        const enveloppes = (await fs.readdir(base)).filter((f) => f.startsWith(`${paye.id}.k.`));
        if (enveloppes.includes(`${paye.id}.k.libre`)) err(`Niveau payant ${paye.id} : une enveloppe « libre » a été publiée, le contenu payant est ouvert à tous.`);
        if (enveloppes.length === 0) err(`Niveau payant ${paye.id} : aucune enveloppe de clé.`);
      }
      for (const t of ['essentiel', 'pro', 'elite']) {
        if (!(await fs.stat(path.join(base, `sceau.${t}`)).catch(() => null))) err(`Sceau de licence manquant pour le palier ${t} : « ./airgap42 licence » refusera la clé vendue.`);
      }

      // L'index embarqué dans l'archive et l'index public doivent décrire les mêmes niveaux.
      const lignes = (await fs.readFile(path.join(base, 'index'), 'utf8')).trim().split('\n');
      if (lignes.length !== niveaux.niveaux.length) err(`L’archive contient ${lignes.length} niveaux, l’index public en annonce ${niveaux.niveaux.length}.`);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  }
}

// ---------- 5 : aucune source ne doit revenir ici ----------
// Les leçons en clair et les réponses vivent dans le dépôt privé Jeux42. Si elles
// réapparaissent ici, tout le travail de séparation est annulé sans que personne ne le voie.
for (const interdit of ['content/modules', 'content/curriculum.json', 'lab', 'scripts/build-lab.mjs']) {
  if (await fs.stat(path.join(ROOT, interdit)).catch(() => null)) {
    err(`${interdit} est présent dans le dépôt public : les leçons en clair doivent rester dans Jeux42.`);
  }
}

// ---------- rapport ----------
console.log(`\n▶ check : ${niveaux?.modules.length ?? 0} modules, ${niveaux?.niveaux.length ?? 0} niveaux publiés`);
for (const a of alertes) console.log(`  ⚠ ${a}`);
if (erreurs.length) {
  for (const e of erreurs) console.error(`  ✖ ${e}`);
  console.error(`\n✖ ${erreurs.length} erreur(s)\n`);
  process.exit(1);
}
console.log('✔ liens, engagements, archive publiée et premier maillon OK\n');
