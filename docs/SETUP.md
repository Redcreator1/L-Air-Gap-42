# Guide d'installation et de mise en production

Temps estimé : 45 minutes, sans compter la création des comptes tiers.

## 1. GitHub Pages

Le workflow `.github/workflows/deploy.yml` se déclenche à chaque push sur `main` :

1. `npm run check` (validations)
2. `npm run build` avec les secrets (chiffrement)
3. `actions/configure-pages` avec `enablement: true` : **active GitHub Pages automatiquement** au premier passage, source « GitHub Actions ».
4. Déploiement.

Si l'activation automatique échoue (droits insuffisants du `GITHUB_TOKEN` sur certains comptes), allez dans **Settings → Pages → Source → GitHub Actions**, puis relancez le workflow (**Actions → Build & deploy → Run workflow**).

URL résultante : `https://<utilisateur>.github.io/<dépôt>/`. Elle doit correspondre à `site.url` dans `site/config.js` (utilisée pour sitemap, flux RSS, certificat). Vous pouvez aussi définir la variable de dépôt `SITE_URL` (**Settings → Variables**) qui prend le pas.

### Domaine personnalisé

1. Chez votre registrar, créez un enregistrement `CNAME` (`www` ou sous-domaine) vers `<utilisateur>.github.io`, ou les enregistrements `A`/`AAAA` de GitHub Pages pour un domaine apex.
2. Renseignez `site.customDomain: 'formation.exemple.com'` dans `site/config.js` → le build génère le fichier `CNAME`.
3. Mettez `site.url` à jour.
4. **Settings → Pages → Custom domain**, cochez *Enforce HTTPS* une fois le certificat émis.
5. Dans `site/404.html` et `scripts/e2e.mjs` (constante `BASE`), remplacez `/L-Air-Gap-42/` par `/` : la page 404 est servie à n'importe quelle profondeur et ne peut pas utiliser de chemins relatifs.

## 2. Secrets de production

```bash
npm run keygen
```

Copiez les quatre valeurs dans **Settings → Secrets and variables → Actions → New repository secret** :

| Secret | Rôle | Qui le voit |
| --- | --- | --- |
| `CONTENT_MASTER_SECRET` | Dérive les clés de contenu de chaque palier (HKDF) | GitHub Actions uniquement |
| `LICENSE_KEY_ESSENTIEL` | Clé vendue aux acheteurs Essentiel | Les acheteurs Essentiel |
| `LICENSE_KEY_PRO` | Clé vendue aux acheteurs Pro | Les acheteurs Pro |
| `LICENSE_KEY_ELITE` | Clé vendue aux acheteurs Elite | Les acheteurs Elite |

Conservez-les dans un gestionnaire de mots de passe. Tant qu'ils ne sont pas définis, le build tourne en **mode démo** avec des clés publiques et un bandeau d'avertissement sur le site.

**Rotation.** Changer `LICENSE_KEY_*` invalide les anciennes clés : prévenez les acheteurs et envoyez-leur la nouvelle. Changer `CONTENT_MASTER_SECRET` rechiffre tout sans effet visible pour les acheteurs (les enveloppes sont régénérées au build).

## 3. Paiement

### Option A : Stripe, en une commande (recommandé)

```bash
STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup            # aperçu, n'écrit pas le dépôt
STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup -- --write # inscrit les liens dans site/config.js
```

Le script crée, pour chaque palier de `site/config.js` :

- un **produit** d'identifiant fixe `airgap42_<palier>` (le script est relançable sans créer de doublon) ;
- un **tarif** unique au montant et dans la devise configurés, en `tax_behavior: exclusive` (prix hors taxes, TVA ajoutée au paiement) ;
- un **lien de paiement** qui redirige vers `/merci/?tier=<palier>&session_id={CHECKOUT_SESSION_ID}`, émet une facture, calcule la TVA automatiquement et accepte les codes promo.

Si vous changez un prix dans `site/config.js`, relancez le script : un nouveau tarif est créé, l'ancien lien est désactivé et remplacé.

