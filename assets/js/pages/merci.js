/**
 * Page Merci : après un paiement PayPal, la redirection porte ?order=<référence de commande>.
 * Si l'API d'activation est configurée, la clé de licence est récupérée et affichée
 * immédiatement. Sinon, les étapes manuelles restent affichées et la clé arrive par e-mail.
 */
import { config, esc } from '../site.js';
import { recupererCle, afficherCle } from '../licence.js';

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

async function recuperer() {
  if (!host || !orderId || !config.api.activateUrl) return;
  steps?.classList.add('is-secondary');
  host.innerHTML = '<div class="notice">Vérification du paiement…</div>';
  try {
    const { tier: palier, cle } = await recupererCle(orderId);
    if (window.plausible) window.plausible('Activate', { props: { tier: palier } });
    host.innerHTML = afficherCle(palier, cle);
  } catch (e) {
    steps?.classList.remove('is-secondary');
    host.innerHTML = `<div class="notice warn">Récupération automatique impossible : ${esc(e.message)} Votre clé figure dans l’e-mail de reçu ; en cas de doute, écrivez-nous à <a href="mailto:${esc(config.site.contactEmail)}">${esc(config.site.contactEmail)}</a> avec la référence <code>${esc(orderId)}</code>.</div>`;
  }
}

recuperer();
