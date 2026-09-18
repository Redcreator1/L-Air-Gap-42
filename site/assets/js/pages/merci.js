/** Page Merci : événement d'achat pour la mesure d'audience. */
let tier = new URLSearchParams(location.search).get('tier');
try {
  tier = tier || sessionStorage.getItem('ag42:intent');
} catch {
  /* stockage indisponible */
}
if (window.plausible) window.plausible('Purchase', { props: { tier: tier || 'unknown' } });
