/**
 * Script commun à toutes les pages : navigation, pied de page, injection de la config,
 * compte à rebours, tarifs, FAQ, témoignages, newsletter, analytics, icônes, animations.
 * Chaque bloc ne s'exécute que si son conteneur existe dans la page.
 */
import config from '../../config.js';
import { store } from './store.js';
import { icon, applyIcons } from './icons.js';

export const BASE = new URL('../../', import.meta.url).pathname; // ex : /L-Air-Gap-42/
export const url = (p = '') => BASE + p.replace(/^\//, '');
export { config };
export const TIER_LABEL = { free: 'Gratuit', essentiel: 'Essentiel', pro: 'Pro', elite: 'Elite' };

if ('IntersectionObserver' in window) document.documentElement.classList.add('js'); // active les animations .reveal

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const fmtPrice = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: config.checkout.currency, maximumFractionDigits: 0 }).format(n);

/** Lit une valeur de config par chemin pointé ('community.discordInvite'). */
const cfg = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), config);

/** Une URL est utilisable si elle est absolue et ne contient pas de gabarit à remplacer. */
export const isConfiguredUrl = (v) => typeof v === 'string' && /^https?:\/\//.test(v) && !/REMPLACER/i.test(v);

/** Repli quand un service n'est pas encore branché : on écrit, personne ne clique dans le vide. */
const contactHref = (subject) => `mailto:${config.site.contactEmail}?subject=${encodeURIComponent(subject)}`;

