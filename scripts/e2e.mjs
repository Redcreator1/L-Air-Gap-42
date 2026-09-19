#!/usr/bin/env node
/**
 * Test de bout en bout du site construit (dist/), servi sous le même chemin de base que GitHub Pages.
 * Prérequis : npm run build ; npm i (playwright) ; npx playwright install chromium
 * Usage : npm run e2e            → code de sortie ≠ 0 si un contrôle échoue
 *         SHOTS=1 npm run e2e    → écrit aussi des captures dans .e2e-shots/
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
const DEMO = JSON.parse(await fs.readFile(path.join(DIST, 'data/build.json'), 'utf8')).demoLicenses;
if (!DEMO) throw new Error('Le test e2e suppose un build en mode démo (sans secrets).');

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' };
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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
page.on('console', (m) => m.type() === 'error' && !ignorable(m.text()) && problems.push(`console: ${m.text()}`));
page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
page.on('response', (r) => r.status() >= 400 && !ignorable(r.url()) && !r.url().endsWith('/nope/') && problems.push(`HTTP ${r.status()} ${r.url()}`));
const origin = `http://localhost:${PORT}${BASE}`;
const shot = async (name, full = false) => SHOTS && (await fs.mkdir(SHOTS, { recursive: true }), page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: full }));

try {
  console.log('\n▶ e2e');
  for (const p of ['', 'programme/', 'tarifs/', 'communaute/', 'acces/', 'merci/', 'legal/', 'app/']) {
    await page.goto(origin + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    check(`page ${p || '/'} : nav + footer rendus`, (await page.locator('#nav .brand').count()) === 1 && (await page.locator('#footer').innerText()).includes('©'));
  }
  await page.goto(origin, { waitUntil: 'networkidle' });
  check('accueil : icônes SVG injectées', (await page.locator('.icon-box svg').count()) >= 9);
  check('accueil : section témoignages masquée quand vide', (await page.locator('[data-section="testimonials"]').count()) === 0);
  check('accueil : section formateur masquée quand vide', (await page.locator('[data-section="instructor"]').count()) === 0);
  await page.waitForTimeout(2200);
  await shot('home', true);

  await page.goto(origin + 'tarifs/', { waitUntil: 'networkidle' });
  check('tarifs : 3 offres', (await page.locator('.price-card').count()) === 3);
  check('tarifs : FAQ', (await page.locator('#faq details').count()) >= 4);
  check('tarifs : un seul attribut class par bouton', await page.evaluate(() => [...document.querySelectorAll('.price-card .btn')].every((a) => a.outerHTML.split('class=').length === 2)));
  // Avant branchement du paiement : aucun lien mort, une prise de contact à la place.
  const liveCheckout = await page.locator('[data-checkout]').count();
  const waitlist = await page.locator('[data-waitlist]').count();
  check('tarifs : aucun lien de paiement gabarit exposé', await page.evaluate(() => ![...document.querySelectorAll('a[href]')].some((a) => /REMPLACER/i.test(a.getAttribute('href')))));
  check(
    liveCheckout === 3 ? 'tarifs : 3 liens de paiement actifs' : 'tarifs : mode pré-lancement (liste d’attente + bandeau)',
    liveCheckout === 3 ? true : waitlist === 3 && (await page.locator('#checkout-pending').count()) === 1,
    `checkout=${liveCheckout} waitlist=${waitlist}`,
  );

  await page.goto(origin + 'programme/', { waitUntil: 'networkidle' });
  check('programme : 7 modules, 45 leçons', (await page.locator('.module').count()) === 7 && (await page.locator('.lesson-row').count()) === 45);

  await page.goto(origin + 'app/#/m/m0/pourquoi-air-gap', { waitUntil: 'networkidle' });
  await page.waitForSelector('#lesson-body h2');
  check('leçon gratuite : rendu Markdown (h2, tableau, callout, quiz)', (await page.locator('#lesson-body h2').count()) >= 4 && (await page.locator('#lesson-body table').count()) >= 1 && (await page.locator('#lesson-body .callout').count()) >= 1 && (await page.locator('#quiz').count()) === 1);
  check('leçon : aucun HTML brut interprété', (await page.locator('#lesson-body script, #lesson-body iframe').count()) === 0);
  await page.check('input[name=q0][value="1"]');
  await page.check('input[name=q1][value="2"]');
  await page.click('#quiz-submit');
  check('quiz : validé et leçon marquée terminée', (await page.locator('#quiz-result').innerText()).includes('validé') && (await page.locator('.side-lessons .state.done').count()) === 1);
  await shot('lesson-free', true);

  await page.goto(origin + 'app/#/m/m3/sas-transfert', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  check('leçon premium sans licence : verrou', (await page.locator('.lock-screen').count()) === 1);

  await page.goto(origin + 'acces/', { waitUntil: 'networkidle' });
  await page.fill('#key', 'ag42-faux-00000');
  await page.click('#submit');
  await page.waitForSelector('#msg .notice.err', { timeout: 20_000 });
  check('activation : clé invalide refusée', true);
  await page.fill('#key', DEMO.pro.toLowerCase() + ' ');
  await page.click('#submit');
  await page.waitForURL('**/app/**', { timeout: 20_000 });
  await page.waitForTimeout(500);
  check('activation : licence Pro acceptée (casse et espaces ignorés)', page.url().includes('/app/'));
  await shot('dashboard', true);

  await page.goto(origin + 'app/#/m/m3/sas-transfert', { waitUntil: 'networkidle' });
  await page.waitForSelector('#lesson-body h2', { timeout: 10_000 });
  check('licence Pro : module 3 déchiffré', (await page.locator('#lesson-body h2').count()) >= 3);
  await shot('lesson-pro', true);
  await page.goto(origin + 'app/#/m/m6/capstone', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  check('licence Pro : module Elite verrouillé', (await page.locator('.lock-screen').count()) === 1);

  await page.goto(origin + 'app/', { waitUntil: 'networkidle' });
  await page.fill('#search', 'diode');
  await page.waitForTimeout(500);
  check('recherche : résultats', (await page.locator('#search-results a').count()) >= 2);
  await page.goto(origin + 'app/#/certificat', { waitUntil: 'networkidle' });
  check('certificat : vue rendue', (await page.locator('.certificate').count()) === 1);
  await page.goto(origin + 'app/#/reglages', { waitUntil: 'networkidle' });
  check('réglages : vue rendue', (await page.locator('#export').count()) === 1);

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(origin, { waitUntil: 'networkidle' });
  check('mobile : pas de défilement horizontal', !(await mob.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)));
  await mob.click('.nav-burger');
  check('mobile : menu ouvert', await mob.locator('.nav.open').count() === 1);
  await mob.close();

  // Le contrôle des erreurs se fait avant la navigation 404 volontaire (qui produit une erreur console attendue).
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
