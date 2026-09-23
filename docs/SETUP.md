# Mise en production

Le principe : **vous n'exécutez aucune commande.** Tout ce qui doit tourner tourne sur GitHub. Ce guide ne vous demande que des réglages dans une interface web et des valeurs à coller dans un fichier de configuration.

## 1. Publication (déjà en place)

Le workflow `.github/workflows/deploy.yml` se déclenche à chaque push sur `main` :

1. `npm run check` — curriculum, épreuves, liens, intégrité de l'archive et **partie simulée de bout en bout** ;
2. `npm run build` — construit le site ;
3. publication sur la branche `gh-pages`.

Sur un dépôt public, GitHub active Pages tout seul au premier push de cette branche. **Aucun secret n'est nécessaire** : l'archive de niveaux est déjà chiffrée et versionnée dans le dépôt, la chaîne de publication ne fait que la copier.

Ne modifiez jamais la branche `gh-pages` à la main : elle est écrasée à chaque déploiement.

### Domaine personnalisé

1. Chez votre registrar : un `CNAME` (`www` ou sous-domaine) vers `<utilisateur>.github.io`, ou les enregistrements `A`/`AAAA` de GitHub Pages pour un domaine apex.
2. `site/config.js` → `site.customDomain: 'airgap42.com'` et `site.url` à jour.
3. **Settings → Pages → Custom domain**, puis cochez *Enforce HTTPS*.
4. Dans `site/404.html` et `scripts/e2e.mjs` (constante `BASE`), remplacez `/L-Air-Gap-42/` par `/`.

## 2. Vos clés de licence

Les trois clés vendues ont été générées à la construction de l'archive et vivent dans `lab/licences.json`, **qui n'est pas dans le dépôt**. Rangez-les dans un gestionnaire de mots de passe.

| Palier | Ce que la clé ouvre |
| --- | --- |
| Essentiel | modules 1 et 2 |
| Pro | modules 1 à 5 |
| Elite | les 6 modules |

Une licence supérieure ouvre les paliers inférieurs. Vous n'avez rien à faire pour cela : les enveloppes de clés sont déjà dans l'archive.

**Changer une clé** oblige à reconstruire l'archive, donc à prévenir les acheteurs concernés : leur ancienne clé cessera de fonctionner. Ne le faites qu'en cas de fuite avérée.

## 3. Paiement PayPal

### Option A : boutons PayPal (recommandé)

1. Sur https://developer.paypal.com/dashboard/applications, créez une application. Notez le **Client ID** (public) et le **Secret** (jamais publié). Commencez en **Sandbox**.
2. `site/config.js` → `checkout.paypal.clientId`, et `sandbox: true` le temps des essais.
3. Un bouton PayPal apparaît dans chaque carte de tarif. Montant, devise et palier viennent de `checkout.tiers`.
4. Testez avec un compte acheteur Sandbox, puis repassez en production : application *Live*, `clientId` de production, `sandbox: false`.

**Délivrance de la clé.** Deux voies :

1. **Automatique (recommandé)** : déployez `api/activate.js` (section 4) et renseignez `api.activateUrl`. La commande est encaissée et vérifiée côté serveur, puis la clé s'affiche à l'écran, prête à être recopiée dans le terminal.
2. **Par e-mail** : sans cette fonction, vous envoyez la clé du palier après avoir vérifié le paiement dans votre tableau de bord PayPal.

> **Important.** Le bouton construit la commande dans le navigateur : le montant peut y être manipulé. C'est la fonction d'activation qui protège la vente, en comparant le montant réellement encaissé au tarif attendu (`PAYPAL_PRICES`). Sans elle, vérifiez chaque paiement avant d'envoyer une clé.

### Option B : liens de paiement PayPal (sans code)

Dans PayPal, *Outils → Liens et boutons de paiement*, créez un lien par palier, collez chaque URL dans le `checkoutUrl` du palier, et laissez `clientId` vide. Le montant est fixé par PayPal, donc non manipulable, mais il n'y a pas de délivrance automatique.

### Avant branchement

Tant qu'aucun `clientId` ni `checkoutUrl` n'est renseigné, aucun lien mort n'apparaît : les boutons deviennent « Être prévenu de l'ouverture » et un bandeau annonce l'ouverture prochaine.

## 4. Délivrance automatique de la clé (optionnel, Vercel)

```bash
vercel env add PAYPAL_CLIENT_ID        # identifiant de l'application PayPal
vercel env add PAYPAL_CLIENT_SECRET    # secret de l'application
vercel env add PAYPAL_SANDBOX          # 1 en bac à sable, à supprimer en production
vercel env add PAYPAL_PRICES           # {"essentiel":390,"pro":1190,"elite":1900}
vercel env add PAYPAL_CURRENCY         # EUR
vercel env add LICENCE_ESSENTIEL       # vos trois clés, cf. section 2
vercel env add ALLOWED_ORIGIN          # https://redcreator1.github.io
vercel deploy --prod
```

