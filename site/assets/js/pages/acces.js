/** Page Accès : activation d'une clé de licence (statique ou via API). */
import { config, url, esc, TIER_LABEL } from '../site.js';
import { store } from '../store.js';
import { unwrapWithLicense, fingerprint, normalizeLicense } from '../crypto.js';

const form = document.getElementById('activate');
const input = document.getElementById('key');
const msg = document.getElementById('msg');
const btn = document.getElementById('submit');

const params = new URLSearchParams(location.search);
if (params.get('key')) input.value = params.get('key');

const existing = store.getLicense();
if (existing) {
  msg.innerHTML = `<div class="notice ok">Une licence <b>${esc(TIER_LABEL[existing.tier] || existing.tier)}</b> est déjà active sur cet appareil. <a href="${url('app/')}">Aller à mon parcours</a></div>`;
}

async function resolveLicense(raw) {
  // Mode API : une référence de commande PayPal est échangée contre la clé de contenu.
  if (!config.api.activateUrl) return raw;
  const r = await fetch(config.api.activateUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ license: raw }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.contentLicense) throw new Error(j.error || 'Licence refusée par le serveur d’activation.');
  return j.contentLicense;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  btn.disabled = true;
  msg.innerHTML = '<div class="notice">Vérification cryptographique en cours…</div>';
  try {
    const license = await resolveLicense(normalizeLicense(input.value));
    const r = await fetch(url('data/keys.json'), { cache: 'no-store' });
    // En pré-lancement, aucune licence n'a encore été émise : le fichier de clés n'est pas publié.
    if (r.status === 404) throw new Error('Les licences ne sont pas encore émises : le programme complet ouvre avec la prochaine cohorte.');
    if (!r.ok) throw new Error('Fichier de clés indisponible. Réessayez dans un instant.');
    const res = await unwrapWithLicense(await r.json(), license);
    if (!res) throw new Error('Clé invalide. Vérifiez les caractères (les lettres O et I ne sont jamais utilisées) ou contactez le support.');
    store.setLicense({ tier: res.tier, keys: res.keys, fp: await fingerprint(license), activatedAt: Date.now() });
    msg.innerHTML = `<div class="notice ok">Licence <b>${esc(TIER_LABEL[res.tier])}</b> activée. Redirection vers votre parcours…</div>`;
    if (window.plausible) window.plausible('Activate', { props: { tier: res.tier } });
    setTimeout(() => (location.href = url('app/')), 900);
  } catch (err) {
    msg.innerHTML = `<div class="notice err">${esc(err.message)}</div>`;
    btn.disabled = false;
  }
});
