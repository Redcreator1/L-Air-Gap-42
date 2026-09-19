/**
 * Paiement PayPal.
 *
 * Le kit PayPal est chargé une seule fois, à la demande, et uniquement si un identifiant
 * client est configuré. Rien n'est chargé sur les pages sans bouton d'achat.
 *
 * Après approbation :
 *  - si `api.activateUrl` est configuré, la commande est envoyée à la fonction d'activation,
 *    qui l'encaisse et la vérifie côté serveur, puis renvoie la clé du palier. Elle est
 *    affichée immédiatement, prête à être recopiée dans le terminal ;
 *  - sinon, la commande est encaissée côté navigateur et l'acheteur est renvoyé vers la page
 *    Merci, la clé lui étant transmise par e-mail.
 */
import { config, url, esc } from './site.js';
import { recupererCle, afficherCle } from './licence.js';

const PP = () => config.checkout.paypal;
export const isPayPalReady = () => Boolean(PP().clientId);

let sdk = null;
function loadSdk() {
  if (sdk) return sdk;
  const params = new URLSearchParams({
    'client-id': PP().clientId,
    currency: config.checkout.currency,
    intent: 'capture',
    components: 'buttons',
    'disable-funding': 'credit',
  });
  sdk = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?${params}`;
    s.onload = () => (window.paypal ? resolve(window.paypal) : reject(new Error('Kit PayPal indisponible.')));
    s.onerror = () => reject(new Error('Chargement de PayPal impossible. Vérifiez votre connexion ou votre bloqueur.'));
    document.head.appendChild(s);
  });
  return sdk;
}

function setStatus(host, cls, html) {
  const box = host.querySelector('.pay-status') || host.appendChild(Object.assign(document.createElement('div'), { className: 'pay-status' }));
  box.className = `pay-status notice ${cls}`;
  box.innerHTML = html;
}

/**
 * Rend un bouton PayPal dans chaque conteneur fourni.
 * @param {Array<{tier: object, host: HTMLElement}>} slots
 */
export async function mountPayPalButtons(slots) {
  if (!isPayPalReady() || slots.length === 0) return;
  let paypal;
  try {
    paypal = await loadSdk();
  } catch (e) {
    slots.forEach(({ host }) => setStatus(host, 'err', esc(e.message)));
    return;
  }

  for (const { tier, host } of slots) {
    const amount = { currency_code: config.checkout.currency, value: tier.price.toFixed(2) };
    paypal
      .Buttons({
        style: { layout: 'vertical', shape: 'pill', label: 'pay', height: 45 },
        createOrder: (_data, actions) =>
          actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                // Le palier voyage avec la commande : le serveur le relit pour délivrer la bonne clé.
                custom_id: tier.id,
                description: `${config.site.name} — ${tier.name}`.slice(0, 127),
                soft_descriptor: PP().softDescriptor.slice(0, 22),
                amount,
              },
            ],
            application_context: { shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW', brand_name: config.site.name },
          }),
        onApprove: async (data, actions) => {
          if (window.plausible) window.plausible('Checkout', { props: { tier: tier.id } });
          setStatus(host, '', 'Paiement accepté. Récupération de votre clé…');
          try {
            if (config.api.activateUrl) {
              // Le serveur encaisse et vérifie : le navigateur ne décide jamais du montant payé.
              const { tier: palier, cle } = await recupererCle(data.orderID);
              if (window.plausible) window.plausible('Activate', { props: { tier: palier } });
              setStatus(host, 'ok', afficherCle(palier, cle));
              return;
            }
            await actions.order.capture();
            location.href = url(`merci/?tier=${encodeURIComponent(tier.id)}&order=${encodeURIComponent(data.orderID)}`);
          } catch (e) {
            setStatus(host, 'warn', `${esc(e.message)} Votre paiement est enregistré : écrivez-nous à <a href="mailto:${esc(config.site.contactEmail)}">${esc(config.site.contactEmail)}</a> en indiquant la référence <code>${esc(data.orderID)}</code>.`);
          }
        },
        onError: () => setStatus(host, 'err', 'PayPal a refusé la transaction. Réessayez ou contactez-nous.'),
        onCancel: () => setStatus(host, 'warn', 'Paiement annulé.'),
      })
      .render(host.querySelector('.paypal-button'))
      .catch(() => setStatus(host, 'err', 'Bouton PayPal indisponible.'));
  }
}
