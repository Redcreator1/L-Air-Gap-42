#!/usr/bin/env node
/**
 * Test de bout en bout du site construit (dist/), servi sous le même chemin de base que
 * GitHub Pages. Le site est de la documentation : on vérifie qu'il est complet, cohérent
 * avec l'archive de niveaux, et qu'il n'expose ni lien mort ni contenu payant.
 *
 * Prérequis : npm run lab && npm run build ; npm ci ; npx playwright install chromium
 * Usage : npm run e2e          → code de sortie ≠ 0 si un contrôle échoue
 *         SHOTS=1 npm run e2e  → écrit aussi des captures dans .e2e-shots/
 */
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE = '/L-Air-Gap-42/';
const PORT = Number(process.env.PORT || 4343);
const SHOTS = process.env.SHOTS ? path.join(ROOT, '.e2e-shots') : null;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.gz': 'application/gzip',
  '.sha256': 'text/plain',
};
const server = http
  .createServer(async (req, res) => {
    let p = new URL(req.url, 'http://x').pathname;
    if (!p.startsWith(BASE)) {
      res.statusCode = 404;
      return res.end('hors base');
    }
    p = p.slice(BASE.length - 1);
    if (p.endsWith('/')) p += 'index.html';
    let f = path.join(DIST, p);
    try {
      if ((await fs.stat(f)).isDirectory()) {
        res.writeHead(301, { Location: req.url + '/' });
        return res.end();
      }
    } catch {
      f = path.join(DIST, '404.html');
      res.statusCode = 404;
    }
    res.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream');
    res.end(await fs.readFile(f));
  })
  .listen(PORT);

const failures = [];
const problems = [];
const check = (label, ok, detail = '') => {
  console.log(`${ok ? '  ✔' : '  ✖'} ${label}${detail ? ` (${detail})` : ''}`);
  if (!ok) failures.push(label);
};
const ignorable = (t) => /fonts\.g(oogleapis|static)\.com|ERR_CERT_AUTHORITY_INVALID/.test(t);

const niveaux = JSON.parse(await fs.readFile(path.join(ROOT, 'content/niveaux.json'), 'utf8'));
const config = (await import(path.join(ROOT, 'site/config.js'))).default;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
page.on('console', (m) => m.type() === 'error' && !ignorable(m.text()) && problems.push(`console: ${m.text()}`));
page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
page.on('response', (r) => r.status() >= 400 && !ignorable(r.url()) && !r.url().endsWith('/nope/') && problems.push(`HTTP ${r.status()} ${r.url()}`));
const origin = `http://localhost:${PORT}${BASE}`;
const shot = async (name, full = false) => SHOTS && (await fs.mkdir(SHOTS, { recursive: true }), page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: full }));

