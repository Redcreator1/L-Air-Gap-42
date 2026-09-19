#!/usr/bin/env node
/**
 * Build L'Air Gap 42 → dist/
 *
 * - Copie site/ vers dist/
 * - Lit content/curriculum.json + content/modules/**.md
 * - Leçons gratuites  → dist/data/lessons/<module>/<lesson>.json (clair)
 * - Modules premium   → dist/data/modules/<module>.enc.json (AES-256-GCM)
 * - Clés de contenu enveloppées par palier → dist/data/keys.json
 *   (PBKDF2-SHA256 sur la clé de licence vendue au client)
 * - Génère sitemap.xml, feed.xml, search.json, build.json
 *
 * Variables d'environnement (secrets GitHub Actions) :
 *   CONTENT_MASTER_SECRET     secret maître → clés de contenu par palier (HKDF)
 *   LICENSE_KEY_ESSENTIEL     clé de licence vendue pour le palier Essentiel
 *   LICENSE_KEY_PRO           clé de licence vendue pour le palier Pro
 *   LICENSE_KEY_ELITE         clé de licence vendue pour le palier Elite
 *   SITE_URL                  URL publique (sinon config.js → site.url)
 *
 * Sans secrets, le build tourne en MODE DÉMO avec des clés publiques
 * (voir docs/SETUP.md). Aucune dépendance npm : Node ≥ 20 suffit.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { webcrypto as crypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const { subtle } = crypto;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');

const TIERS = ['essentiel', 'pro', 'elite'];
const TIER_RANK = { free: 0, essentiel: 1, pro: 2, elite: 3 };
const PBKDF2_ITERATIONS = 310_000;

const DEMO = {
  master: 'airgap42-demo-master-secret',
  licenses: {
    essentiel: 'AG42-DEMO-ESSENTIEL-2026',
    pro: 'AG42-DEMO-PRO-2026',
    elite: 'AG42-DEMO-ELITE-2026',
  },
};

const enc = new TextEncoder();
const b64 = (buf) => Buffer.from(buf).toString('base64');

function log(msg) {
  process.stdout.write(`  ${msg}\n`);
}

async function readConfig() {
  // site/config.js est un module ESM `export default {...}` : on l'importe tel quel.
  const mod = await import(path.join(SITE, 'config.js'));
  return mod.default;
}

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

async function writeJSON(rel, data) {
  const p = path.join(DIST, rel);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data));
}

// ---------- Crypto ----------
async function deriveContentKey(master, tier) {
  const base = await subtle.importKey('raw', enc.encode(master), 'HKDF', false, ['deriveBits']);
  const bits = await subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: enc.encode('l-air-gap-42/content/v1'), info: enc.encode(`tier:${tier}`) },
    base,
    256,
  );
  return new Uint8Array(bits);
}

async function aesKeyFromRaw(raw, usages) {
  return subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, usages);
}

async function encryptWithRaw(rawKey, plaintextBytes) {
  const key = await aesKeyFromRaw(rawKey, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintextBytes);
  return { iv: b64(iv), ct: b64(ct) };
}

async function pbkdf2(passphrase, salt) {
  const normalized = passphrase.trim().toUpperCase().replace(/\s+/g, '');
  const base = await subtle.importKey('raw', enc.encode(normalized), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    base,
    256,
  );
  return new Uint8Array(bits);
}

// ---------- Markdown helpers ----------
function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '');
  }
  return { meta, body: md.slice(m[0].length) };
}

function extractQuiz(body) {
  // Bloc ```quiz { ...json... } ``` → tableau de questions
  const re = /```quiz\s*\n([\s\S]*?)```/g;
  const questions = [];
  const cleaned = body.replace(re, (_, json) => {
    try {
      const q = JSON.parse(json);
      questions.push(...(Array.isArray(q) ? q : [q]));
    } catch (e) {
      throw new Error(`Quiz JSON invalide : ${e.message}\n${json}`);
    }
    return '';
  });
  return { body: cleaned.trim(), quiz: questions };
}

function excerpt(body, n = 220) {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`\[\]]/g, '')
    .replace(/\(https?:[^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > n ? text.slice(0, n).replace(/\s\S*$/, '') + '…' : text;
}

function wordCount(body) {
  return body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
}

// ---------- Main ----------
async function main() {
  const t0 = Date.now();
  const config = await readConfig();
  const siteUrl = (process.env.SITE_URL || config.site.url || '').replace(/\/$/, '');

  const master = process.env.CONTENT_MASTER_SECRET || DEMO.master;
  const licenses = {
    essentiel: process.env.LICENSE_KEY_ESSENTIEL || DEMO.licenses.essentiel,
    pro: process.env.LICENSE_KEY_PRO || DEMO.licenses.pro,
    elite: process.env.LICENSE_KEY_ELITE || DEMO.licenses.elite,
  };
  const demoMode = !process.env.CONTENT_MASTER_SECRET || TIERS.some((t) => !process.env[`LICENSE_KEY_${t.toUpperCase()}`]);
  // Publication publique sans vraies clés : le contenu payant est EXCLU du build.
  // Sinon la clé de démonstration, affichée sur le site, ouvrirait les 42 leçons à tout le monde.
  const prelaunch = demoMode && process.env.PUBLIC_DEPLOY === '1';

  console.log(
    `\n▶ Build L'Air Gap 42 ${prelaunch ? '(PRÉ-LANCEMENT — secrets absents : contenu payant non publié)' : demoMode ? '(MODE DÉMO — clés publiques, voir docs/SETUP.md)' : '(production)'}`,
  );

  await rmrf(DIST);
  await copyDir(SITE, DIST);
  log('site/ copié');

  // ----- Curriculum -----
  const curriculum = JSON.parse(await fs.readFile(path.join(CONTENT, 'curriculum.json'), 'utf8'));
  const publicCurriculum = { ...curriculum, modules: [] };
  const searchIndex = [];
  const feedItems = [];
  let stats = { lessons: 0, free: 0, premium: 0, words: 0 };

  const contentKeys = {};
  for (const tier of TIERS) contentKeys[tier] = await deriveContentKey(master, tier);

  for (const mod of curriculum.modules) {
    const modDir = path.join(CONTENT, 'modules', mod.dir);
    const pubMod = { ...mod, lessons: [] };
    delete pubMod.dir;
    const premiumPayload = { id: mod.id, lessons: {} };

    for (const lesson of mod.lessons) {
      const file = path.join(modDir, lesson.file);
      const raw = await fs.readFile(file, 'utf8');
      const { meta, body: withQuiz } = parseFrontmatter(raw);
      const { body, quiz } = extractQuiz(withQuiz);
      const isFree = mod.tier === 'free' || lesson.free === true;
      const minutes = Number(lesson.minutes || meta.minutes || Math.max(5, Math.round(wordCount(body) / 180) + 4));
      const pubLesson = {
        id: lesson.id,
        title: lesson.title,
        day: lesson.day ?? null,
        minutes,
        free: isFree,
        excerpt: excerpt(body),
        hasQuiz: quiz.length > 0,
        words: wordCount(body),
      };
      delete pubLesson.file;
      pubMod.lessons.push(pubLesson);
      stats.lessons++;
      stats.words += pubLesson.words;

      const payload = { id: lesson.id, module: mod.id, title: lesson.title, body, quiz, resources: lesson.resources || [] };
      if (isFree) {
        stats.free++;
        await writeJSON(`data/lessons/${mod.id}/${lesson.id}.json`, payload);
        searchIndex.push({ m: mod.id, l: lesson.id, t: lesson.title, x: body.slice(0, 4000), free: true });
        feedItems.push({ title: `${mod.title} — ${lesson.title}`, link: `${siteUrl}/app/#/m/${mod.id}/${lesson.id}`, desc: pubLesson.excerpt });
      } else {
        stats.premium++;
        premiumPayload.lessons[lesson.id] = payload;
        searchIndex.push({ m: mod.id, l: lesson.id, t: lesson.title, x: pubLesson.excerpt, free: false });
      }
    }

    if (mod.tier !== 'free' && !prelaunch) {
      const bytes = enc.encode(JSON.stringify(premiumPayload));
      const { iv, ct } = await encryptWithRaw(contentKeys[mod.tier], bytes);
      await writeJSON(`data/modules/${mod.id}.enc.json`, { v: 1, alg: 'AES-256-GCM', tier: mod.tier, module: mod.id, iv, ct });
    }
    publicCurriculum.modules.push(pubMod);
  }
  await writeJSON('data/curriculum.json', publicCurriculum);
  log(`${stats.lessons} leçons (${stats.free} gratuites, ${stats.premium} premium), ${stats.words.toLocaleString('fr-FR')} mots`);

  // ----- Enveloppes de clés (keys.json) -----
  // Pour chaque licence L : PBKDF2(licence) chiffre les clés de contenu des paliers ≤ L.
  const keysFile = { v: 1, kdf: 'PBKDF2-SHA256', iterations: PBKDF2_ITERATIONS, licenses: {} };
  for (const lic of prelaunch ? [] : TIERS) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const wrapKey = await pbkdf2(licenses[lic], salt);
    const check = await encryptWithRaw(wrapKey, enc.encode(`ok:${lic}`));
    const wrapped = {};
    for (const tier of TIERS) {
      if (TIER_RANK[tier] <= TIER_RANK[lic]) wrapped[tier] = await encryptWithRaw(wrapKey, contentKeys[tier]);
    }
    keysFile.licenses[lic] = { salt: b64(salt), check, keys: wrapped };
  }
  await writeJSON('data/keys.json', keysFile);
  log(prelaunch ? 'contenu payant NON publié (aucun module chiffré, aucune enveloppe de clé)' : 'keys.json généré (enveloppes PBKDF2 → AES-GCM)');

  // ----- Fichiers dérivés -----
  await writeJSON('data/search.json', searchIndex);
  await writeJSON('data/build.json', {
    builtAt: new Date().toISOString(),
    demo: demoMode && !prelaunch,
    prelaunch,
    demoLicenses: demoMode && !prelaunch ? DEMO.licenses : undefined,
    version: JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf8')).version,
    commit: process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'local',
  });

  const pages = ['', 'programme/', 'tarifs/', 'communaute/', 'acces/', 'app/', 'merci/', 'legal/'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${siteUrl}/${p}</loc><changefreq>weekly</changefreq></url>`)
    .join('\n')}\n</urlset>\n`;
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap);

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>${esc(config.site.name)}</title>\n<link>${siteUrl}/</link>\n<description>${esc(config.site.tagline)}</description>\n${feedItems
    .map((i) => `<item><title>${esc(i.title)}</title><link>${i.link}</link><description>${esc(i.desc)}</description></item>`)
    .join('\n')}\n</channel></rss>\n`;
  await fs.writeFile(path.join(DIST, 'feed.xml'), feed);

  await fs.writeFile(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /app/\nDisallow: /data/\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
  if (config.site.customDomain) await fs.writeFile(path.join(DIST, 'CNAME'), config.site.customDomain + '\n');
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');

  log(`sitemap.xml, feed.xml, robots.txt, search.json${config.site.customDomain ? ', CNAME' : ''}`);
  console.log(`✔ dist/ prêt en ${Date.now() - t0} ms\n`);
  if (prelaunch) {
    console.log('  Pré-lancement : seules les leçons gratuites sont publiées.');
    console.log('  Définissez CONTENT_MASTER_SECRET et LICENSE_KEY_* (secrets GitHub) pour publier le programme complet.\n');
  } else if (demoMode) {
    console.log('  Clés de licence DÉMO actives :');
    for (const [t, k] of Object.entries(DEMO.licenses)) console.log(`    ${t.padEnd(10)} ${k}`);
    console.log('  → Définissez CONTENT_MASTER_SECRET et LICENSE_KEY_* (secrets GitHub) pour la production.\n');
  }
}

main().catch((e) => {
  console.error('\n✖ Build échoué :', e.message);
  process.exit(1);
});