Validez d'abord avec `sk_test_…` (carte de test `4242 4242 4242 4242`), puis rejouez avec `sk_live_…` pour la production.

**Livraison de la clé de licence.** Deux voies, au choix :

1. **Automatique (recommandé)** : déployez `api/activate.js` (section 4) et renseignez `api.activateUrl`. La page Merci échange l'identifiant de session Stripe contre la clé et active l'accès immédiatement. L'acheteur n'attend aucun e-mail et ne saisit rien.
2. **Par e-mail** : dans Stripe, *Settings → Emails → Successful payments*, ajoutez la clé de licence du palier au message de confirmation, ou branchez une automatisation (Zapier, Make) sur l'événement `checkout.session.completed`.

**Avant branchement.** Tant qu'un `checkoutUrl` contient `REMPLACER`, le site n'affiche aucun lien mort : les boutons deviennent « Être prévenu de l'ouverture » et un bandeau annonce l'ouverture prochaine. Vous pouvez donc publier le site avant d'avoir un compte Stripe.

### Option B : Lemon Squeezy (TVA UE gérée, clés de licence natives)

1. Créez une boutique et trois produits. Activez **License keys** sur chaque produit (une clé par achat, limite d'activations à votre convenance).
2. Dans `site/config.js` : `checkout.provider: 'lemonsqueezy'`, `checkout.lemonStore: '<slug>'`, et pour chaque palier `checkoutUrl` = l'UUID de la variante (ou l'URL complète de checkout).
3. Deux modes :
   - **statique** : la clé Lemon Squeezy sert d'identifiant, mais c'est la clé `LICENSE_KEY_<palier>` que vous transmettez dans l'e-mail de livraison du produit (champ *License key instructions* ou fichier joint) ;
   - **API (recommandé)** : déployez `api/activate.js` (section 4). L'acheteur saisit sa clé Lemon Squeezy personnelle ; le serveur la valide et lui rend la clé de contenu. Vous pouvez révoquer une clé individuelle depuis Lemon Squeezy.

### Page « merci »