try {
  console.log('\n▶ e2e');
  for (const p of ['', 'programme/', 'briefing/', 'jouer/', 'tarifs/', 'communaute/', 'acces/', 'merci/', 'legal/']) {
    await page.goto(origin + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    check(`page ${p || '/'} : nav + pied de page rendus`, (await page.locator('#nav .brand').count()) === 1 && (await page.locator('#footer').innerText()).includes('©'));
  }

  await page.goto(origin, { waitUntil: 'networkidle' });
  const boites = await page.locator('.icon-box').count();
  check('accueil : toutes les icônes sont injectées', boites > 0 && (await page.locator('.icon-box svg').count()) === boites, `${boites} icônes`);
  check(
    'accueil : aucun service non tenu n’est annoncé',
    await page.evaluate(() => !document.querySelector('[data-engagement]')),
  );
  check(
    config.testimonials.length ? 'accueil : témoignages affichés' : 'accueil : section témoignages masquée quand vide',
    (await page.locator('[data-section="testimonials"]').count()) === (config.testimonials.length ? 1 : 0),
  );
  const auteur = config.site.instructor.name;
  check(
    auteur ? 'accueil : présentation de l’auteur affichée' : 'accueil : section auteur masquée quand vide',
    auteur
      ? (await page.locator('#instructor').innerText()).includes(auteur)
      : (await page.locator('[data-section="instructor"]').count()) === 0,
  );
  // Un prix barré n'est licite que s'il a réellement été pratiqué : on refuse le prix barré fictif.
  check('tarifs : aucun prix barré fictif', (await page.locator('.price .before').count()) === config.checkout.tiers.filter((t) => t.priceBefore).length);
  await page.waitForTimeout(2200);
  await shot('home', true);

  // --- Briefing : l'actif d'acquisition. Il doit rester lisible sans rien demander en échange.
  await page.goto(origin + 'briefing/', { waitUntil: 'networkidle' });
  check('briefing : les sept erreurs sont toutes rédigées', (await page.locator('.prose h2[id^="e"]').count()) === 7);
  check('briefing : aucune inscription exigée pour lire', (await page.locator('form, input[type=email]').count()) === 0);

  // --- Jouer : la page qui remplace l'espace membre
  await page.goto(origin + 'jouer/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  check('jouer : empreinte de l’archive affichée et conforme', (await page.locator('#empreinte').innerText()).trim() === niveaux.archive.sha256);
  check('jouer : les commandes sont copiables', (await page.locator('pre code').count()) >= 4);
  const dl = await page.locator('a[href$="airgap42-labs.tar.gz"]').first().getAttribute('href');
  const rep = await page.request.get(new URL(dl, origin + 'jouer/').toString());
  check('jouer : archive téléchargeable', rep.status() === 200 && Number(rep.headers()['content-length'] || 0) === niveaux.archive.octets, `${rep.status()}`);
  await shot('jouer', true);

  // --- Programme : index des niveaux
  await page.goto(origin + 'programme/', { waitUntil: 'networkidle' });
  check('programme : tous les niveaux listés', (await page.locator('.lesson-row').count()) === niveaux.niveaux.length, `${niveaux.niveaux.length}`);
  check('programme : 7 modules', (await page.locator('.module').count()) === 7);

  // --- Tarifs
  await page.goto(origin + 'tarifs/', { waitUntil: 'networkidle' });
  check('tarifs : 3 offres', (await page.locator('.price-card').count()) === 3);
  check('tarifs : FAQ', (await page.locator('#faq details').count()) >= 4);
  check('tarifs : un seul attribut class par bouton', await page.evaluate(() => [...document.querySelectorAll('.price-card .btn')].every((a) => a.outerHTML.split('class=').length === 2)));
  const liens = await page.locator('[data-checkout]').count();
  const attente = await page.locator('[data-waitlist]').count();
  const boutons = await page.locator('.pay-slot').count();
  check(
    boutons === 3 ? 'tarifs : 3 boutons PayPal' : liens === 3 ? 'tarifs : 3 liens de paiement' : 'tarifs : mode pré-lancement (liste d’attente + bandeau)',
    boutons === 3 || liens === 3 || (attente === 3 && (await page.locator('#checkout-pending').count()) === 1),
    `paypal=${boutons} liens=${liens} attente=${attente}`,
  );
  check(
    'tarifs : kit PayPal chargé seulement si un identifiant client est configuré',
    (await page.evaluate(() => [...document.scripts].some((s) => s.src.includes('paypal.com/sdk')))) === (boutons === 3),
  );

  // --- Invariants du nouveau modèle
  check('aucune URL gabarit exposée', await page.evaluate(() => ![...document.querySelectorAll('a[href]')].some((a) => /REMPLACER/i.test(a.getAttribute('href')))));
  const sansContenu = await Promise.all(
    ['data/keys.json', 'data/search.json', 'app/'].map(async (p) => (await page.request.get(origin + p)).status() === 404),
  );
  check('le site ne publie plus aucun contenu payant ni espace membre', sansContenu.every(Boolean));

  // --- Mobile
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(origin + 'jouer/', { waitUntil: 'networkidle' });
  check('mobile : pas de défilement horizontal', !(await mob.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)));
  await mob.click('.nav-burger');
  check('mobile : menu ouvert', (await mob.locator('.nav.open').count()) === 1);
  await mob.close();

  check('aucune erreur console / réseau / CSP', problems.length === 0, problems.join(' | '));

  const r404 = await page.goto(origin + 'nope/', { waitUntil: 'networkidle' });
  check('404 : page stylée servie', r404.status() === 404 && (await page.locator('#nav .brand').count()) === 1);
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n✖ ${failures.length} contrôle(s) en échec\n`);
  process.exit(1);
}
console.log('\n✔ e2e OK\n');
