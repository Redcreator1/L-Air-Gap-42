#!/usr/bin/env node
/**
 * Génère les secrets de production à copier dans GitHub → Settings → Secrets → Actions.
 * Usage : npm run keygen
 *
 * Les clés de licence (LICENSE_KEY_*) sont celles que vous transmettez aux acheteurs
 * (e-mail post-achat, ou automatiquement via api/activate.js après vérification du paiement PayPal).
 * Le secret maître (CONTENT_MASTER_SECRET) ne quitte JAMAIS GitHub Actions.
 */
import { randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans I/O/0/1 pour éviter les confusions
function group(n) {
  const bytes = randomBytes(n);
  let s = '';
  for (let i = 0; i < n; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return s;
}
function licenseKey(tier) {
  return `AG42-${tier.toUpperCase().slice(0, 3)}-${group(5)}-${group(5)}-${group(5)}`;
}

const out = {
  CONTENT_MASTER_SECRET: randomBytes(48).toString('base64url'),
  LICENSE_KEY_ESSENTIEL: licenseKey('essentiel'),
  LICENSE_KEY_PRO: licenseKey('pro'),
  LICENSE_KEY_ELITE: licenseKey('elite'),
};

console.log('\n# Secrets GitHub Actions (à ajouter dans Settings → Secrets and variables → Actions)\n');
for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`);
console.log('\n# Conservez ces valeurs dans un gestionnaire de mots de passe. Toute rotation invalide les anciennes licences.\n');