`site/merci/` explique les trois étapes (récupérer la clé, l'activer, rejoindre le Discord). Elle lit `?tier=` pour l'analytics.

## 4. API d'activation (optionnel, Vercel)

Pour des licences individuelles révocables :

```bash
npm i -g vercel
vercel link
vercel env add LICENSE_KEY_ESSENTIEL   # + PRO, ELITE : mêmes valeurs que les secrets GitHub
vercel env add LEMONSQUEEZY_API_KEY    # ou STRIPE_SECRET_KEY
vercel env add LS_VARIANT_ESSENTIEL    # + PRO, ELITE (ou STRIPE_PRICE_*)
vercel env add ALLOWED_ORIGIN          # https://<utilisateur>.github.io
vercel deploy --prod
```

Puis `site/config.js` → `api.activateUrl: 'https://<projet>.vercel.app/api/activate'`. Le site reste sur GitHub Pages ; seule l'activation passe par Vercel.

## 5. Communauté

- **Discord** : créez le serveur (plan de salons dans `docs/COMMUNAUTE.md`), générez une invitation permanente → `community.discordInvite`. Pour le widget live : *Server Settings → Widget → Enable*, copiez l'ID → `community.discordServerId`.
- **GitHub Discussions** : **Settings → General → Features → Discussions**. Créez une catégorie « Leçons » (format *Announcement* ou *Open discussion*). Les modèles de `.github/DISCUSSION_TEMPLATE/` structurent les nouveaux fils.
- **giscus** (commentaires sous chaque leçon) : installez l'app https://github.com/apps/giscus sur le dépôt, puis sur https://giscus.app récupérez `repoId` et `categoryId` → `community.giscus`, `enabled: true`. Pour garder les commentaires privés aux membres, rendez le dépôt privé et donnez l'accès aux acheteurs en tant que collaborateurs (ou laissez les discussions ouvertes : c'est aussi du référencement).
- **Lives** : `community.liveSessions` (jour, heure, URL de visio visible uniquement aux membres Pro/Elite connectés).

## 6. Newsletter et analytics

- `newsletter.provider` : `formspree` (formulaire → e-mail, réponse vérifiée), `buttondown` (formulaire intégré, réponse opaque) ou `mailto` (aucun service). D'autres fournisseurs se branchent dans `newsletter()` de `site/assets/js/site.js` ; testez-les avant de les activer.
- `analytics.provider` : `plausible` ou `umami` (sans cookie, pas de bandeau nécessaire). Les événements `Checkout`, `Activate`, `Purchase`, `Newsletter` sont envoyés automatiquement.

## 7. Politique de sécurité de contenu (CSP)

Chaque page déclare une CSP dans une balise `<meta http-equiv="Content-Security-Policy">` (GitHub Pages ne permet pas d'en-têtes HTTP personnalisés). Elle autorise uniquement : les scripts du site, giscus, Lemon Squeezy et Plausible ; les polices Google ; les iframes giscus, Discord et Lemon Squeezy ; les connexions vers Formspree, Buttondown, Plausible et `*.vercel.app`.

Si vous ajoutez un service (Umami sur votre domaine, une autre visio, un lecteur vidéo), ajoutez son origine à la directive concernée dans **toutes** les pages, puis lancez `npm run e2e` : le test échoue sur toute violation CSP. Les scripts inline sont interdits par cette politique : le code de page vit dans `site/assets/js/pages/`.

## 8. Juridique et allégations commerciales

- `site/legal/index.html` contient CGV, mentions légales et politique de confidentialité pré-rédigées pour une vente de contenu numérique en France/UE. Remplacez les champs entre crochets. Faites relire si vous vendez à des consommateurs hors UE.
- Les prix sont affichés avec la mention de `checkout.priceNote` (HT par défaut). Pour une vente à des consommateurs en France, affichez des prix TTC.
- `testimonials`, `cohort.seatsLeft` et `site.instructor` sont vides ou neutres par défaut : ne renseignez que des témoignages réels (avec accord écrit), des places réellement disponibles et une expérience vérifiable. Une allégation fausse relève des pratiques commerciales trompeuses.

## 9. Vérifier le déploiement

1. Ouvrez le site : le bandeau « Mode démo » ne doit **plus** apparaître.
2. Page **Accès** : saisissez une vraie clé de licence de chaque palier, vérifiez que les bons modules s'ouvrent.
3. Testez un achat réel à 1 € (créez un prix temporaire) de bout en bout : paiement → e-mail → activation.
4. Vérifiez `sitemap.xml`, `feed.xml`, et soumettez le site à la Search Console.

## 10. Tests

```bash
npm run check                     # curriculum, quiz, liens, chiffrement (sans navigateur)
npm ci && npx playwright install chromium
npm run build && npm run e2e      # parcours complet dans Chromium, sous /L-Air-Gap-42/
SHOTS=1 npm run e2e               # + captures d'écran dans .e2e-shots/
```

Le workflow `ci.yml` exécute les deux sur chaque pull request ; `deploy.yml` exécute `check` avant chaque publication.

## Dépannage

| Symptôme | Cause probable | Correctif |
| --- | --- | --- |
| Bandeau « Mode démo » en production | Secrets non définis ou mal nommés | Vérifiez les 4 secrets, relancez le workflow |
| « Clé invalide » avec une bonne clé | Le site n'a pas été rebuildé après changement de secret ; ou espaces/caractères ambigus | Relancez le workflow ; la saisie ignore la casse et les espaces mais pas O/0 |
| Pages non activées | Droits du `GITHUB_TOKEN` | Settings → Pages → Source : GitHub Actions |
| Styles absents sur la 404 | Chemins absolus `/L-Air-Gap-42/` | Adaptez `site/404.html` à votre chemin de base |
| Contenu premium visible dans `dist/data` | Impossible : seuls les JSON chiffrés y sont ; les leçons gratuites sont en clair par conception | — |
