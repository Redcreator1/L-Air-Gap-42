/**
 * Script commun à toutes les pages : navigation, pied de page, injection de la config,
 * compte à rebours, tarifs, FAQ, témoignages, newsletter, analytics, animations.
 * Chaque bloc ne s'exécute que si son conteneur existe dans la page.
 */
import config from '../../config.js';
import { store } from './store.js';

export const BASE = new URL('../../', import.meta.url).pathname; // ex : /L-Air-Gap-42/
if ('IntersectionObserver' in window) document.documentElement.classList.add('js'); // active les animations .reveal
export const url = (p = '') => BASE + p.replace(/^\//, '');
export { config };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const fmtPrice = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: config.checkout.currency, maximumFractionDigits: 0 }).format(n);

// ---------- Navigation & footer ----------
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
        ${lic ? `<a class="btn btn-ghost btn-sm" href="${url('app/')}">Mon parcours · ${esc(lic.tier)}</a>` : `<a class="btn btn-ghost btn-sm" href="${url('acces/')}">J’ai une licence</a>`}
        <a class="btn btn-primary btn-sm" href="${url('tarifs/')}">Rejoindre</a>
        <button class="nav-burger" aria-label="Menu" aria-expanded="false">☰</button>
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
          <p style="margin-top:14px;max-width:38ch">${esc(config.site.tagline)}</p>
        </div>
        <div><h4>Programme</h4><ul>
          <li><a href="${url('programme/')}">Les 6 modules</a></li>
          <li><a href="${url('tarifs/')}">Tarifs</a></li>
          <li><a href="${url('app/#/m/m0/pourquoi-air-gap')}">Briefing gratuit</a></li>
          <li><a href="${url('feed.xml')}">Flux RSS</a></li>
        </ul></div>
        <div><h4>Communauté</h4><ul>
          <li><a href="${esc(config.community.discordInvite)}" rel="noopener" target="_blank">Discord</a></li>
          <li><a href="${esc(config.community.discussionsUrl)}" rel="noopener" target="_blank">Discussions GitHub</a></li>
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
    const b = await r.json();
    const bi = $('#build-info');
    if (bi) bi.textContent = `build ${b.commit} · ${new Date(b.builtAt).toLocaleDateString('fr-FR')}`;
    if (b.demo) {
      const el = document.createElement('div');
      el.className = 'demo-banner';
      el.innerHTML = `Mode démo : secrets non configurés. Licences de test — Essentiel <code>${b.demoLicenses.essentiel}</code> · Pro <code>${b.demoLicenses.pro}</code> · Elite <code>${b.demoLicenses.elite}</code>`;
      document.body.prepend(el);
    }
  } catch {
    /* pas de build.json (page servie hors build) */
  }
}

// ---------- Compte à rebours & cohorte ----------
function cohort() {
  $$('[data-cohort]').forEach((el) => (el.textContent = config.cohort[el.dataset.cohort] ?? ''));
  const bar = $('#seats-bar');
  if (bar) {
    const pct = Math.max(4, Math.round(((config.cohort.seats - config.cohort.seatsLeft) / config.cohort.seats) * 100));
    bar.innerHTML = `<i style="width:${pct}%"></i>`;
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
      if (note) note.textContent = 'Inscriptions de cette cohorte closes — rejoignez la liste d’attente.';
    }
  };
  tick();
  setInterval(tick, 1000);
}

// ---------- Tarifs ----------
export function checkoutHref(tier) {
  if (config.checkout.provider === 'lemonsqueezy' && config.checkout.lemonStore && !/^https?:/.test(tier.checkoutUrl)) {
    return `https://${config.checkout.lemonStore}.lemonsqueezy.com/checkout/buy/${tier.checkoutUrl}?embed=1`;
  }
  return tier.checkoutUrl;
}
function pricing() {
  const host = $('#pricing');
  if (!host) return;
  host.innerHTML = config.checkout.tiers
    .map(
      (t) => `
    <article class="price-card ${t.highlight ? 'highlight' : ''}" id="tier-${t.id}">
      ${t.badge ? `<span class="price-badge">${esc(t.badge)}</span>` : ''}
      <h3>${esc(t.name)}</h3>
      <p class="pitch">${esc(t.pitch)}</p>
      <div class="price"><span class="amount">${fmtPrice(t.price)}</span>${t.priceBefore ? `<span class="before">${fmtPrice(t.priceBefore)}</span>` : ''}</div>
      <div class="price-note">Paiement unique · HT · accès à vie · facture fournie</div>
      <ul class="features">${t.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <a class="btn ${t.highlight ? 'btn-primary' : 'btn-ghost'} btn-block" href="${esc(checkoutHref(t))}" data-checkout="${t.id}" ${config.checkout.provider === 'lemonsqueezy' ? 'class="lemonsqueezy-button"' : ''}>${esc(t.cta)}</a>
    </article>`,
    )
    .join('');
  $$('[data-checkout]').forEach((a) =>
    a.addEventListener('click', () => {
      try {
        sessionStorage.setItem('ag42:intent', a.dataset.checkout);
      } catch {
        /* ignore */
      }
      if (window.plausible) window.plausible('Checkout', { props: { tier: a.dataset.checkout } });
    }),
  );
  if (config.checkout.provider === 'lemonsqueezy') {
    const s = document.createElement('script');
    s.src = 'https://assets.lemonsqueezy.com/lemon.js';
    s.defer = true;
    document.head.appendChild(s);
  }
  const g = $('#guarantee-days');
  if (g) g.textContent = config.checkout.guaranteeDays;
  const ent = $('#enterprise');
  if (ent) ent.innerHTML = `<p class="muted">${esc(config.checkout.enterprise.pitch)}</p><a class="btn btn-ghost" href="${esc(config.checkout.enterprise.mailto)}">Demander un devis</a>`;
}

