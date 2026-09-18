---
minutes: 40
---

Dernier jour du module 1. Vous assemblez les six livrables précédents en **un document d’une page** : votre modèle de menace. Une page, parce que c’est ce que la direction lira, ce que l’auditeur demandera en premier, et ce que vous relirez avant chaque décision d’architecture.

## Objectifs

- Produire le modèle de menace en une page, au format proposé.
- Le faire relire par un pair (communauté) et intégrer deux retours.
- Le dater, le signer, le stocker au bon endroit.

## Le format en une page

**Bloc 1 · Périmètre (3 lignes).** Ce qui est isolé, pourquoi, à quel niveau réel (leçon 1). Exemple : « Réseau de supervision de l’unité 3 : 14 actifs, isolation physique en entrée, unidirectionnelle en sortie vers la DMZ. Justification : sécurité des personnes, non substituable. »

**Bloc 2 · Adversaires retenus (4 lignes).** Profils crédibles et justification, profils écartés et justification (leçon 2).

**Bloc 3 · Surfaces (tableau 9 lignes).** État F/C/O de chaque surface, avec la preuve pour F et C (leçons 4 et 5).

**Bloc 4 · Flux autorisés (référence).** Le nombre de flux et le lien vers la matrice signée (leçon 6). Pas la matrice elle-même.

**Bloc 5 · Les trois risques prioritaires (3 lignes).** Formulés comme « *adversaire* utilise *surface* pour *conséquence* ». Exemple : « Un prestataire négligent introduit par média un code malveillant qui altère un programme automate, avec arrêt de production. »

**Bloc 6 · Décisions attendues (3 lignes).** Ce que ce modèle demande à la direction : budget, arbitrage, acceptation de risque explicite.

## Relecture par les pairs

Postez votre modèle anonymisé dans le canal du module 1 (Discord) ou dans la discussion de cette leçon. Demandez explicitement deux choses aux relecteurs : *« Quel adversaire ai-je oublié ? »* et *« Quelle surface ai-je notée trop favorablement ? »* Les réponses sont presque toujours les mêmes, et presque toujours justes.

:::tip Le test de la page
Si votre modèle dépasse une page, ce n’est pas que vous avez trop de choses à dire : c’est que vous n’avez pas encore décidé ce qui compte. Coupez jusqu’à ce que chaque ligne soit une décision ou une preuve.
:::

## Livraison

- Datez et versionnez (v1.0, date du jour).
- Faites signer le responsable du périmètre.
- Stockez-le dans le référentiel documentaire de l’organisation, pas dans vos fichiers personnels.
- Planifiez sa revue : six mois, ou à chaque changement d’architecture.

## Checklist de fin de module

- [ ] Carte de périmètre (module 0) à jour
- [ ] Niveaux d’isolation qualifiés par des tests
- [ ] Adversaires retenus et écartés, justifiés
- [ ] Périmètre réduit aux actifs à forte conséquence non substituables
- [ ] Neuf surfaces évaluées avec preuves
- [ ] Registre des hypothèses avec méthodes et dates
- [ ] Matrice des flux signée
- [ ] Modèle de menace en une page, relu, signé, stocké

Vous avez fait en sept jours ce que la plupart des organisations n’ont jamais écrit. Le module 2 transforme ce modèle en architecture.

```quiz
[
  {"q":"Comment doit être formulé un risque prioritaire dans le modèle ?","choices":["Par une note de 1 à 5","« Adversaire utilise surface pour conséquence »","Par référence à une CVE","Par un coût estimé"],"answer":1,"explain":"Cette formulation relie chaque risque aux trois livrables précédents et rend la remédiation évidente."},
  {"q":"Que demander en priorité aux relecteurs ?","choices":["Une validation","L’adversaire oublié et la surface notée trop favorablement","Des corrections de forme","Une estimation de coût"],"answer":1,"explain":"Ce sont les deux biais systématiques d’un auteur sur son propre périmètre."}
]
```
