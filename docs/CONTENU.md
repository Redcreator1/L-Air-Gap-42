# Rédiger et mettre à jour le contenu

## Structure

`content/curriculum.json` décrit les modules et leurs leçons ; chaque leçon est un fichier Markdown dans `content/modules/<dossier du module>/`.

```json
{
  "id": "m3",
  "dir": "03-transferts",
  "title": "Module 3 · Transferts & supply chain",
  "short": "3 · Transferts",
  "tier": "pro",
  "days": "jours 15–21",
  "summary": "…",
  "lessons": [
    { "id": "sas-transfert", "file": "17-sas-transfert.md", "day": 17, "title": "Le sas de transfert : procédure, journal, double contrôle" }
  ]
}
```

- `tier` : `free`, `essentiel`, `pro` ou `elite`. Un module `free` est en clair ; les autres sont chiffrés avec la clé de leur palier.
- Une leçon d'un module payant peut être offerte individuellement avec `"free": true` (utile pour un aperçu).
- `resources` (optionnel, par leçon) : `[{ "label": "Template matrice des flux (xlsx)", "url": "https://…" }]`. Les liens vers les templates Pro/Elite se mettent ici (dossier partagé non listé).
- `minutes` (optionnel) : sinon calculé à partir du nombre de mots.

## Format d'une leçon

```markdown
---
minutes: 24
---

Introduction (2 à 4 phrases : pourquoi cette leçon compte).

## Objectifs
- …

## Concept
…

## Mise en pratique
…

## Checklist
- [ ] …

```quiz
[
  { "q": "Question ?", "choices": ["A", "B", "C", "D"], "answer": 1, "explain": "Pourquoi B." }
]
```
```

- Titres : `##` pour les sections, `###` pour les sous-sections (le `h1` est le titre de la leçon).
- Tableaux, listes, cases à cocher, citations `>`, blocs de code et **callouts** sont supportés :

```markdown
:::note À retenir
Texte du callout.
:::
```

Types de callout : `note`, `tip`, `warning` (le style est le même, le titre change).

- Le bloc ` ```quiz ` contient un tableau JSON. `answer` est l'index (0-based) de la bonne réponse. Le quiz est validé à 70 % et marque la leçon comme terminée.
- Le HTML brut n'est pas interprété (sécurité) ; le rendu se fait sans CDN, hors-ligne.

## Vérifier

```bash
npm run check
```

Signale : fichier manquant, id dupliqué, jours non croissants, quiz JSON invalide, réponse hors choix, leçon trop courte, lien cassé dans le site, et vérifie le chiffrement de bout en bout.

## Mettre à jour le contenu en production

1. Modifiez les fichiers Markdown, `npm run check`, commit sur `main`.
2. Le workflow rebuild et rechiffre : les acheteurs voient la mise à jour au prochain chargement, avec la même clé de licence.
3. Annoncez la mise à jour dans `#annonces` et dans la newsletter (« ce qui a changé »).

## Ajouter un module

1. Créez le dossier `content/modules/07-xxx/` et les leçons.
2. Ajoutez le module dans `curriculum.json` avec son `tier`.
3. Si c'est un nouveau palier, ajoutez-le dans `TIERS` de `scripts/build.mjs`, `scripts/check.mjs`, `TIER_RANK` de `site/assets/js/app.js`, et dans `checkout.tiers` de `site/config.js`. Puis générez le secret `LICENSE_KEY_<PALIER>`.

## Ajouter de la vidéo

Dans une leçon : un lien vers une vidéo non listée dans `resources`, ou un lien Markdown classique dans le corps. Pour un lecteur intégré, ajoutez le support d'un bloc `:::video URL` dans `site/assets/js/md.js` (10 lignes) : on a volontairement gardé le rendu minimal et sans iframe par défaut.
