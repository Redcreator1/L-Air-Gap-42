/**
 * Récupération de la clé de licence après un paiement vérifié.
 *
 * Le site ne déverrouille rien : il se contente d'afficher la clé, que l'acheteur recopie
 * dans son terminal. Tout le parcours vit dans l'archive de niveaux, hors-ligne.
 */
import { config, url, esc, TIER_LABEL } from './site.js';

/** Échange une référence de commande contre la clé du palier acheté. */
export async function recupererCle(reference) {
  const r = await fetch(config.api.activateUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ license: reference }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.contentLicense) throw new Error(j.error || 'Paiement non vérifié.');
  return { tier: j.tier, cle: j.contentLicense };
}

/** Bloc HTML qui présente la clé et les deux commandes à recopier. */
export function afficherCle(palier, cle) {
  return `<div class="notice ok">
    <b>Paiement confirmé · palier ${esc(TIER_LABEL[palier] || palier)}.</b>
    <p class="mt-sm mb-sm">Voici votre clé de licence. Notez-la : elle vous est aussi envoyée par e-mail.</p>
    <pre><code class="cle-licence">${esc(cle)}</code></pre>
    <p class="small">Dans le dossier extrait de l’archive :</p>
    <pre><code>./airgap42 licence ${esc(cle)}</code></pre>
    <p class="small">Pas encore l’archive ? <a href="${url('jouer/')}">Mode d’emploi</a>.</p>
  </div>`;
}