// ---------- Navigation & pied de page ----------
function renderNav() {
  const host = $('#nav');
  if (!host) return;
  const here = location.pathname.replace(BASE, '/');
  const links = [
    ['programme/', 'Programme'],
    ['tarifs/', 'Tarifs'],
    ['communaute/', 'Communauté'],
    ['app/', 'Espace membre'],
  ];
  const lic = store.getLicense();
  host.className = 'nav';
  host.innerHTML = `
    <div class="container">
      <a class="brand" href="${url('')}"><span class="brand-mark">42</span>${esc(config.site.name)}</a>
      <ul class="nav-links">
        ${links.map(([p, l]) => `<li><a href="${url(p)}" ${here === '/' + p ? 'aria-current="page"' : ''}>${l}</a></li>`).join('')}
      </ul>
      <div class="nav-cta">
        ${lic ? `<a class="btn btn-ghost btn-sm" href="${url('app/')}">Mon parcours · ${esc(TIER_LABEL[lic.tier] || lic.tier)}</a>` : `<a class="btn btn-ghost btn-sm" href="${url('acces/')}">J’ai une licence</a>`}
        <a class="btn btn-primary btn-sm" href="${url('tarifs/')}">Rejoindre</a>
        <button class="nav-burger" type="button" aria-label="Menu" aria-expanded="false">${icon('menu', 22)}</button>
      </div>
    </div>`;
  $('.nav-burger', host).addEventListener('click', (e) => {
    const open = host.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
}

function renderFooter() {
  const host = $('#footer');
  if (!host) return;
  host.className = 'footer';
  host.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="${url('')}"><span class="brand-mark">42</span>${esc(config.site.name)}</a>
          <p class="footer-tagline">${esc(config.site.tagline)}</p>
        </div>
        <div><h4>Programme</h4><ul>
          <li><a href="${url('programme/')}">Les 6 modules</a></li>
          <li><a href="${url('tarifs/')}">Tarifs</a></li>
          <li><a href="${url('app/#/m/m0/pourquoi-air-gap')}">Briefing gratuit</a></li>
          <li><a href="${url('feed.xml')}">Flux RSS</a></li>
        </ul></div>
        <div><h4>Communauté</h4><ul>
          ${[
            [config.community.discordInvite, 'Discord'],
            [config.community.discussionsUrl, 'Discussions GitHub'],
          ]
            .filter(([href]) => isConfiguredUrl(href))
            .map(([href, label]) => `<li><a href="${esc(href)}" rel="noopener" target="_blank">${label}</a></li>`)
            .join('')}
          <li><a href="${url('communaute/')}">Sessions live</a></li>
        </ul></div>
        <div><h4>Support</h4><ul>
          <li><a href="${url('acces/')}">Activer ma licence</a></li>
          <li><a href="mailto:${esc(config.site.contactEmail)}">Contact</a></li>
          <li><a href="${url('legal/')}">CGV & mentions légales</a></li>
        </ul></div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(config.site.name)}. Tous droits réservés.</span>
        <span class="mono" id="build-info"></span>
      </div>
    </div>`;
}

// ---------- Mode démo ----------
async function demoBanner() {
  try {
    const r = await fetch(url('data/build.json'), { cache: 'no-store' });
    if (!r.ok) return;
    const b = await r.json();
    const bi = $('#build-info');
    if (bi) bi.textContent = `build ${b.commit} · ${new Date(b.builtAt).toLocaleDateString('fr-FR')}`;
    if (b.prelaunch) document.documentElement.classList.add('prelaunch');
    if (b.demo || b.prelaunch) {
      const el = document.createElement('div');
      el.className = 'demo-banner';
      el.innerHTML = b.prelaunch
        ? `Pré-lancement : le module 0 est en accès libre, le programme complet ouvre avec la prochaine cohorte.`
        : `Mode démo : secrets non configurés. Licences de test — Essentiel <code>${esc(b.demoLicenses.essentiel)}</code> · Pro <code>${esc(b.demoLicenses.pro)}</code> · Elite <code>${esc(b.demoLicenses.elite)}</code>`;
      document.body.prepend(el);
    }
  } catch {
    /* page servie sans build (ouverture directe de site/) */
  }
}

// ---------- Cohorte & compte à rebours ----------
function cohort() {
  $$('[data-cohort]').forEach((el) => (el.textContent = config.cohort[el.dataset.cohort] ?? ''));
  const bar = $('#seats-bar');
  if (bar) {
    const sold = Math.max(0, config.cohort.seats - config.cohort.seatsLeft);
    bar.innerHTML = `<i style="width:${Math.round((sold / config.cohort.seats) * 100)}%"></i>`;
  }
  const cd = $('#countdown');
  if (!cd) return;
  const end = new Date(config.cohort.closesAt).getTime();
  const tick = () => {
    const d = Math.max(0, end - Date.now());
    const parts = [
      [Math.floor(d / 864e5), 'jours'],
      [Math.floor((d / 36e5) % 24), 'heures'],
      [Math.floor((d / 6e4) % 60), 'min'],
      [Math.floor((d / 1e3) % 60), 'sec'],
    ];
    cd.innerHTML = parts.map(([v, l]) => `<div><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`).join('');
    if (d === 0) {
      const note = $('#countdown-note');
      if (note) note.textContent = 'Inscriptions de cette cohorte closes. Inscrivez-vous à la newsletter pour la prochaine.';
    }
  };
  tick();
  setInterval(tick, 1000);
}

// ---------- Tarifs ----------
/** Option B : lien de paiement PayPal sans code, collé dans le palier. */
export const checkoutHref = (tier) => tier.checkoutUrl;

/** Un palier est vendable quand son lien de paiement est réel (ni vide, ni gabarit à remplacer). */
export function isTierConfigured(tier) {
  const href = checkoutHref(tier);
  return Boolean(href) && /^https:\/\//.test(href) && !/REMPLACER/i.test(href);
}

/** Avant branchement du paiement, le bouton ouvre une prise de contact au lieu d'un lien mort. */
function waitlistHref(tier) {
  const subject = `Liste d’attente ${config.site.name} — ${tier.name}`;
  return `mailto:${config.site.contactEmail}?subject=${encodeURIComponent(subject)}`;
}
async function pricing() {
  const host = $('#pricing');
  if (!host) return;
  const { isPayPalReady, mountPayPalButtons } = await import('./paypal.js');
  const withButtons = isPayPalReady();
  const anyOpen = withButtons || config.checkout.tiers.some(isTierConfigured);

  host.innerHTML = config.checkout.tiers
    .map((t) => {
      const link = isTierConfigured(t);
      let cta;
      if (withButtons) cta = `<div class="pay-slot" data-pay="${esc(t.id)}"><div class="paypal-button"></div></div>`;
      else if (link) cta = `<a class="btn ${t.highlight ? 'btn-primary' : 'btn-ghost'} btn-block" href="${esc(checkoutHref(t))}" data-checkout="${esc(t.id)}">${esc(t.cta)}</a>`;
      else cta = `<a class="btn btn-ghost btn-block" href="${esc(waitlistHref(t))}" data-waitlist="${esc(t.id)}">Être prévenu de l’ouverture</a>`;
      return `
    <article class="price-card ${t.highlight ? 'highlight' : ''}${withButtons || link ? '' : ' price-card-soon'}" id="tier-${esc(t.id)}">
      ${t.badge ? `<span class="price-badge">${esc(t.badge)}</span>` : ''}
      <h3>${esc(t.name)}</h3>
      <p class="pitch">${esc(t.pitch)}</p>
      <div class="price"><span class="amount">${fmtPrice(t.price)}</span>${t.priceBefore ? `<span class="before">${fmtPrice(t.priceBefore)}</span>` : ''}</div>
      <div class="price-note">${esc(config.checkout.priceNote)}</div>
      <ul class="features">${t.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      ${cta}
    </article>`;
    })
    .join('');

  if (!anyOpen) {
    host.insertAdjacentHTML(
      'beforebegin',
      `<div class="notice warn mb-md" id="checkout-pending">Les paiements en ligne ouvrent avec la prochaine cohorte. Laissez-nous votre adresse : vous recevrez le lien d’inscription en premier.</div>`,
    );
  }
  $$('[data-checkout]').forEach((a) =>
    a.addEventListener('click', () => {
      try {
        sessionStorage.setItem('ag42:intent', a.dataset.checkout);
      } catch {
        /* stockage indisponible */
      }
      if (window.plausible) window.plausible('Checkout', { props: { tier: a.dataset.checkout } });
    }),
  );
  $$('[data-waitlist]').forEach((a) => a.addEventListener('click', () => window.plausible?.('Waitlist', { props: { tier: a.dataset.waitlist } })));

  if (withButtons) {
    const slots = $$('[data-pay]').map((el) => ({ host: el, tier: config.checkout.tiers.find((t) => t.id === el.dataset.pay) }));
    mountPayPalButtons(slots);
  }

  const ent = $('#enterprise');
  if (ent) ent.innerHTML = `<p class="muted">${esc(config.checkout.enterprise.pitch)}</p><a class="btn btn-ghost" href="${esc(config.checkout.enterprise.mailto)}">Demander un devis</a>`;
}

// ---------- Témoignages, secteurs, FAQ, formateur, valeurs de config ----------
function socialProof() {
  const t = $('#testimonials');
  if (t) {
    if (config.testimonials.length === 0) $('[data-section="testimonials"]')?.remove();
    else
      t.innerHTML = config.testimonials
        .map(
          (x) => `<article class="card testimonial reveal"><blockquote>${esc(x.quote)}</blockquote>
          <div class="who"><span class="avatar">${esc(x.name.slice(0, 1))}</span><div><b>${esc(x.name)}</b><br>${esc(x.role)}</div></div></article>`,
        )
        .join('');
  }
  const s = $('#sectors');
  if (s) s.innerHTML = config.sectors.map((x) => `<span>${esc(x)}</span>`).join('');
  const f = $('#faq');
  if (f) f.innerHTML = config.faq.map((x) => `<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('');
  const i = $('#instructor');
  if (i) {
    const ins = config.site.instructor;
    if (!ins.name) $('[data-section="instructor"]')?.remove();
    else
      i.innerHTML = `<div class="who instructor-head"><span class="avatar avatar-lg">${esc(ins.name.slice(0, 1))}</span><div><b class="instructor-name">${esc(ins.name)}</b><br><span class="muted small">${esc(ins.title)}</span></div></div><p class="muted">${esc(ins.bio)}</p>`;
  }
  $$('[data-config]').forEach((el) => {
    const v = cfg(el.dataset.config);
    if (v !== undefined) el.textContent = v;
  });
  // Un service non branché ne produit jamais de lien mort : il ouvre une prise de contact.
  $$('[data-href]').forEach((el) => {
    const v = cfg(el.dataset.href);
    if (isConfiguredUrl(v)) {
      el.href = v;
      return;
    }
    el.href = contactHref(`${config.site.name} — ${el.textContent.trim() || 'communauté'}`);
    el.removeAttribute('target');
    el.dataset.pending = '1';
  });
  $$('[data-mailto]').forEach((el) => {
    el.textContent = config.site.contactEmail;
    el.href = 'mailto:' + config.site.contactEmail;
  });
}

// ---------- Newsletter ----------
function newsletter() {
  $$('form[data-newsletter]').forEach((form) => {
    const n = config.newsletter;
    const lead = $('[data-lead-magnet]', form.parentElement);
    if (lead) lead.textContent = n.leadMagnet;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('input[type=email]', form).value.trim();
      const out = $('.form-msg', form) || form.appendChild(Object.assign(document.createElement('p'), { className: 'form-msg notice' }));
      const btn = $('button', form);
      btn.disabled = true;
      try {
        if (n.provider === 'formspree' && n.endpoint && !/REMPLACER/.test(n.endpoint)) {
          const r = await fetch(n.endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: location.pathname }) });
          if (!r.ok) throw new Error('HTTP ' + r.status);
        } else if (n.provider === 'buttondown' && n.endpoint) {
          // Formulaire d'inscription intégré Buttondown (réponse opaque : on considère l'envoi comme réussi).
          const fd = new FormData();
          fd.append('email', email);
          await fetch(`https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(n.endpoint)}`, { method: 'POST', body: fd, mode: 'no-cors' });
        } else {
          location.href = `mailto:${config.site.contactEmail}?subject=${encodeURIComponent('Inscription au briefing')}&body=${encodeURIComponent(email)}`;
          btn.disabled = false;
          return;
        }
        out.className = 'form-msg notice ok';
        out.textContent = 'Inscription confirmée. Vérifiez votre boîte mail.';
        form.reset();
        if (window.plausible) window.plausible('Newsletter');
      } catch {
        out.className = 'form-msg notice err';
        out.textContent = 'Envoi impossible pour le moment. Réessayez ou écrivez-nous directement.';
      } finally {
        btn.disabled = false;
      }
    });
  });
}

