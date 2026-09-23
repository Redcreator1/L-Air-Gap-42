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
npm run build   # construit le site → dist/
npm run check   # liens, engagements, archive publiée, premier maillon de la chaîne
npm run dev     # http://localhost:4242
npm run e2e     # parcours du site dans Chromium (npm ci && npx playwright install chromium)
```

**Le contenu ne se modifie pas ici.** Les 45 leçons, leurs réponses et le lanceur vivent dans le dépôt privé [`Jeux42`](https://github.com/Redcreator1/Jeux42), qui reconstruit l'archive et la pousse ici tout seul.

## Architecture

```
content/
  niveaux.json        index public : titres, extraits, empreinte — aucune réponse
site/                 documentation statique (HTML/CSS/JS, sans framework)
  briefing/           les sept erreurs, en lecture libre
  jouer/              mode d'emploi : télécharger, vérifier, extraire, jouer
  telechargements/    airgap42-labs.tar.gz + son empreinte
scripts/
  build.mjs           site/ → dist/
  check.mjs, e2e.mjs  vérifications
api/activate.js       (optionnel) fonction Vercel : commande PayPal vérifiée → clé de licence
```

Trois de ces fichiers ne s'éditent jamais à la main — `content/niveaux.json` et les deux fichiers de `site/telechargements/` sont écrits par `Jeux42`. `npm run check` refuse d'ailleurs que les leçons en clair réapparaissent ici.

## Les deux dépôts

```
Jeux42  (prive)                        L-Air-Gap-42  (public, ici)
  les 45 lecons en clair           --+
  les reponses de chaque epreuve     |   site/             pages et vitrine
  le lanceur airgap42                +-> site/telechargements/*.tar.gz
  la fabrique de l'archive           |   content/niveaux.json
  les licences vendues             --+   -> GitHub Pages
```

Ce dépôt ne contient ni leçon ni réponse. Il reçoit trois fichiers, tous inoffensifs : l'archive **chiffrée**, son empreinte, et l'index public. La chaîne de publication n'a donc besoin d'aucun secret, et ce dépôt ne peut rien fuiter qu'il ne contienne déjà.

**Point d'attention.** Cette séparation protège ce qui vient. Les leçons publiées ici avant la séparation restent lisibles dans l'historique git : seule une réécriture d'historique les retirerait, et elle ne récupère pas ce qui a déjà été copié. Voir `docs/SETUP.md`.

## Documentation

- [`docs/SETUP.md`](docs/SETUP.md) — mise en production, paiement, communauté
- [`docs/MONETISATION.md`](docs/MONETISATION.md) — offre, prix, tunnel de vente
- [`docs/COMMUNAUTE.md`](docs/COMMUNAUTE.md) — animation du Discord et des lives
- Écrire ou modifier un niveau : voir le README du dépôt privé [`Jeux42`](https://github.com/Redcreator1/Jeux42)

## Licence

Contenu et code propriétaires. Tous droits réservés.
