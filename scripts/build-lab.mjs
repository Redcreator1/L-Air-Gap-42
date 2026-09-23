#!/usr/bin/env node
/**
 * Construit l'archive de niveaux téléchargeable : site/telechargements/airgap42-labs.tar.gz
 *
 *   npm run lab
 *
 * Chaque niveau est chiffré avec AES-256-CBC / PBKDF2 au format natif d'OpenSSL, si bien que
 * le lanceur en shell le déchiffre avec la seule commande `openssl enc`. Aucune dépendance,
 * ni pour construire, ni pour jouer.
 *
 * Passe-phrase d'un niveau : "<licence du palier>:<identifiant du niveau>:<réponse du niveau
 * précédent>" — il faut donc avoir payé ET avoir joué. Le premier niveau n'a pas de maillon.
 * Les niveaux libres utilisent la licence publique « libre ».
 *
 * Les clés de licence sont lues dans lab/licences.json (hors dépôt) ou dans les variables
 * LICENCE_ESSENTIEL / LICENCE_PRO / LICENCE_ELITE. À défaut, elles sont tirées au hasard et
 * écrites dans lab/licences.json : conservez ce fichier, il ne part pas sur GitHub.
 *
 * L'archive produite est COMMITÉE dans le dépôt. La chaîne de publication ne rechiffre donc
 * jamais rien et n'a besoin d'aucun secret.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { pbkdf2Sync, createCipheriv, randomBytes, createHash } from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const LAB = path.join(ROOT, 'lab');
const OUT_DIR = path.join(ROOT, 'site/telechargements');
const ITER = 310_000;
const TIERS = ['essentiel', 'pro', 'elite'];
const LARGEUR = 76;

/** Extrait de présentation (vitrine) : quelques lignes de la leçon, sans les marques. */
function extrait(corps, n = 200) {
  const texte = corps
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,4}\s+.*$/gm, '')
    .replace(/[#>*_`\[\]|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return texte.length > n ? texte.slice(0, n).replace(/\s\S*$/, '') + '…' : texte;
}
const log = (m) => process.stdout.write(`  ${m}\n`);

// ---------------------------------------------------------------- licences
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans I/O/0/1
const groupe = (n) => Array.from(randomBytes(n), (b) => ALPHABET[b % ALPHABET.length]).join('');
const nouvelleCle = (tier) => `AG42-${tier.slice(0, 3).toUpperCase()}-${groupe(5)}-${groupe(5)}-${groupe(5)}`;

async function licences() {
  const fichier = path.join(LAB, 'licences.json');
  const depuisEnv = Object.fromEntries(TIERS.map((t) => [t, process.env[`LICENCE_${t.toUpperCase()}`]]).filter(([, v]) => v));
  if (TIERS.every((t) => depuisEnv[t])) return { valeurs: depuisEnv, nouvelles: false };

  const existant = await fs.readFile(fichier, 'utf8').then(JSON.parse).catch(() => null);
  if (existant && TIERS.every((t) => existant[t])) return { valeurs: existant, nouvelles: false };

  const valeurs = Object.fromEntries(TIERS.map((t) => [t, nouvelleCle(t)]));
  await fs.writeFile(fichier, JSON.stringify(valeurs, null, 2) + '\n');
  return { valeurs, nouvelles: true };
}

// ------------------------------------------------------- chiffrement OpenSSL
/** Produit exactement ce que lit `openssl enc -d -aes-256-cbc -pbkdf2 -iter N -md sha256 -base64`. */
function chiffrerOpenSSL(texte, passe) {
  const sel = randomBytes(8);
  const derive = pbkdf2Sync(Buffer.from(passe, 'utf8'), sel, ITER, 48, 'sha256');
  const chiffreur = createCipheriv('aes-256-cbc', derive.subarray(0, 32), derive.subarray(32, 48));
  const corps = Buffer.concat([chiffreur.update(Buffer.from(texte, 'utf8')), chiffreur.final()]);
  const brut = Buffer.concat([Buffer.from('Salted__', 'ascii'), sel, corps]);
  return (brut.toString('base64').match(/.{1,64}/g) || []).join('\n') + '\n';
}

// ------------------------------------------------------- rendu terminal
function habiller(texte, indent = '  ') {
  const mots = texte.split(/\s+/).filter(Boolean);
  const lignes = [];
  let courante = '';
  for (const mot of mots) {
    if ((courante + ' ' + mot).trim().length > LARGEUR - indent.length) {
      lignes.push(indent + courante.trim());
      courante = mot;
    } else courante += ' ' + mot;
  }
  if (courante.trim()) lignes.push(indent + courante.trim());
  return lignes.join('\n');
}

const enleverMarques = (s) =>
  s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1$2');

/** Markdown → texte lisible dans un terminal 80 colonnes. */
function rendreTexte(markdown) {
  const lignes = markdown.replace(/\r\n?/g, '\n').split('\n');
  const sortie = [];
  let i = 0;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) {
      i++;
      if (sortie.at(-1) !== '') sortie.push('');
      continue;
    }
    let m;
    if ((m = l.match(/^```(\w*)\s*$/))) {
      i++;
      const buf = [];
      while (i < lignes.length && !/^```\s*$/.test(lignes[i])) buf.push('    ' + lignes[i++]);
      i++;
      sortie.push(...buf, '');
      continue;
    }
    if ((m = l.match(/^:::(\w+)\s*(.*)$/))) {
      i++;
      const buf = [];
      while (i < lignes.length && !/^:::\s*$/.test(lignes[i])) buf.push(lignes[i++]);
      i++;
      const titre = (m[2] || m[1]).toUpperCase();
      sortie.push(`  ┌── ${titre} ${'─'.repeat(Math.max(0, LARGEUR - 8 - titre.length))}`);
      sortie.push(...rendreTexte(buf.join('\n')).split('\n').map((x) => '  │' + x.replace(/^ {2}/, ' ')));
      sortie.push(`  └${'─'.repeat(LARGEUR - 3)}`, '');
      continue;
    }
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
      const t = enleverMarques(m[2]);
      sortie.push('', '  ' + t.toUpperCase(), '  ' + '─'.repeat(Math.min(LARGEUR - 2, t.length)), '');
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) {
      sortie.push('  ' + '─'.repeat(LARGEUR - 2), '');
      i++;
      continue;
    }
    if (/^\s*>/.test(l)) {
      const buf = [];
      while (i < lignes.length && /^\s*>/.test(lignes[i])) buf.push(lignes[i++].replace(/^\s*>\s?/, ''));
      sortie.push(habiller(enleverMarques(buf.join(' ')), '  │ '), '');
      continue;
    }
    if (/^\s*[-*+]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l)) {
      while (i < lignes.length && (/^\s*[-*+]\s+/.test(lignes[i]) || /^\s*\d+[.)]\s+/.test(lignes[i]))) {
        const brut = lignes[i++];
        const puce = brut.match(/^\s*(\d+)[.)]\s+/) ? brut.match(/^\s*(\d+)[.)]\s+/)[1] + '.' : '•';
        const corps = enleverMarques(brut.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')).replace(/^\[( |x|X)\]\s+/, (_, c) => (c === ' ' ? '[ ] ' : '[x] '));
        const enveloppe = habiller(corps, '     ').replace(/^ {5}/, `   ${puce.padEnd(2)}`);
        sortie.push(enveloppe);
      }
      sortie.push('');
      continue;
    }
    if (/^\|.*\|\s*$/.test(l)) {
      while (i < lignes.length && /^\|.*\|\s*$/.test(lignes[i])) sortie.push('  ' + enleverMarques(lignes[i++].trim()));
      sortie.push('');
      continue;
    }
    const para = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{1,4}\s|```|:::|\s*>|\s*[-*+]\s|\s*\d+[.)]\s|\|)/.test(lignes[i])) para.push(lignes[i++].trim());
    sortie.push(habiller(enleverMarques(para.join(' '))), '');
  }
  // On enlève les lignes vides en tête et en queue sans toucher à l'indentation.
  return sortie.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\s+$/, '');
}

// ------------------------------------------------------------------ contenu
function separerFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? md.slice(m[0].length) : md;
}

/**
 * Normalisation d'une réponse. Le lanceur applique STRICTEMENT la même en shell
 * (minuscules ASCII, bords rognés, espaces internes réduits à un seul) : toute
 * divergence ici rendrait un niveau impossible à ouvrir chez l'apprenant.
 */
export const normaliserReponse = (s) => s.toLowerCase().trim().replace(/\s+/g, ' ');

/** Une leçon porte une épreuve unique : c'est une serrure, pas un contrôle de lecture. */
function extraireEpreuve(corps) {
  let epreuve = null;
  const nettoye = corps.replace(/```epreuve\s*\n([\s\S]*?)```/g, (_, json) => {
    epreuve = JSON.parse(json);
    return '';
  });
  return { corps: nettoye.trim(), epreuve };
}

function blocEpreuve(epreuve, n) {
  if (!epreuve) return '';
  const lignes = ['', '  ÉPREUVE', '  ' + '─'.repeat(7), '', habiller(epreuve.enonce, '  '), ''];
  lignes.push(`  Répondez avec :  ./airgap42 valider ${n}`);
  return lignes.join('\n');
}

// -------------------------------------------------------------------- build
async function main() {
  const t0 = Date.now();
  console.log('\n▶ Construction de l’archive de niveaux');

  const { valeurs: cles, nouvelles } = await licences();
  const curriculum = JSON.parse(await fs.readFile(path.join(CONTENT, 'curriculum.json'), 'utf8'));

  const travail = path.join(ROOT, '.lab-build/airgap42-labs');
  await fs.rm(path.join(ROOT, '.lab-build'), { recursive: true, force: true });
  await fs.mkdir(path.join(travail, 'niveaux'), { recursive: true });

  const index = [];
  const publique = { titre: curriculum.title, version: curriculum.version, modules: [], niveaux: [] };
  let n = 0;
  let mots = 0;
  // Maillon courant de la chaîne : la réponse du niveau précédent, qui ouvre le suivant.
  let reponsePrecedente = null;

  for (const mod of curriculum.modules) {
    const modPublic = { id: mod.id, titre: mod.title, court: mod.short || mod.title, palier: mod.tier === 'free' ? 'libre' : mod.tier, jours: mod.days, resume: mod.summary || '', niveaux: [] };
    publique.modules.push(modPublic);
    for (const lecon of mod.lessons) {
      n += 1;
      const brut = await fs.readFile(path.join(CONTENT, 'modules', mod.dir, lecon.file), 'utf8');
      const { corps, epreuve } = extraireEpreuve(separerFrontmatter(brut));
      if (!epreuve || !epreuve.enonce || !epreuve.reponse) {
        throw new Error(`Leçon ${mod.dir}/${lecon.file} : bloc \`\`\`epreuve manquant ou incomplet. Sans lui, la chaîne des niveaux est rompue.`);
      }
      // Entête de contrôle : déchiffré avec une mauvaise clé, AES-CBC rend des octets
      // parasites sans forcément signaler d'erreur. Ce marqueur tranche sans ambiguïté.
      const texte = 'AG42/1\n' + rendreTexte(corps) + '\n' + blocEpreuve(epreuve, n);
      mots += corps.split(/\s+/).length;

      const palier = mod.tier === 'free' ? 'libre' : mod.tier;
      const id = `${mod.id}-${lecon.id}`;

      // Enveloppes de clés : le niveau est chiffré une fois avec une clé de contenu tirée au
      // hasard, et cette clé est réemballée sous chaque licence qui y donne droit. Une licence
      // Elite ouvre donc aussi les niveaux Essentiel et Pro, sans dupliquer le contenu.
      //
      // La passe-phrase enchaîne la réponse du niveau précédent : il faut donc AVOIR PAYÉ
      // (la licence) ET AVOIR JOUÉ (la réponse trouvée) pour ouvrir un niveau. C'est le
      // modèle OverTheWire, greffé sur le modèle d'accès payant.
      const cleContenu = randomBytes(32).toString('base64url');
      await fs.writeFile(path.join(travail, 'niveaux', `${id}.enc`), chiffrerOpenSSL(texte, cleContenu));
      const maillon = reponsePrecedente ? `:${reponsePrecedente}` : '';
      const ayantsDroit = palier === 'libre' ? [['libre', 'libre']] : TIERS.filter((t) => TIERS.indexOf(t) >= TIERS.indexOf(palier)).map((t) => [t, cles[t]]);
      for (const [nom, licence] of ayantsDroit) {
        await fs.writeFile(path.join(travail, 'niveaux', `${id}.k.${nom}`), chiffrerOpenSSL(`AG42/1\n${cleContenu}`, `${licence}:${id}${maillon}`));
      }

      // Témoin de réponse : il ne dépend d'aucune licence, pour qu'un apprenant puisse valider
      // le dernier niveau de son palier même si le suivant ne lui appartient pas.
      const reponse = normaliserReponse(epreuve.reponse);
      await fs.writeFile(path.join(travail, 'niveaux', `${id}.v`), chiffrerOpenSSL(`AG42/1\n${id}`, reponse));
      reponsePrecedente = reponse;

      const minutes = lecon.minutes || Math.max(5, Math.round(corps.split(/\s+/).length / 180) + 4);
      index.push([n, id, lecon.title.replace(/\|/g, '/'), palier, lecon.day ?? '', minutes].join('|'));

      const fiche = { n, id, titre: lecon.title, module: mod.title, palier, jour: lecon.day ?? null, minutes, epreuve: true, extrait: extrait(corps) };
      publique.niveaux.push(fiche);
      modPublic.niveaux.push(fiche);
    }
  }

  // Sceaux de licence : la passe-phrase d'un niveau contient désormais la réponse précédente,
  // que le lanceur n'a pas encore au moment où l'on enregistre une clé. Ces petits fichiers
  // ne dépendent que de la licence, et servent uniquement à reconnaître le palier acheté.
  for (const t of TIERS) {
    await fs.writeFile(path.join(travail, 'niveaux', `sceau.${t}`), chiffrerOpenSSL(`AG42/1\n${t}`, cles[t]));
  }

  await fs.writeFile(path.join(travail, 'niveaux', 'index'), index.join('\n') + '\n');
  await fs.copyFile(path.join(LAB, 'airgap42'), path.join(travail, 'airgap42'));
  await fs.chmod(path.join(travail, 'airgap42'), 0o755);
  await fs.copyFile(path.join(LAB, 'LISEZMOI'), path.join(travail, 'LISEZMOI'));
  log(`${n} niveaux chiffrés (${mots.toLocaleString('fr-FR')} mots)`);

  await fs.mkdir(OUT_DIR, { recursive: true });
  const archive = path.join(OUT_DIR, 'airgap42-labs.tar.gz');
  // --sort et --mtime rendent l'archive reproductible : pas de diff inutile dans le dépôt.
  execFileSync(
    'tar',
    ['--sort=name', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner', '-czf', archive, '-C', path.join(ROOT, '.lab-build'), 'airgap42-labs'],
    { stdio: 'pipe' },
  );
  const empreinte = createHash('sha256').update(await fs.readFile(archive)).digest('hex');
  await fs.writeFile(path.join(OUT_DIR, 'airgap42-labs.tar.gz.sha256'), `${empreinte}  airgap42-labs.tar.gz\n`);
  await fs.writeFile(path.join(CONTENT, 'niveaux.json'), JSON.stringify({ ...publique, archive: { nom: 'airgap42-labs.tar.gz', sha256: empreinte, octets: (await fs.stat(archive)).size } }, null, 2) + '\n');
  await fs.rm(path.join(ROOT, '.lab-build'), { recursive: true, force: true });

  const ko = Math.round((await fs.stat(archive)).size / 1024);
  log(`archive ${ko} Ko · sha256 ${empreinte.slice(0, 16)}…`);
  console.log(`✔ terminé en ${Date.now() - t0} ms\n`);

  if (nouvelles) {
    console.log('  ⚠ Nouvelles clés de licence générées (lab/licences.json, hors dépôt) :\n');
    for (const t of TIERS) console.log(`    ${t.padEnd(10)} ${cles[t]}`);
    console.log('\n  Conservez-les : ce sont elles que vous vendez. Sans elles, impossible de');
    console.log('  reconstruire l’archive avec les mêmes accès.\n');
  }
}

// Exécuté seulement en ligne de commande : scripts/check.mjs importe ce module pour
// réutiliser `normaliserReponse`, et il ne doit surtout pas déclencher un build.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`\n✖ ${e.message}\n`);
    process.exit(1);
  });
}
