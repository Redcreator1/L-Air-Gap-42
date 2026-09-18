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
5. Dans `site/404.html`, remplacez les chemins `/L-Air-Gap-42/` par `/` (la page 404 est servie à n'importe quelle profondeur, elle ne peut pas utiliser de chemins relatifs).

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

### Option A : Stripe Payment Links (simple)

1. Dans Stripe, créez trois produits (Essentiel, Pro, Elite) avec un prix unique chacun.
2. Créez un **Payment Link** par produit. Dans *After payment* :
   - choisissez **Don't show confirmation page → Redirect customers to your website** avec `https://<votre-site>/merci/?tier=pro` (une URL par palier) ;
   - **ou** gardez la page de confirmation Stripe et ajoutez un *Custom message* contenant la clé de licence du palier.
3. Activez la facturation automatique (*Invoices*) et la collecte de la TVA (*Stripe Tax*) si vous vendez dans l'UE.
4. Envoyez la clé de licence par e-mail : le plus simple est le message de confirmation Stripe (*Settings → Emails → Successful payments*, personnalisable par produit via les métadonnées) ou une automatisation (Zapier / Make : *Checkout completed* → e-mail avec la clé du palier).
5. Collez les liens dans `site/config.js` → `checkout.tiers[].checkoutUrl`.

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

- `newsletter.provider` : `formspree` (le plus simple, formulaire → e-mail), `buttondown`, `convertkit` ou `mailto`.
- `analytics.provider` : `plausible` ou `umami` (sans cookie, pas de bandeau nécessaire). Les événements `Checkout`, `Activate`, `Purchase`, `Newsletter` sont envoyés automatiquement.

## 7. Juridique

`site/legal/index.html` contient CGV, mentions légales et politique de confidentialité pré-rédigées pour une vente de contenu numérique en France/UE. Remplacez les champs entre crochets. Faites relire si vous vendez à des consommateurs hors UE.

## 8. Vérifier le déploiement

1. Ouvrez le site : le bandeau « Mode démo » ne doit **plus** apparaître.
2. Page **Accès** : saisissez une vraie clé de licence de chaque palier, vérifiez que les bons modules s'ouvrent.
3. Testez un achat réel à 1 € (créez un prix temporaire) de bout en bout : paiement → e-mail → activation.
4. Vérifiez `sitemap.xml`, `feed.xml`, et soumettez le site à la Search Console.

## Dépannage

| Symptôme | Cause probable | Correctif |
| --- | --- | --- |
| Bandeau « Mode démo » en production | Secrets non définis ou mal nommés | Vérifiez les 4 secrets, relancez le workflow |
| « Clé invalide » avec une bonne clé | Le site n'a pas été rebuildé après changement de secret ; ou espaces/caractères ambigus | Relancez le workflow ; la saisie ignore la casse et les espaces mais pas O/0 |
| Pages non activées | Droits du `GITHUB_TOKEN` | Settings → Pages → Source : GitHub Actions |
| Styles absents sur la 404 | Chemins absolus `/L-Air-Gap-42/` | Adaptez `site/404.html` à votre chemin de base |
| Contenu premium visible dans `dist/data` | Impossible : seuls les JSON chiffrés y sont ; les leçons gratuites sont en clair par conception | — |
