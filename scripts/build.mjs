#!/usr/bin/env node
/**
 * Construit le site public → dist/
 *
 * Le site est de la DOCUMENTATION. Il ne contient aucune leçon : le parcours vit dans
 * l'archive de niveaux (site/telechargements/airgap42-labs.tar.gz), construite à part par
 * `npm run lab` et versionnée dans le dépôt. La publication n'a donc besoin d'aucun secret
 * et ne chiffre rien : il n'y a rien à protéger ici.
 *
 * Produit : dist/ (copie de site/), data/niveaux.json, sitemap.xml, feed.xml, robots.txt,
 * build.json, .nojekyll et, si un domaine personnalisé est configuré, CNAME.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');

const log = (m) => process.stdout.write(`  ${m}\n`);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

async function main() {
  const t0 = Date.now();
  const config = (await import(path.join(SITE, 'config.js'))).default;
  const siteUrl = (process.env.SITE_URL || config.site.url || '').replace(/\/$/, '');
  console.log('\n▶ Build du site L’Air Gap 42');

  const niveaux = await fs.readFile(path.join(CONTENT, 'niveaux.json'), 'utf8').then(JSON.parse).catch(() => null);
  if (!niveaux) throw new Error('content/niveaux.json absent : lancez d’abord `npm run lab`.');

  const archive = path.join(SITE, 'telechargements', niveaux.archive.nom);
  const stat = await fs.stat(archive).catch(() => null);
  if (!stat) throw new Error(`Archive ${niveaux.archive.nom} absente : lancez « npm run lab ».`);
  if (stat.size !== niveaux.archive.octets) throw new Error('L’archive ne correspond plus à content/niveaux.json : relancez « npm run lab ».');

  await fs.rm(DIST, { recursive: true, force: true });
  await copyDir(SITE, DIST);
  log(`site/ copié · archive ${Math.round(stat.size / 1024)} Ko`);

  await writeJSON('data/niveaux.json', niveaux);
  await writeJSON('data/build.json', {
    builtAt: new Date().toISOString(),
    version: JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf8')).version,
    commit: process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'local',
    niveaux: niveaux.niveaux.length,
    archive: niveaux.archive,
  });

  const pages = ['', 'programme/', 'briefing/', 'jouer/', 'tarifs/', 'communaute/', 'acces/', 'merci/', 'legal/'];
  await fs.writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map((p) => `  <url><loc>${siteUrl}/${p}</loc><changefreq>weekly</changefreq></url>`)
      .join('\n')}\n</urlset>\n`,
  );

  const libres = niveaux.niveaux.filter((n) => n.palier === 'libre');
  await fs.writeFile(
    path.join(DIST, 'feed.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>${esc(config.site.name)}</title>\n<link>${siteUrl}/</link>\n<description>${esc(config.site.tagline)}</description>\n${libres
      .map((n) => `<item><title>${esc(`Niveau ${n.n} — ${n.titre}`)}</title><link>${siteUrl}/jouer/</link><description>${esc(`${n.module} · ~${n.minutes} min`)}</description></item>`)
      .join('\n')}\n</channel></rss>\n`,
  );

  await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  if (config.site.customDomain) await fs.writeFile(path.join(DIST, 'CNAME'), config.site.customDomain + '\n');
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');

  log(`${niveaux.niveaux.length} niveaux référencés (${libres.length} libres)`);
  console.log(`✔ dist/ prêt en ${Date.now() - t0} ms\n`);
}

main().catch((e) => {
  console.error('\n✖ Build échoué :', e.message, '\n');
  process.exit(1);
});
