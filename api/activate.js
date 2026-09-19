/**
 * Fonction serverless OPTIONNELLE (Vercel) : échange une preuve d'achat contre la clé de contenu
 * du palier correspondant.
 *
 * Deux usages :
 *  - Stripe : l'acheteur est redirigé vers /merci/?session_id=cs_… ; la page échange cet
 *    identifiant de session contre la clé. Aucune saisie, aucun e-mail à attendre.
 *  - Lemon Squeezy : l'acheteur saisit sa clé de licence personnelle (révocable côté Lemon Squeezy).
 *
 * Sans cette fonction, le site reste 100 % statique : la clé du palier est transmise par e-mail
 * et saisie sur la page Accès.
 *
 * Déploiement : `vercel deploy` à la racine (vercel.json fourni), puis
 * site/config.js → api.activateUrl = 'https://<projet>.vercel.app/api/activate'.
 *
 * Variables d'environnement :
 *   LICENSE_KEY_ESSENTIEL / LICENSE_KEY_PRO / LICENSE_KEY_ELITE   (mêmes valeurs que les secrets GitHub)
 *   STRIPE_SECRET_KEY + STRIPE_PRICE_ESSENTIEL / _PRO / _ELITE    (affichés par npm run stripe:setup)
 *   LEMONSQUEEZY_API_KEY + LS_VARIANT_ESSENTIEL / _PRO / _ELITE   (si Lemon Squeezy)
 *   ALLOWED_ORIGIN                                                 (ex : https://redcreator1.github.io)
 */
export const config = { runtime: 'edge' };

const TIERS = ['essentiel', 'pro', 'elite'];
const STRIPE_API = 'https://api.stripe.com/v1';

function json(body, status, origin) {
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

/** Erreur destinée à l'acheteur : message lisible, pas de détail interne. */
class ClientError extends Error {}

function tierFromPrice(priceId) {
  for (const t of TIERS) if (process.env[`STRIPE_PRICE_${t.toUpperCase()}`] === priceId) return t;
  return null;
}

async function stripeGet(endpoint) {
  const r = await fetch(STRIPE_API + endpoint, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Stripe-Version': '2025-08-27.basil' },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new ClientError(j.error?.message || 'Session de paiement introuvable.');
  return j;
}

/** Vérifie qu'une session Checkout est réglée et renvoie le palier acheté. */
async function tierFromStripeSession(sessionId) {
  if (!process.env.STRIPE_SECRET_KEY) throw new ClientError('Paiement Stripe non configuré côté serveur.');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw new ClientError('Identifiant de session invalide.');

  const session = await stripeGet(`/checkout/sessions/${sessionId}`);
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    throw new ClientError('Le paiement n’est pas encore confirmé. Réessayez dans une minute.');
  }
  // Le palier est porté par les métadonnées du lien de paiement, avec le tarif en secours.
  const fromMeta = session.metadata?.airgap42_tier;
  if (fromMeta && TIERS.includes(fromMeta)) return fromMeta;

  const items = await stripeGet(`/checkout/sessions/${sessionId}/line_items?limit=1`);
  const tier = tierFromPrice(items.data?.[0]?.price?.id);
  if (!tier) throw new ClientError('Produit acheté non reconnu. Contactez le support.');
  return tier;
}

/** Valide et consomme une activation Lemon Squeezy (décompte les activations autorisées). */
async function tierFromLemonSqueezy(licenseKey) {
  const r = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ license_key: licenseKey, instance_name: 'airgap42-web' }),
  });
  const j = await r.json().catch(() => ({}));
  const active = j.activated === true || j.license_key?.status === 'active';
  if (!active) throw new ClientError(j.error || 'Licence invalide ou nombre d’activations dépassé.');
  const variantId = String(j.meta?.variant_id ?? '');
  for (const t of TIERS) if (process.env[`LS_VARIANT_${t.toUpperCase()}`] === variantId) return t;
  throw new ClientError('Produit acheté non reconnu. Contactez le support.');
}

export default async function handler(req) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ error: 'POST attendu' }, 405, origin);

  let tier;
  try {
    const { license } = await req.json();
    if (typeof license !== 'string' || !license.trim() || license.length > 300) throw new ClientError('Référence d’achat manquante.');
    const value = license.trim();

    if (value.startsWith('cs_')) tier = await tierFromStripeSession(value);
    else if (process.env.LEMONSQUEEZY_API_KEY || /^[0-9a-f-]{36}$/i.test(value)) tier = await tierFromLemonSqueezy(value);
    else throw new ClientError('Référence d’achat non reconnue.');
  } catch (e) {
    if (e instanceof ClientError) return json({ error: e.message }, 403, origin);
    return json({ error: 'Vérification impossible pour le moment. Réessayez.' }, 502, origin);
  }

  const contentLicense = process.env[`LICENSE_KEY_${tier.toUpperCase()}`];
  if (!contentLicense) return json({ error: 'Clé de contenu absente côté serveur.' }, 500, origin);
  return json({ tier, contentLicense }, 200, origin);
}
