#!/usr/bin/env node
/**
 * Branchement Stripe en une commande.
 *
 *   STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup
 *   STRIPE_SECRET_KEY=sk_live_… npm run stripe:setup -- --write
 *
 * Crée (ou met à jour) pour chaque palier de site/config.js :
 *   - un produit d'identifiant fixe  airgap42_<palier>   → idempotent, relançable
 *   - un tarif unique dans la devise et au montant configurés
 *   - un lien de paiement (Payment Link) qui redirige vers /merci/ avec l'identifiant de session,
 *     émet une facture, calcule la TVA automatiquement et accepte les codes promo
 *
 * Sans --write : n'écrit rien dans le dépôt, affiche ce qui serait fait (les objets Stripe sont
 * tout de même créés, Stripe n'a pas de mode simulation). Avec --write : met à jour les
 * `checkoutUrl` de site/config.js et affiche les variables d'environnement pour api/activate.js.
 *
 * Aucune dépendance : appels HTTP directs à l'API Stripe (form-encoded).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = path.join(ROOT, 'site/config.js');
const API = 'https://api.stripe.com/v1';
const KEY = process.env.STRIPE_SECRET_KEY;
const WRITE = process.argv.includes('--write');

if (!KEY) {
  console.error(`
✖ STRIPE_SECRET_KEY manquante.

  Récupérez la clé secrète sur https://dashboard.stripe.com/apikeys
  (commencez par la clé de test sk_test_… pour valider le parcours), puis :

    STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup
`);
  process.exit(1);
}
if (!/^sk_(test|live)_/.test(KEY)) {
  console.error('✖ STRIPE_SECRET_KEY doit être une clé secrète (sk_test_… ou sk_live_…), pas une clé publiable.');
  process.exit(1);
}
const LIVE = KEY.startsWith('sk_live_');

/** Encode un objet imbriqué au format attendu par Stripe : a[b][0][c]=v */
function form(obj, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => (typeof item === 'object' ? form(item, `${key}[${i}]`, out) : out.append(`${key}[${i}]`, String(item))));
    else if (typeof v === 'object') form(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

async function stripe(method, endpoint, body) {
  const res = await fetch(API + endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2025-08-27.basil',
    },
    body: body ? form(body).toString() : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = json.error || {};
    const err = new Error(`${e.type || res.status} · ${e.message || 'erreur Stripe'}`);
    err.code = e.code;
    err.status = res.status;
    throw err;
  }
  return json;
}

const log = (m) => process.stdout.write(`  ${m}\n`);

async function readConfig() {
  const mod = await import(CONFIG_PATH + `?t=${Date.now()}`);
  return mod.default;
}

/** Produit à identifiant fixe : la relance du script le retrouve au lieu d'en créer un doublon. */
async function ensureProduct(tier) {
  const id = `airgap42_${tier.id}`;
  const payload = {
    name: `L'Air Gap 42 — ${tier.name}`,
    description: tier.pitch.slice(0, 350),
    metadata: { airgap42_tier: tier.id },
    tax_code: 'txcd_10103001', // services de formation en ligne, préenregistrés
  };
  try {
    const existing = await stripe('GET', `/products/${id}`);
    await stripe('POST', `/products/${id}`, { ...payload, active: true });
    log(`produit ${id} mis à jour`);
    return existing.id;
  } catch (e) {
    if (e.status !== 404) throw e;
    const created = await stripe('POST', '/products', { id, ...payload });
    log(`produit ${id} créé`);
    return created.id;
  }
}

/** Les tarifs Stripe sont immuables : on réutilise celui qui correspond, sinon on en crée un. */
async function ensurePrice(productId, tier, currency) {
  const amount = Math.round(tier.price * 100);
  const { data } = await stripe('GET', `/prices?product=${productId}&active=true&limit=100`);
  const found = data.find((p) => p.unit_amount === amount && p.currency === currency.toLowerCase() && p.type === 'one_time');
  if (found) {
    log(`tarif ${found.id} réutilisé (${tier.price} ${currency})`);
    return found.id;
  }
  const created = await stripe('POST', '/prices', {
    product: productId,
    currency: currency.toLowerCase(),
    unit_amount: amount,
    tax_behavior: 'exclusive', // prix hors taxes, la TVA est ajoutée au paiement
    metadata: { airgap42_tier: tier.id },
  });
  log(`tarif ${created.id} créé (${tier.price} ${currency})`);
  return created.id;
}

