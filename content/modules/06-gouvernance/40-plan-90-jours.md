---
minutes: 28
---

Tout ce que vous avez produit converge ici : le **plan de remédiation 90 jours**. Trois vagues de 30 jours, chacune avec un objectif mesurable, des actions avec propriétaire, et un indicateur qui dit à la direction si on avance.

## Objectifs

- Consolider les écarts (M2), les actions d’exercice (M4), le plan de durcissement (M5) et les constats d’audit (M6) en un seul plan.
- Découper en trois vagues avec un critère de succès chacune.
- Instituer le suivi : revue hebdomadaire, indicateur mensuel, rapport de fin.

## Consolidation

Réunissez toutes les actions identifiées pendant le programme dans un seul tableau. Dédoublonnez. Pour chaque action : source (écart, exercice, durcissement, audit), risque couvert, effort, coût, propriétaire, prérequis, vague.

Typiquement, vous obtenez 25 à 50 actions. C’est trop pour 90 jours. Le plan 90 jours en prend 10 à 15 ; le reste va dans un plan 12 mois.

## Les trois vagues

**Vague 1 (jours 1–30) · Fermer les ponts.** Objectif : plus aucun pont avéré. Actions typiques : retrait du modem, suppression du partage, médias dédiés et ports scellés, sas opérationnel avec journal, freeze des exceptions sans propriétaire. Critère de succès : score d’isolation déplafonné, taux de conformité sas mesuré.

**Vague 2 (jours 31–60) · Voir.** Objectif : chaque hypothèse d’isolation a une détection. Actions : collecteur et temps, cinq baselines, première campagne radio et test de fuite, allowlisting en mode audit. Critère : plan de détection sans angle mort implicite, première preuve négative datée pour chaque hypothèse majeure.

**Vague 3 (jours 61–90) · Tenir.** Objectif : le processus survit à son auteur. Actions : allowlisting bloquant sur les postes d’ingénierie, firmware verrouillé, revue trimestrielle des comptes exécutée, exercice sur table réalisé, rapport de direction avec décisions signées, mini-déclaration d’applicabilité. Critère : score d’isolation ≥ 80, décisions de la direction obtenues, prochain cycle planifié.

| Vague | Objectif | Indicateur | Cible |
| --- | --- | --- | --- |
| 1 | Fermer les ponts | Ponts avérés ouverts | 0 |
| 1 | Contrôler les médias | Taux de conformité sas | mesuré, > 90 % |
| 2 | Voir | Hypothèses avec détection | 100 % (ou angle mort écrit) |
| 2 | Prouver | Preuves négatives datées | ≥ 1 par hypothèse majeure |
| 3 | Tenir | Score d’isolation | ≥ 80 |
| 3 | Décider | Décisions direction signées | toutes |

## Le suivi

- **Hebdomadaire** (30 min) : le responsable du périmètre et les propriétaires d’actions. Avancement, blocages, arbitrages. Le tableau est mis à jour en séance.
- **Mensuel** : un indicateur par vague à la direction, en une ligne. Pas de rapport, une ligne.
- **Jour 90** : rapport de fin (leçon 39, actualisé), score d’isolation recalculé (leçon 38), plan 12 mois présenté.

:::warning Le plan de 40 actions
Si votre plan 90 jours dépasse quinze actions, il n’aboutira pas, et l’échec discréditera la démarche. Coupez. Ce qui ne rentre pas va dans le plan 12 mois, avec une date. Un plan tenu à 12 actions vaut plus qu’un plan ambitieux à 40 abandonné au jour 45.
:::

## Mise en pratique

Rédigez le plan. Faites-le valider par le responsable du périmètre et le responsable sécurité. Planifiez la première revue hebdomadaire. Pour le palier Elite : soumettez-le à la revue par un architecte senior, prévue dans votre offre.

## Checklist

- [ ] Toutes les actions du programme consolidées et dédoublonnées
- [ ] 10 à 15 actions en 90 jours, le reste daté à 12 mois
- [ ] Trois vagues avec objectif, indicateur et cible
- [ ] Suivi hebdomadaire et indicateur mensuel institués

```quiz
[
  {"q":"Objectif de la vague 1 ?","choices":["Déployer le SIEM","Fermer tous les ponts avérés et contrôler les médias","Obtenir le budget","Rédiger les politiques"],"answer":1,"explain":"Tant qu’un pont existe, le reste est secondaire ; la vague 1 déplafonne le score."},
  {"q":"Nombre d’actions raisonnable pour un plan 90 jours ?","choices":["5","10 à 15","25 à 50","Autant que nécessaire"],"answer":1,"explain":"Au-delà, le plan n’aboutit pas ; le reste va dans un plan 12 mois daté."}
]
```