Les clés s'appellent ici `LICENSE_KEY_ESSENTIEL`, `LICENSE_KEY_PRO`, `LICENSE_KEY_ELITE` dans la fonction : reportez-y les valeurs de `lab/licences.json`. Puis `site/config.js` → `api.activateUrl`.

`PAYPAL_PRICES` doit refléter les prix de `site/config.js` : c'est la référence qui empêche qu'un paiement minoré ouvre un palier.

*(Cette étape est la seule du guide qui demande des commandes. Si vous ne voulez pas la faire, restez sur la délivrance par e-mail : le reste fonctionne sans.)*

## 5. Communauté

- **Discord** : créez le serveur (plan de salons dans `docs/COMMUNAUTE.md`), invitation permanente → `community.discordInvite`. Widget : *Server Settings → Widget → Enable*, ID → `community.discordServerId`.
- **GitHub Discussions** : **Settings → General → Features → Discussions**. Modèles fournis dans `.github/DISCUSSION_TEMPLATE/`.
- **Lives** : `community.liveSessions`.

Tant qu'une URL de communauté contient `REMPLACER`, le lien correspondant est masqué au lieu de pointer dans le vide.

## 6. Newsletter et mesure d'audience

- `newsletter.provider` : `formspree`, `buttondown` ou `mailto`.
- `analytics.provider` : `plausible` ou `umami`, sans cookie, donc sans bandeau de consentement.

## 7. Politique de sécurité de contenu

Chaque page déclare une CSP en balise `<meta>` (GitHub Pages ne permet pas d'en-têtes personnalisés). Elle autorise les scripts du site, PayPal, giscus et Plausible ; les polices Google ; les iframes PayPal, Discord et giscus. Si vous ajoutez un service, ajoutez son origine sur **toutes** les pages et relancez `npm run e2e` : le test échoue sur toute violation.

## 8. Confidentialité du contenu

**C'est fait pour ce qui vient.** Les 45 leçons, leurs réponses et le lanceur vivent dans le dépôt privé [`Jeux42`](https://github.com/Redcreator1/Jeux42). Ce dépôt public ne reçoit plus que l'archive chiffrée, son empreinte et l'index — aucune réponse. `npm run check` refuse que les leçons en clair y réapparaissent, et refuse qu'une réponse soit lisible dans l'index publié.

**Ce qui reste exposé.** Les leçons commitées ici *avant* la séparation restent dans l'historique git, et tout le monde peut les lire avec `git log -p`. Déplacer des fichiers n'efface rien du passé. Deux postures :

1. **Assumer.** Le produit vendu n'est pas le texte : c'est le parcours, la chaîne des épreuves, le certificat. C'est le modèle d'OverTheWire, dont tout le contenu est public depuis vingt ans.
2. **Réécrire l'historique du dépôt public.** Destructif et irréversible : la réécriture casse les clones existants et les pull requests ouvertes, et elle ne récupère pas ce qui a déjà été copié ou indexé. À ne faire qu'avec une sauvegarde, et en connaissance de cause.

### Les secrets, désormais

Dans *Settings → Secrets and variables → Actions* du dépôt **privé** : `LICENCE_ESSENTIEL`, `LICENCE_PRO`, `LICENCE_ELITE`, et `TOKEN_PUBLIC` (un jeton avec droit d'écriture ici). Les licences ne sont commitées nulle part, même en privé.

⚠️ Ne régénérez jamais les licences : ce sont elles que vous vendez, et de nouvelles clés n'ouvriraient plus l'archive pour les acheteurs existants.

## 9. Juridique et allégations

- `site/legal/index.html` : remplacez les champs entre crochets (raison sociale, SIREN, TVA, médiateur).
- Vente à des consommateurs en France : les prix affichés doivent être TTC. Ajustez `checkout.priceNote`.
- `testimonials`, `cohort.seatsLeft` et `site.instructor` sont vides ou neutres par défaut. N'y mettez que du vérifiable.

## 10. Vérifier après publication

1. Ouvrez la page **Jouer** : l'empreinte affichée doit être celle du fichier téléchargé.
2. Téléchargez l'archive, extrayez-la, lancez `./airgap42` : les trois premiers niveaux doivent s'ouvrir sans clé.
3. Enregistrez une clé de licence : le palier correspondant doit se déverrouiller, et lui seul.
4. Faites un achat réel à 1 € (prix temporaire) de bout en bout.
