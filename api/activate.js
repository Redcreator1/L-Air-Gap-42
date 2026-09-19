/**
 * Fonction serverless OPTIONNELLE (Vercel) : encaisse et vérifie une commande PayPal, puis
 * renvoie la clé de contenu du palier acheté.
 *
 * Pourquoi côté serveur : le bouton PayPal construit la commande dans le navigateur, donc le
 * montant n'est pas digne de confiance. Cette fonction relit la commande chez PayPal, vérifie
 * qu'elle est réglée et que le montant correspond bien au tarif du palier annoncé, et seulement
 * alors délivre la clé. Sans elle, le site reste 100 % statique : la clé du palier est envoyée
 * par e-mail et saisie sur la page Accès.
 *
 * Déploiement : `vercel deploy` à la racine (vercel.json fourni), puis
 * site/config.js → api.activateUrl = 'https://<projet>.vercel.app/api/activate'.
 *
 * Variables d'environnement :
 *   PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET   identifiants de l'application PayPal
 *   PAYPAL_SANDBOX                            '1' pour le bac à sable, absent en production
 *   PAYPAL_PRICES                             tarifs attendus, ex : {"essentiel":490,"pro":1490,"elite":4900}
 *   PAYPAL_CURRENCY                           devise attendue (défaut : EUR)
 *   LICENSE_KEY_ESSENTIEL / _PRO / _ELITE     mêmes valeurs que les secrets GitHub
 *   ALLOWED_ORIGIN                            ex : https://redcreator1.github.io
 */
export const config = { runtime: 'edge' };

const TIERS = ['essentiel', 'pro', 'elite'];
const api = () => (process.env.PAYPAL_SANDBOX === '1' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com');

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

/** Erreur destinée à l'acheteur : message lisible, aucun détail interne. */
class ClientError extends Error {}

async function token() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new ClientError('Paiement non configuré côté serveur.');
  const r = await fetch(`${api()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${btoa(`${id}:${secret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!r.ok) throw new Error('paypal auth failed');
  return (await r.json()).access_token;
}

async function paypal(method, path, accessToken) {
  const r = await fetch(api() + path, {
    method,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });
  const body = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, body };
}

function expectedPrice(tier) {
  let prices;
  try {
    prices = JSON.parse(process.env.PAYPAL_PRICES || '{}');
  } catch {
    throw new Error('PAYPAL_PRICES invalide');
  }
  const value = prices[tier];
  if (typeof value !== 'number') throw new ClientError('Tarif inconnu pour ce produit. Contactez le support.');
  return value;
}

/**
 * Encaisse la commande si besoin, puis vérifie palier, devise et montant.
 * @returns {Promise<string>} le palier acheté
 */
async function tierFromPayPalOrder(orderId) {
  if (!/^[A-Z0-9]{5,30}$/i.test(orderId)) throw new ClientError('Référence de commande invalide.');
  const access = await token();

  let { ok, body: order } = await paypal('GET', `/v2/checkout/orders/${orderId}`, access);
  if (!ok) throw new ClientError('Commande introuvable.');

  if (order.status === 'APPROVED') {
    const captured = await paypal('POST', `/v2/checkout/orders/${orderId}/capture`, access);
    // ORDER_ALREADY_CAPTURED : le navigateur a encaissé avant nous, ce n'est pas une erreur.
    const already = captured.body?.details?.some((d) => d.issue === 'ORDER_ALREADY_CAPTURED');
    if (!captured.ok && !already) throw new ClientError('Le paiement n’a pas pu être finalisé.');
    order = captured.ok ? captured.body : (await paypal('GET', `/v2/checkout/orders/${orderId}`, access)).body;
  }
  if (order.status !== 'COMPLETED') throw new ClientError('Le paiement n’est pas confirmé. Réessayez dans une minute.');

  const unit = order.purchase_units?.[0];
  const tier = unit?.custom_id;
  if (!TIERS.includes(tier)) throw new ClientError('Produit acheté non reconnu. Contactez le support.');

  // Le montant réellement encaissé, pas celui annoncé par le navigateur.
  const capture = unit.payments?.captures?.find((c) => c.status === 'COMPLETED');
  const paid = capture?.amount ?? unit.amount;
  const currency = process.env.PAYPAL_CURRENCY || 'EUR';
  if (paid?.currency_code !== currency || Number(paid?.value) < expectedPrice(tier)) {
    throw new ClientError('Le montant réglé ne correspond pas au produit. Contactez le support.');
  }
  return tier;
}

export default async function handler(req) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ error: 'POST attendu' }, 405, origin);

  let tier;
  try {
    const { license } = await req.json();
    if (typeof license !== 'string' || !license.trim() || license.length > 100) throw new ClientError('Référence d’achat manquante.');
    tier = await tierFromPayPalOrder(license.trim());
  } catch (e) {
    if (e instanceof ClientError) return json({ error: e.message }, 403, origin);
    return json({ error: 'Vérification impossible pour le moment. Réessayez.' }, 502, origin);
  }

  const contentLicense = process.env[`LICENSE_KEY_${tier.toUpperCase()}`];
  if (!contentLicense) return json({ error: 'Clé de contenu absente côté serveur.' }, 500, origin);
  return json({ tier, contentLicense }, 200, origin);
}