// ---------- Mesure d'audience ----------
function analytics() {
  const a = config.analytics;
  if (a.provider === 'plausible' && a.plausibleDomain) {
    const s = document.createElement('script');
    s.defer = true;
    s.dataset.domain = a.plausibleDomain;
    s.src = 'https://plausible.io/js/script.tagged-events.js';
    document.head.appendChild(s);
    window.plausible = window.plausible || ((...args) => (window.plausible.q = window.plausible.q || []).push(args));
  } else if (a.provider === 'umami' && a.umamiSrc) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = a.umamiSrc;
    s.dataset.websiteId = a.umamiWebsiteId;
    document.head.appendChild(s);
  }
}

// ---------- Apparition au défilement ----------
function reveal() {
  const els = $$('.reveal');
  const showAll = () => els.forEach((e) => e.classList.add('in'));
  if (!('IntersectionObserver' in window) || window.matchMedia('print').matches) return showAll();
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { threshold: 0.12 },
  );
  els.forEach((e) => io.observe(e));
  setTimeout(showAll, 2000); // sécurité : tout est visible au plus tard après 2 s
  window.addEventListener('beforeprint', showAll);
}

// ---------- Terminal illustratif (page d'accueil) ----------
function terminal() {
  const t = $('#terminal');
  if (!t) return;
  const lines = [
    ['$ airgap audit --scope supervision-unite-3', ''],
    ['[1/6] inventaire des interfaces ............ 47 trouvées', 'dim'],
    ['[2/6] flux autorisés vs observés ........... 3 écarts', 'warn'],
    ['[3/6] médias amovibles (90 j) .............. 212 insertions', 'warn'],
    ['[4/6] ponts non documentés ................. 2 détectés', 'err'],
    ['      ↳ modem 4G maintenance (armoire B12)', 'err'],
    ['      ↳ partage SMB vers réseau bureautique', 'err'],
    ['[5/6] intégrité firmware (secure boot) ...... 38/47 OK', 'warn'],
    ['[6/6] plan de remédiation 90 j ............. généré', 'ok'],
    ['', ''],
    ['Score d’isolation : 61/100 → objectif 90+ en 42 jours', 'ok'],
  ];
  let i = 0;
  t.innerHTML = '';
  const step = () => {
    if (i >= lines.length) return t.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
    const [txt, cls] = lines[i++];
    t.insertAdjacentHTML('beforeend', `<span class="${cls}">${esc(txt)}</span>\n`);
    setTimeout(step, txt ? 260 + Math.random() * 300 : 120);
  };
  setTimeout(step, 500);
}

// ---------- Initialisation ----------
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  analytics();
  cohort();
  pricing();
  socialProof();
  newsletter();
  terminal();
  applyIcons();
  reveal();
  demoBanner();
});
