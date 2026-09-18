#!/usr/bin/env node
/**
 * Vérifications avant build / en CI :
 *  1. curriculum.json cohérent (ids uniques, fichiers présents, jours croissants)
 *  2. chaque leçon a un frontmatter valide, un quiz JSON valide avec réponse dans les choix
 *  3. les liens internes des pages du site pointent vers des fichiers existants
 *  4. test de bout en bout du chiffrement : build en mémoire → déchiffrement avec la clé démo
 * Sort avec un code ≠ 0 en cas d'erreur. Aucune dépendance.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { webcrypto as crypto } from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warn = [];
const err = (m) => errors.push(m);

// ---------- 1 & 2 : curriculum + leçons ----------
const cur = JSON.parse(await fs.readFile(path.join(ROOT, 'content/curriculum.json'), 'utf8'));
const ids = new Set();
let lessons = 0;
for (const m of cur.modules) {
  if (!['free', 'essentiel', 'pro', 'elite'].includes(m.tier)) err(`Module ${m.id} : tier inconnu « ${m.tier} »`);
  if (ids.has(m.id)) err(`Module ${m.id} : id dupliqué`);
  ids.add(m.id);
  let lastDay = 0;
  for (const l of m.lessons) {
    lessons++;
    const key = `${m.id}/${l.id}`;
    if (ids.has(key)) err(`Leçon ${key} : id dupliqué`);
    ids.add(key);
    if (l.day !== undefined) {
      if (l.day <= lastDay) err(`Leçon ${key} : jour ${l.day} non croissant`);
      lastDay = l.day;
    }
    const file = path.join(ROOT, 'content/modules', m.dir, l.file);
    let raw;
    try {
      raw = await fs.readFile(file, 'utf8');
    } catch {
      err(`Leçon ${key} : fichier manquant ${path.relative(ROOT, file)}`);
      continue;
    }
    if (!/^---\n[\s\S]*?\n---\n/.test(raw)) warn.push(`Leçon ${key} : pas de frontmatter (minutes calculées automatiquement)`);
    const words = raw.split(/\s+/).length;
    if (words < 150) warn.push(`Leçon ${key} : contenu court (${words} mots)`);
    const quizzes = [...raw.matchAll(/```quiz\s*\n([\s\S]*?)```/g)];
    for (const [, json] of quizzes) {
      let q;
      try {
        q = JSON.parse(json);
      } catch (e) {
        err(`Leçon ${key} : quiz JSON invalide (${e.message})`);
        continue;
      }
      for (const [i, item] of (Array.isArray(q) ? q : [q]).entries()) {
        if (!item.q || !Array.isArray(item.choices) || item.choices.length < 2) err(`Leçon ${key} : quiz #${i + 1} incomplet`);
        else if (typeof item.answer !== 'number' || item.answer < 0 || item.answer >= item.choices.length) err(`Leçon ${key} : quiz #${i + 1} réponse hors choix`);
      }
    }
  }
}

// ---------- 3 : liens internes du site ----------
const SITE = path.join(ROOT, 'site');
async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}
const generated = new Set(['sitemap.xml', 'feed.xml', 'robots.txt', 'CNAME', 'data']);
for (const file of (await walk(SITE)).filter((f) => f.endsWith('.html'))) {
  const html = await fs.readFile(file, 'utf8');
  // Uniquement le HTML statique : on ignore les <script> (gabarits JS) et les attributs data-href.
  const staticHtml = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [, ref] of staticHtml.matchAll(/(?<![\w-])(?:href|src)="([^"#?]+)/g)) {
    if (/^(https?:|mailto:|data:|\/\/|#)/.test(ref) || ref.startsWith('/L-Air-Gap-42/') || ref.includes('${')) continue;
    const clean = ref.replace(/#.*$/, '');
    const target = path.resolve(path.dirname(file), clean);
    const rel = path.relative(SITE, target);
    if (generated.has(rel.split(path.sep)[0])) continue;
    const exists = await fs
      .stat(target)
      .then((s) => (s.isDirectory() ? fs.stat(path.join(target, 'index.html')).then(() => true) : true))
      .catch(() => false);
    if (!exists) err(`${path.relative(ROOT, file)} : lien cassé « ${ref} »`);
  }
}

// ---------- 4 : test de bout en bout du chiffrement ----------
{
  const tmp = await fs.mkdtemp(path.join(ROOT, '.check-'));
  try {
    // Build vers dist/ (le script ne prend pas de destination : on sauvegarde/restaure dist/ si présent)
    const distPath = path.join(ROOT, 'dist');
    const hadDist = await fs.stat(distPath).then(() => true).catch(() => false);
    if (hadDist) await fs.rename(distPath, path.join(tmp, 'dist-backup'));
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs')], { stdio: 'pipe', env: { ...process.env, CONTENT_MASTER_SECRET: '', LICENSE_KEY_ESSENTIEL: '', LICENSE_KEY_PRO: '', LICENSE_KEY_ELITE: '' } });
    const keys = JSON.parse(await fs.readFile(path.join(distPath, 'data/keys.json'), 'utf8'));
    const build = JSON.parse(await fs.readFile(path.join(distPath, 'data/build.json'), 'utf8'));
    // Réimplémentation minimale du client (miroir de site/assets/js/crypto.js)
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const b64d = (s) => Uint8Array.from(Buffer.from(s, 'base64'));
    const pbkdf2 = async (pass, salt, it) => {
      const k = await crypto.subtle.importKey('raw', enc.encode(pass.trim().toUpperCase().replace(/\s+/g, '')), 'PBKDF2', false, ['deriveBits']);
      return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: it }, k, 256));
    };
    const aes = async (raw, { iv, ct }) => {
      const k = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']);
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(iv) }, k, b64d(ct));
    };
    const expect = { essentiel: ['m1', 'm2'], pro: ['m1', 'm2', 'm3', 'm4', 'm5'], elite: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] };
    for (const [lic, pass] of Object.entries(build.demoLicenses)) {
      const entry = keys.licenses[lic];
      const wrap = await pbkdf2(pass, b64d(entry.salt), keys.iterations);
      const check = dec.decode(await aes(wrap, entry.check));
      if (check !== `ok:${lic}`) err(`Crypto : contrôle d'enveloppe ${lic} échoué`);
      const contentKeys = {};
      for (const [tier, blob] of Object.entries(entry.keys)) contentKeys[tier] = new Uint8Array(await aes(wrap, blob));
      for (const modId of expect[lic]) {
        const encFile = JSON.parse(await fs.readFile(path.join(distPath, `data/modules/${modId}.enc.json`), 'utf8'));
        if (!contentKeys[encFile.tier]) {
          err(`Crypto : licence ${lic} devrait ouvrir ${modId} (tier ${encFile.tier})`);
          continue;
        }
        const payload = JSON.parse(dec.decode(await aes(contentKeys[encFile.tier], encFile)));
        if (!payload.lessons || Object.keys(payload.lessons).length === 0) err(`Crypto : module ${modId} vide après déchiffrement`);
      }
      // Une licence inférieure ne doit PAS avoir la clé des paliers supérieurs
      const forbidden = lic === 'essentiel' ? ['pro', 'elite'] : lic === 'pro' ? ['elite'] : [];
      for (const t of forbidden) if (contentKeys[t]) err(`Crypto : licence ${lic} ne doit pas contenir la clé ${t}`);
    }
    // Mauvaise licence → aucune enveloppe ne s'ouvre
    const bad = await pbkdf2('AG42-FAUX-00000', b64d(keys.licenses.pro.salt), keys.iterations);
    const opened = await aes(bad, keys.licenses.pro.check).then(() => true).catch(() => false);
    if (opened) err('Crypto : une licence invalide a ouvert une enveloppe');
    await fs.rm(distPath, { recursive: true, force: true });
    if (hadDist) await fs.rename(path.join(tmp, 'dist-backup'), distPath);
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

// ---------- Rapport ----------
console.log(`\n▶ check : ${cur.modules.length} modules, ${lessons} leçons`);
for (const w of warn) console.log(`  ⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  ✖ ${e}`);
  console.error(`\n✖ ${errors.length} erreur(s)\n`);
  process.exit(1);
}
console.log('✔ curriculum, quiz, liens et chiffrement OK\n');
