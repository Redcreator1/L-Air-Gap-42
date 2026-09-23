---
minutes: 40
---

Fin du module 5. Vous produisez le **plan de durcissement priorisé** : ce que vous durcissez, dans quel ordre, à quel coût, pour couvrir quel risque. Un plan qui tient sur deux pages et que la direction peut arbitrer.

## Objectifs

- Lister les mesures de durcissement issues du module avec effort, risque couvert et prérequis.
- Prioriser par un score simple et défendable.
- Produire deux pages : le plan et sa justification.

## Inventaire des mesures

Reprenez les checklists des leçons 29 à 34 et vos observations. Chaque case non cochée est une mesure candidate. Complétez le tableau :

| Mesure | Leçon | Effort (j/h) | Coût matériel | Risque couvert (modèle) | Prérequis | Score |
| --- | --- | --- | --- | --- | --- | --- |
| Allowlisting bloquant sur postes d’ingénierie | 32 | 10 | 0 | Média piégé, mise à jour compromise | Baseline processus | 9 |
| Verrouillage firmware des postes | 31 | 5 | 0 | Persistance profonde | Coffre de mots de passe | 7 |
| Casiers et zone de contrôle | 30 | 2 | faible | Canaux cachés (si retenu) | Décision modèle | 6 ou 2 |
| Serrures et détection d’ouverture des baies | 34 | 3 | moyen | Accès physique | Collecteur | 7 |
| Cérémonie de sauvegarde de la racine | 33 | 2 | 0 | Perte de la confiance interne | — | 8 |

## Le score

Score = (gravité du risque couvert, 1–3) × (fréquence ou crédibilité, 1–3) − (effort, 0–2). Simple, transparent, discutable. L’objectif n’est pas la précision : c’est que deux personnes arrivent au même ordre et puissent l’expliquer à une troisième.

Deux règles d’ajustement : une mesure **prérequise** par d’autres remonte ; une mesure liée à un risque **non retenu** dans le modèle descend, quelle que soit sa popularité.

## Les deux pages

**Page 1 · Le plan.** Le tableau trié par score, découpé en trois vagues : 30 jours (effort faible, score élevé), 90 jours, 12 mois. Pour chaque vague : effort total, coût total, propriétaire.

**Page 2 · La justification.** Pour chaque mesure de la vague 30 jours, trois lignes : le risque (formulation du modèle de menace), ce que la mesure change, ce qui se passe si on ne la fait pas. Pour les mesures écartées ou repoussées à 12 mois : une ligne d’explication. La direction lit la page 2 pour comprendre la page 1.

:::tip La mesure qui rapporte le plus
La mesure au meilleur rapport est presque toujours l’allowlisting sur les postes d’ingénierie. Elle coûte du temps, pas d’argent, et elle neutralise les deux risques les plus fréquents. Si elle n’est pas en vague 30 jours, vérifiez votre score.
:::

## Relecture

Postez la page 1 anonymisée dans le canal du module 5. Question : « Quelle mesure ai-je surestimée, laquelle ai-je oubliée ? » Les retours sur les plans de durcissement sont parmi les plus riches de la communauté, parce que tout le monde a déjà fait les mêmes arbitrages.

## Checklist de fin de module

- [ ] Canaux cachés : décision écrite, contre-mesures proportionnées si retenu
- [ ] Firmware verrouillé, empreintes de référence, programmes automates vérifiés
- [ ] Allowlisting en cours, surface réduite, configuration de référence
- [ ] Clés inventoriées, racine sous scellé, cérémonies écrites
- [ ] Zones physiques cohérentes, tour de salle mensuel
- [ ] Plan de durcissement en deux pages, priorisé, relu

Le module 6 vous fait prouver tout cela à ceux qui vous le demanderont : régulateurs, auditeurs, direction.

## Le cas SITE 42

Le plan de durcissement proposé pour SITE 42, tel qu’il remonterait à la direction.

```
SITE 42 - plan de durcissement (proposition)

rang  code  action                          cout        couvre
----  ----  ------------------------------  ----------  --------------
1     a1    cage de Faraday sur la salle    tres eleve  k1
2     a2    perimetre d exclusion de 20 m   faible      k1, k2, k3
3     a3    liste blanche sur scada         faible      execution
4     a4    secure boot sur hist-donnees    faible      firmware
5     a5    rotation de x3 et passage hsm   moyen       secret en clair
```

```epreuve
{
  "enonce": "Ce plan est priorisé à l'envers. Une action couvre trois familles de canaux pour un coût faible : c'est elle qui devrait occuper le rang 1. Donnez son code.",
  "reponse": "a2",
  "indice": "Classez par rapport entre ce qui est couvert et ce qui est dépensé."
}
```
