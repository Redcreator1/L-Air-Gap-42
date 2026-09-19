/**
 * Page Merci : après un paiement PayPal, la redirection porte ?order=<référence de commande>.
 * Si l'API d'activation est configurée, la licence est activée automatiquement,
 * sans saisie ni attente d'e-mail. Sinon, les étapes manuelles restent affichées.
 */
import { config, url, esc, TIER_LABEL } from '../site.js';
import { store } from '../store.js';
import { unwrapWithLicense, fingerprint } from '../crypto.js';

const params = new URLSearchParams(location.search);
const orderId = params.get('order');
let tier = params.get('tier');
try {
  tier = tier || sessionStorage.getItem('ag42:intent');
} catch {
  /* stockage indisponible */
}
if (window.plausible) window.plausible('Purchase', { props: { tier: tier || 'unknown' } });

const host = document.getElementById('auto-activate');
const steps = document.getElementById('manual-steps');
const show = (cls, html) => (host.innerHTML = `<div class="notice ${cls}">${html}</div>`);

async function autoActivate() {
  if (!host || !orderId || !config.api.activateUrl) return;
  if (store.getLicense()) {
    show('ok', `Une licence est déjà active sur cet appareil. <a href="${url('app/')}">Aller à mon parcours</a>`);
    return;
  }
  steps?.classList.add('is-secondary');
  show('', 'Activation de votre accès en cours…');
  try {
    const r = await fetch(config.api.activateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license: orderId }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.contentLicense) throw new Error(j.error || 'Paiement non vérifié.');

    const keys = await fetch(url('data/keys.json'), { cache: 'no-store' });
    if (!keys.ok) throw new Error('Fichier de clés indisponible.');
    const res = await unwrapWithLicense(await keys.json(), j.contentLicense);
    if (!res) throw new Error('Clé de contenu refusée.');

    store.setLicense({ tier: res.tier, keys: res.keys, fp: await fingerprint(j.contentLicense), activatedAt: Date.now() });
    if (window.plausible) window.plausible('Activate', { props: { tier: res.tier } });
    show('ok', `Accès <b>${esc(TIER_LABEL[res.tier])}</b> activé sur cet appareil. Redirection vers votre parcours…`);
    setTimeout(() => (location.href = url('app/')), 1200);
  } catch (e) {
    steps?.classList.remove('is-secondary');
    show('warn', `Activation automatique impossible : ${esc(e.message)} Votre clé de licence figure dans l’e-mail de reçu ; activez-la sur la <a href="${url('acces/')}">page Accès</a>.`);
  }
}

autoActivate();