// ---------- Témoignages, logos, FAQ, formateur ----------
function socialProof() {
  const t = $('#testimonials');
  if (t)
    t.innerHTML = config.testimonials
      .map(
        (x) => `<article class="card testimonial reveal"><blockquote>${esc(x.quote)}</blockquote>
        <div class="who"><span class="avatar">${esc(x.name.slice(0, 1))}</span><div><b>${esc(x.name)}</b><br>${esc(x.role)}</div></div></article>`,
      )
      .join('');
  const l = $('#logos');
  if (l) l.innerHTML = config.logos.map((x) => `<span>${esc(x)}</span>`).join('');
  const f = $('#faq');
  if (f) f.innerHTML = config.faq.map((x) => `<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('');
  const i = $('#instructor');
  if (i) {
    const ins = config.site.instructor;
    i.innerHTML = `<div class="who" style="display:flex;gap:16px;align-items:center;margin-bottom:14px"><span class="avatar" style="width:56px;height:56px;font-size:1.3rem">${esc(ins.name.replace(/^L[’']/, '').slice(0, 1))}</span><div><b style="font-family:var(--font-display);font-size:1.15rem">${esc(ins.name)}</b><br><span class="muted small">${esc(ins.title)}</span></div></div><p class="muted">${esc(ins.bio)}</p>`;
  }
  $$('[data-config]').forEach((el) => {
    const v = el.dataset.config.split('.').reduce((o, k) => (o ? o[k] : undefined), config);
    if (v !== undefined) el.textContent = v;
  });
  $$('[data-href]').forEach((el) => {
    const v = el.dataset.href.split('.').reduce((o, k) => (o ? o[k] : undefined), config);
    if (v) el.href = v;
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
        if (n.provider === 'mailto' || !n.endpoint || /REMPLACER/.test(n.endpoint)) {
          location.href = `mailto:${config.site.contactEmail}?subject=Inscription%20briefing&body=${encodeURIComponent(email)}`;
        } else if (n.provider === 'buttondown') {
          const fd = new FormData();
          fd.append('email', email);
          await fetch(`https://buttondown.com/api/emails/embed-subscribe/${n.endpoint}`, { method: 'POST', body: fd, mode: 'no-cors' });
        } else if (n.provider === 'convertkit') {
          await fetch(n.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email_address: email }) });
        } else {
          const r = await fetch(n.endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: location.pathname }) });
          if (!r.ok) throw new Error('HTTP ' + r.status);
        }
        out.className = 'form-msg notice ok';
        out.textContent = 'Inscription confirmée. Vérifiez votre boîte mail — le briefing arrive.';
        form.reset();
        if (window.plausible) window.plausible('Newsletter');
      } catch {
        out.className = 'form-msg notice err';
        out.textContent = 'Impossible d’envoyer pour le moment. Réessayez ou écrivez-nous directement.';
      } finally {
        btn.disabled = false;
      }
    });
  });
}

// ---------- Analytics ----------
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

// ---------- Reveal on scroll ----------
function reveal() {
  const els = $$('.reveal');
  const showAll = () => els.forEach((e) => e.classList.add('in'));
  if (!('IntersectionObserver' in window) || window.matchMedia('print').matches) return showAll();
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { threshold: 0.12 },
  );
  els.forEach((e) => io.observe(e));
  // Sécurité : tout est visible au plus tard après 2 s (capture, impression, observer défaillant).
  setTimeout(showAll, 2000);
  window.addEventListener('beforeprint', showAll);
}

// ---------- Terminal animé (hero) ----------
function terminal() {
  const t = $('#terminal');
  if (!t) return;
  const lines = [
    ['$ airgap audit --scope supervision-plant-3', ''],
    ['[1/6] inventaire des interfaces ............ 47 trouvées', 'dim'],
    ['[2/6] flux autorisés vs observés ........... 3 écarts', 'warn'],
    ['[3/6] médias amovibles (90 j) .............. 212 insertions', 'warn'],
    ['[4/6] ponts non documentés ................. 2 DÉTECTÉS', 'err'],
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

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  analytics();
  cohort();
  pricing();
  socialProof();
  newsletter();
  terminal();
  reveal();
  demoBanner();
});
