# L'Air Gap 42

**Plateforme de formation premium, 100 % statique, hébergée sur GitHub Pages.**
Programme de 42 jours sur la sécurité des systèmes isolés (air gap, OT/ICS, transferts sécurisés, détection, durcissement, conformité NIS2 / IEC 62443), vendu en trois paliers avec communauté intégrée.

| | |
| --- | --- |
| Site public | `https://redcreator1.github.io/L-Air-Gap-42/` (après activation de Pages, voir `docs/SETUP.md`) |
| Contenu | 7 modules · 45 leçons · ~27 000 mots · quiz à chaque leçon |
| Paiement | Stripe Payment Links ou Lemon Squeezy (configurable) |
| Accès | Contenu premium chiffré AES-256-GCM au build, déverrouillé par clé de licence dans le navigateur |
| Communauté | Discord + GitHub Discussions (giscus sous chaque leçon) + lives hebdomadaires + newsletter |
| Dépendances | Aucune. Node ≥ 20 pour le build. |

## Démarrer en 60 secondes

```bash
npm run check   # valide curriculum, quiz, liens, chiffrement
npm run build   # génère dist/ (mode démo si aucun secret)
npm run dev     # http://localhost:4242
```

Licences de démonstration (mode démo uniquement) : `AG42-DEMO-ESSENTIEL-2026`, `AG42-DEMO-PRO-2026`, `AG42-DEMO-ELITE-2026`. Saisissez-les sur la page **Accès**.

## Mise en production

1. `npm run keygen` → copiez les 4 valeurs dans **Settings → Secrets and variables → Actions** du dépôt.
2. Créez vos liens de paiement et renseignez `site/config.js` (`checkout.tiers[].checkoutUrl`, Discord, newsletter, e-mail de contact).
3. Fusionnez sur `main` : le workflow `deploy.yml` construit, chiffre et publie sur GitHub Pages (il active Pages automatiquement au premier passage).
4. Complétez `site/legal/index.html` (raison sociale, SIREN, TVA, médiateur).

Le guide détaillé : [`docs/SETUP.md`](docs/SETUP.md). La stratégie de vente : [`docs/MONETISATION.md`](docs/MONETISATION.md). L'animation de la communauté : [`docs/COMMUNAUTE.md`](docs/COMMUNAUTE.md). La rédaction des leçons : [`docs/CONTENU.md`](docs/CONTENU.md).

## Architecture

```
site/                 pages statiques (HTML/CSS/JS, sans framework)
  config.js           configuration unique : offres, prix, cohorte, communauté, analytics
  assets/js/site.js   navigation, tarifs, FAQ, compte à rebours, newsletter
  assets/js/app.js    espace membre : tableau de bord, leçons, quiz, notes, certificat
  assets/js/crypto.js déchiffrement WebCrypto (PBKDF2 → AES-GCM)
  assets/js/md.js     rendu Markdown maison (hors-ligne, sans CDN)
content/
  curriculum.json     modules, leçons, paliers
  modules/**/*.md     leçons en Markdown + frontmatter + bloc ```quiz
scripts/
  build.mjs           site/ + content/ → dist/ (chiffrement des modules premium)
  check.mjs           validations + test de bout en bout du chiffrement
  keygen.mjs          génération des secrets de production
  dev.mjs             serveur local
api/activate.js       (optionnel) fonction Vercel : licence individuelle → clé de contenu
.github/workflows/    déploiement GitHub Pages
```

### Modèle d'accès

```
clé de licence (vendue)  ──PBKDF2-SHA256──▶  clé d'enveloppe
clé d'enveloppe          ──AES-GCM────────▶  déchiffre keys.json → clés de contenu des paliers ≤ licence
clé de contenu (palier)  ──AES-GCM────────▶  déchiffre data/modules/<id>.enc.json → leçons
```

Une licence Pro ouvre Essentiel + Pro ; une licence Elite ouvre tout. Une licence inférieure ne contient pas la clé des paliers supérieurs (vérifié par `npm run check`). Rien ne transite par un serveur : le contenu est lisible hors-ligne une fois chargé, ce qui est cohérent avec le sujet enseigné.

Pour des licences **individuelles et révocables**, déployez `api/activate.js` sur Vercel et renseignez `api.activateUrl` : la clé Lemon Squeezy ou la session Stripe de l'acheteur est échangée côté serveur contre la clé de contenu.

## Licence

Contenu et code propriétaires. Tous droits réservés.
