# L'Air Gap 42

**Un parcours de sécurité qui se joue dans le terminal, hors-ligne.**
45 niveaux sur la conception, l'exploitation et l'audit des systèmes isolés (air gap, OT/ICS, transferts, détection, durcissement, NIS2 / IEC 62443). Le site est la documentation ; le parcours vit dans une archive que l'apprenant télécharge, vérifie et exécute chez lui.

| | |
| --- | --- |
| Site public | https://redcreator1.github.io/L-Air-Gap-42/ |
| Parcours | 45 niveaux · 7 modules · ~27 000 mots · 3 niveaux gratuits |
| Exécution | `sh` + `openssl`, hors-ligne, sans installation ni droits d'administration |
| Paiement | PayPal (boutons ou liens sans code) |
| Accès | Niveaux chiffrés AES-256-CBC / PBKDF2, enveloppes de clés par palier |
| Publication | GitHub Actions → branche `gh-pages`, **aucun secret** |

## Le modèle, en une phrase

Le site ne contient aucune leçon. Il documente comment jouer. L'apprenant télécharge `airgap42-labs.tar.gz`, vérifie son empreinte SHA-256 publiée sur le site, extrait, et lance `./airgap42`. Sa clé de licence ouvre les niveaux de son palier. Une licence Pro ouvre aussi les niveaux Essentiel, parce que la clé de chaque niveau est réemballée sous chaque licence qui y donne droit.

```
clé de licence  ──PBKDF2──▶  ouvre l'enveloppe <niveau>.k.<palier>
enveloppe       ──────────▶  contient la clé de contenu du niveau
clé de contenu  ──AES-CBC─▶  déchiffre <niveau>.enc → le briefing
```

C'est cohérent avec le sujet : un cours sur l'isolation qui exigerait un navigateur connecté se contredirait.

## Commandes du projet

Vous n'avez normalement **rien à exécuter** : la publication est automatique à chaque push sur `main`. Ces commandes servent à faire évoluer le contenu.

```bash
npm run lab     # reconstruit l'archive de niveaux (à faire après toute modification du contenu)
npm run build   # construit le site → dist/
npm run check   # curriculum, quiz, liens, intégrité de l'archive, déchiffrement réel
npm run dev     # http://localhost:4242
npm run e2e     # parcours du site dans Chromium (npm ci && npx playwright install chromium)
```

`npm run lab` lit les clés de licence dans `lab/licences.json`, **hors dépôt**. Ce fichier est la seule chose à conserver précieusement : sans lui, impossible de reconstruire une archive que les licences déjà vendues ouvriraient. Les variables `LICENCE_ESSENTIEL`, `LICENCE_PRO` et `LICENCE_ELITE` font la même chose.

## Architecture

```
lab/
  airgap42            lanceur POSIX sh, un seul fichier, lisible avant d'être exécuté
  LISEZMOI            aide hors-ligne livrée dans l'archive
content/
  curriculum.json     modules, leçons, paliers
  modules/**/*.md     leçons en Markdown + bloc ```quiz
  niveaux.json        index public généré par `npm run lab` (titres, extraits, empreinte)
site/                 documentation statique (HTML/CSS/JS, sans framework)
  jouer/              mode d'emploi : télécharger, vérifier, extraire, jouer
  telechargements/    airgap42-labs.tar.gz + son empreinte, versionnés
scripts/
  build-lab.mjs       content/ + lab/ → archive chiffrée
  build.mjs           site/ → dist/
  check.mjs, e2e.mjs  vérifications
api/activate.js       (optionnel) fonction Vercel : commande PayPal vérifiée → clé de licence
```

## Pourquoi l'archive est versionnée

Parce qu'elle est chiffrée avec des clés qui ne doivent exister nulle part sur GitHub. La chaîne de publication se contente donc de copier un fichier déjà chiffré : elle n'a besoin d'aucun secret, et un dépôt public ne peut rien fuiter qu'il ne contienne déjà.

**Point d'attention.** Le dépôt est public et `content/modules/` contient les leçons en clair. Le texte du parcours est donc lisible sur GitHub, y compris dans l'historique. Si vous voulez qu'il reste confidentiel, la source doit vivre dans un dépôt privé et seul le site être publié depuis un dépôt public. Voir `docs/SETUP.md`.

## Documentation

- [`docs/SETUP.md`](docs/SETUP.md) — mise en production, paiement, communauté
- [`docs/MONETISATION.md`](docs/MONETISATION.md) — offre, prix, tunnel de vente
- [`docs/COMMUNAUTE.md`](docs/COMMUNAUTE.md) — animation du Discord et des lives
- [`docs/CONTENU.md`](docs/CONTENU.md) — écrire et modifier les niveaux

## Licence

Contenu et code propriétaires. Tous droits réservés.