/**
 * Un lien de paiement ne peut pas changer de tarif : si le tarif a bougé, on désactive
 * l'ancien lien et on en crée un nouveau.
 */
async function ensurePaymentLink(tier, priceId, siteUrl) {
  const redirect = `${siteUrl}/merci/?tier=${tier.id}&session_id={CHECKOUT_SESSION_ID}`;
  const { data } = await stripe('GET', '/payment_links?limit=100&active=true');
  const mine = data.filter((l) => l.metadata?.airgap42_tier === tier.id);
  const match = mine.find((l) => l.line_items?.data?.[0]?.price?.id === priceId);

  for (const stale of mine) {
    if (match && stale.id === match.id) continue;
    await stripe('POST', `/payment_links/${stale.id}`, { active: false });
    log(`ancien lien ${stale.id} désactivé (tarif obsolète)`);
  }
  if (match) {
    await stripe('POST', `/payment_links/${match.id}`, {
      after_completion: { type: 'redirect', redirect: { url: redirect } },
      metadata: { airgap42_tier: tier.id },
    });
    log(`lien ${match.id} mis à jour`);
    return match.url;
  }
  const created = await stripe('POST', '/payment_links', {
    line_items: [{ price: priceId, quantity: 1 }],
    after_completion: { type: 'redirect', redirect: { url: redirect } },
    metadata: { airgap42_tier: tier.id },
    invoice_creation: { enabled: true },
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    custom_text: {
      submit: { message: 'Votre clé de licence est délivrée immédiatement après le paiement.' },
    },
  });
  log(`lien ${created.id} créé`);
  return created.url;
}

/** Remplace le checkoutUrl du palier dans site/config.js, sans toucher au reste du fichier. */
function patchConfig(source, tierId, url) {
  const block = new RegExp(`(id:\\s*'${tierId}'[\\s\\S]{0,1200}?checkoutUrl:\\s*')[^']*(')`);
  if (!block.test(source)) throw new Error(`checkoutUrl introuvable pour le palier « ${tierId} » dans site/config.js`);
  return source.replace(block, `$1${url}$2`);
}

async function main() {
  console.log(`\n▶ Branchement Stripe — mode ${LIVE ? 'PRODUCTION (sk_live)' : 'test (sk_test)'}${WRITE ? ' · écriture de site/config.js' : ' · lecture seule'}`);

  const account = await stripe('GET', '/account').catch(() => null);
  if (account) log(`compte ${account.id}${account.settings?.dashboard?.display_name ? ` · ${account.settings.dashboard.display_name}` : ''}`);

  const config = await readConfig();
  const siteUrl = (process.env.SITE_URL || config.site.url).replace(/\/$/, '');
  const currency = config.checkout.currency;
  log(`site ${siteUrl} · devise ${currency}\n`);

  const results = [];
  for (const tier of config.checkout.tiers) {
    console.log(`  ── ${tier.name} (${tier.price} ${currency})`);
    const productId = await ensureProduct(tier);
    const priceId = await ensurePrice(productId, tier, currency);
    const url = await ensurePaymentLink(tier, priceId, siteUrl);
    results.push({ tier: tier.id, name: tier.name, productId, priceId, url });
    console.log('');
  }

  if (WRITE) {
    let source = await fs.readFile(CONFIG_PATH, 'utf8');
    for (const r of results) source = patchConfig(source, r.tier, r.url);
    await fs.writeFile(CONFIG_PATH, source);
    log('site/config.js mis à jour avec les liens de paiement');
  }

  console.log('\n  Liens de paiement :');
  for (const r of results) console.log(`    ${r.tier.padEnd(10)} ${r.url}`);

  console.log('\n  Variables d’environnement pour api/activate.js (Vercel) :');
  console.log(`    STRIPE_SECRET_KEY=${KEY.slice(0, 12)}…`);
  for (const r of results) console.log(`    STRIPE_PRICE_${r.tier.toUpperCase()}=${r.priceId}`);
  console.log(`    ALLOWED_ORIGIN=${new URL(siteUrl).origin}`);

  if (!WRITE) console.log('\n  Relancez avec --write pour inscrire ces liens dans site/config.js.');
  if (!LIVE) console.log('\n  Clé de test : les paiements ne sont pas réels. Rejouez avec sk_live_… pour la production.');
  console.log('');
}

main().catch((e) => {
  console.error(`\n✖ ${e.message}\n`);
  process.exit(1);
});
