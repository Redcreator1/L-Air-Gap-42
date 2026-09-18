/**
 * Déchiffrement côté navigateur (WebCrypto). Miroir exact de scripts/build.mjs.
 *
 * Flux :
 *   clé de licence (saisie) → PBKDF2-SHA256 → clé d'enveloppe
 *   → déchiffre keys.json → clés de contenu par palier (AES-256-GCM)
 *   → déchiffre data/modules/<id>.enc.json → leçons.
 *
 * Rien ne quitte le navigateur. Fonctionne hors-ligne une fois chargé.
 */
const enc = new TextEncoder();
const dec = new TextDecoder();

export function normalizeLicense(s) {
  return String(s || '').trim().toUpperCase().replace(/\s+/g, '');
}

function fromB64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
export function toB64(buf) {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

async function pbkdf2(passphrase, salt, iterations) {
  const base = await crypto.subtle.importKey('raw', enc.encode(normalizeLicense(passphrase)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, base, 256);
  return new Uint8Array(bits);
}

async function aesDecrypt(rawKey, { iv, ct }) {
  const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, key, fromB64(ct));
}

/**
 * Tente d'ouvrir keys.json avec une clé de licence.
 * @returns {{tier:string, keys:Record<string,string>}|null}  clés de contenu (base64) par palier
 */
export async function unwrapWithLicense(keysFile, license) {
  const order = ['elite', 'pro', 'essentiel']; // du plus large au plus restreint
  for (const lic of order) {
    const entry = keysFile.licenses[lic];
    if (!entry) continue;
    const wrapKey = await pbkdf2(license, fromB64(entry.salt), keysFile.iterations);
    try {
      const check = dec.decode(await aesDecrypt(wrapKey, entry.check));
      if (check !== `ok:${lic}`) continue;
      const keys = {};
      for (const [tier, blob] of Object.entries(entry.keys)) keys[tier] = toB64(await aesDecrypt(wrapKey, blob));
      return { tier: lic, keys };
    } catch {
      /* mauvaise licence pour ce palier → suivant */
    }
  }
  return null;
}

/** Déchiffre un module chiffré à partir des clés de contenu (base64 par palier). */
export async function decryptModule(encFile, contentKeys) {
  const raw = contentKeys[encFile.tier];
  if (!raw) throw new Error(`Palier « ${encFile.tier} » non inclus dans votre licence.`);
  const plain = await aesDecrypt(fromB64(raw), encFile);
  return JSON.parse(dec.decode(plain));
}

/** Empreinte courte d'une licence (pour affichage), jamais la licence elle-même. */
export async function fingerprint(license) {
  const h = await crypto.subtle.digest('SHA-256', enc.encode(normalizeLicense(license)));
  return toB64(h).replace(/[^A-Z0-9]/gi, '').slice(0, 8).toUpperCase();
}
