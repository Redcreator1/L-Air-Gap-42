/**
 * Fonction serverless OPTIONNELLE (Vercel) : échange une licence individuelle
 * (Lemon Squeezy ou Stripe) contre la clé de contenu du palier.
 *
 * Pourquoi ? En mode 100 % statique, tous les acheteurs d'un palier reçoivent la même
 * clé de contenu. Avec cette fonction, chaque acheteur reçoit une licence PERSONNELLE
 * (révocable, limitée en activations) et la clé de contenu ne transite qu'après vérification.
 *
 * Déploiement : `vercel deploy` à la racine du dépôt (vercel.json fourni), puis renseigner
 * site/config.js → api.activateUrl = 'https://<projet>.vercel.app/api/activate'.
 *
 * Variables d'environnement Vercel :
 *   LICENSE_KEY_ESSENTIEL / LICENSE_KEY_PRO / LICENSE_KEY_ELITE  (mêmes valeurs que GitHub)
 *   LEMONSQUEEZY_API_KEY   (si provider Lemon Squeezy)  + LS_VARIANT_ESSENTIEL / LS_VARIANT_PRO / LS_VARIANT_ELITE
 *   STRIPE_SECRET_KEY      (si provider Stripe : la « licence » saisie est l'ID de session cs_… ou de paiement pi_…)
 *                          + STRIPE_PRICE_ESSENTIEL / STRIPE_PRICE_PRO / STRIPE_PRICE_ELITE
 *   ALLOWED_ORIGIN         (ex : https://redcreator1.github.io)
 */
export const config = { runtime: 'edge' };

const TIERS = ['essentiel', 'pro', 'elite'];

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function tierFromLemonSqueezy(licenseKey) {
  // Valide + active la clé (compte une activation). https://docs.lemonsqueezy.com/api/license-api
  const r = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ license_key: licenseKey, instance_name: 'airgap42-web' }),
  });
  const j = await r.json();
  if (!j.activated && !(j.license_key?.status === 'active')) throw new Error(j.error || 'Licence Lemon Squeezy invalide ou épuisée.');
  const variantId = String(j.meta?.variant_id || '');
  for (const t of TIERS) if (process.env[`LS_VARIANT_${t.toUpperCase()}`] === variantId) return t;
  throw new Error('Variante de produit non reconnue.');
}

async function tierFromStripe(sessionId) {
  const key = process.env.STRIPE_SECRET_KEY;
  const auth = { Authorization: `Bearer ${key}` };
  let priceId = null;
  if (sessionId.startsWith('cs_')) {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items`, { headers: auth });
    const j = await r.json();
    priceId = j.data?.[0]?.price?.id;
    const s = await (await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, { headers: auth })).json();
    if (s.payment_status !== 'paid') throw new Error('Paiement non confirmé.');
  } else {
    throw new Error('Identifiant Stripe attendu au format cs_… (session Checkout).');
  }
  for (const t of TIERS) if (process.env[`STRIPE_PRICE_${t.toUpperCase()}`] === priceId) return t;
  throw new Error('Tarif non reconnu.');
}

export default async function handler(req) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ error: 'POST attendu' }, 405, origin);
  try {
    const { license } = await req.json();
    if (!license || typeof license !== 'string' || license.length > 200) return json({ error: 'Licence manquante.' }, 400, origin);
    const trimmed = license.trim();
    let tier;
    if (process.env.LEMONSQUEEZY_API_KEY || /^[0-9a-f-]{36}$/i.test(trimmed)) tier = await tierFromLemonSqueezy(trimmed);
    else if (process.env.STRIPE_SECRET_KEY) tier = await tierFromStripe(trimmed);
    else return json({ error: 'Aucun fournisseur configuré côté serveur.' }, 500, origin);
    const contentLicense = process.env[`LICENSE_KEY_${tier.toUpperCase()}`];
    if (!contentLicense) return json({ error: 'Clé de contenu absente côté serveur.' }, 500, origin);
    return json({ tier, contentLicense }, 200, origin);
  } catch (e) {
    return json({ error: e.message || 'Activation refusée.' }, 403, origin);
  }
}
