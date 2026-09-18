---
minutes: 24
---

Un modèle de menace sans adversaires nommés est une liste de peurs. Cette leçon vous fait décrire, en termes opérationnels, **qui** pourrait vouloir franchir votre isolation, **avec quels moyens**, et **par quel pont** de la leçon 2 du briefing.

## Objectifs

- Décrire quatre profils d’adversaires avec leurs capacités et leurs contraintes.
- Associer chaque profil aux ponts qu’il est réellement capable d’utiliser.
- Éliminer de votre modèle les scénarios qui ne correspondent à aucun adversaire crédible pour vous.

## Les quatre profils

**L’opportuniste.** Automatisé ou peu motivé. Il n’a pas de cible : il a des outils. Il ne traversera jamais un air gap physique. Il reste dans votre modèle uniquement pour les équipements à double usage (leçon suivante) et les médias contaminés par hasard.

**L’initié négligent.** Le plus fréquent. Il ne veut nuire à personne. Il veut finir sa journée : il branche sa clé, il crée un partage, il note le mot de passe. Il est **la cause première** de la majorité des ponts que vous découvrirez. On ne le combat pas par la sanction mais par le processus : lui donner un chemin autorisé plus facile que le chemin interdit.

**L’initié malveillant ou contraint.** Employé, prestataire, ancien salarié. Il connaît le processus et ses trous. Il dispose d’un accès physique légitime. Contre lui, seuls fonctionnent le double contrôle, la journalisation immuable et la séparation des tâches (module 3).

**L’acteur ciblé et financé.** Il a une raison de s’intéresser à vous : concurrence, État, crime organisé avec un objectif d’extorsion à fort enjeu. Il investira dans la supply chain, dans le recrutement d’un initié ou dans une implantation longue. C’est le seul profil pour lequel les canaux cachés (module 5) méritent un budget.

## Matrice adversaire × pont

| Pont | Opportuniste | Initié négligent | Initié malveillant | Acteur ciblé |
| --- | --- | --- | --- | --- |
| Média autorisé | par hasard | **oui** | **oui** | **oui** |
| Équipement double usage | **oui** | **oui** | oui | oui |
| Connexion tierce oubliée | oui si exposée | non | oui | **oui** |
| Mise à jour amont | non | non | non | **oui** |
| Exception non révoquée | oui si exposée | **crée** | **exploite** | exploite |
| Canal caché | non | non | rarement | oui, après compromission |

Lisez cette matrice en colonne : c’est votre budget. Si vos adversaires crédibles sont les deux premiers profils, vos priorités sont médias, équipements et exceptions. Point.

:::note Le biais du spectaculaire
Les équipes surinvestissent sur la colonne de droite (elle fait de belles présentations) et sous-investissent sur les deux colonnes du milieu (elles font de vrais incidents). Corrigez ce biais explicitement dans votre modèle.
:::

## Mise en pratique

Pour votre périmètre, cochez les profils crédibles. Justifiez en une phrase chaque profil retenu et chaque profil écarté (« acteur ciblé écarté : aucun actif à valeur stratégique, secteur non régulé »). Ces phrases iront telles quelles dans votre modèle de menace de la leçon 7.

## Checklist

- [ ] Chaque profil retenu est justifié par un actif ou un contexte, pas par une intuition
- [ ] L’initié négligent est traité par un chemin autorisé plus simple, pas par une interdiction
- [ ] Les canaux cachés ne figurent que si l’acteur ciblé est crédible

```quiz
[
  {"q":"Quel profil est la cause première de la majorité des ponts non documentés ?","choices":["L’opportuniste","L’initié négligent","L’initié malveillant","L’acteur ciblé"],"answer":1,"explain":"Il ne veut pas nuire : il veut finir sa tâche. Le chemin interdit est simplement plus facile que le chemin autorisé."},
  {"q":"Pour quel profil les canaux cachés justifient-ils un budget ?","choices":["Tous","L’initié négligent","L’acteur ciblé et financé","Aucun"],"answer":2,"explain":"Les canaux cachés supposent une compromission préalable et un investissement lourd : seul un acteur ciblé les met en œuvre."}
]
```
