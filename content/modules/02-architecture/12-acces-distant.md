---
minutes: 24
---

Tôt ou tard, quelqu’un dira : « Le fabricant doit se connecter pour diagnostiquer. » C’est la demande qui a fait sauter plus d’isolations que toutes les attaques réunies. Cette leçon vous donne une réponse graduée, du refus à l’accès encadré, sans jamais transformer le périmètre en réseau connecté.

## Objectifs

- Qualifier chaque demande d’accès distant selon trois niveaux de réponse.
- Concevoir le sas d’accès distant : poste dédié, session enregistrée, présence humaine.
- Contractualiser avec les fabricants et prestataires.

## Les trois niveaux

**Niveau 0 · Pas d’accès, données exportées.** Le diagnostic se fait sur les données (journaux, configurations) exportées via le sas ou la diode vers la DMZ. Le fabricant y accède. C’est la réponse dans la majorité des cas : un bon diagnostic repose sur des données, pas sur une connexion.

**Niveau 1 · Présence physique.** Le technicien vient, avec un équipement dédié fourni par vous (jamais le sien), sous escorte, sur un poste sas. Journal, enregistrement d’écran si possible.

**Niveau 2 · Accès distant par sas.** Réservé aux cas contractuels justifiés. Architecture :

- Un **poste de rebond dans la DMZ**, dédié, durci, sans stockage persistant, réinitialisé après chaque session.
- Le prestataire s’y connecte via une session enregistrée (vidéo et frappes), avec authentification forte et **activation manuelle par un exploitant** pour une durée bornée.
- Du poste de rebond, l’accès au périmètre isolé passe par un **conduit temporaire** : câble branché physiquement par l’exploitant pour la session, débranché après. Oui, physiquement. Le journal du sas enregistre le branchement.
- L’exploitant **regarde la session** en direct. L’accès distant est un travail à deux.

Ce niveau 2 est coûteux. C’est voulu : le coût est ce qui empêche qu’il devienne le mode par défaut.

| Élément | Niveau 0 | Niveau 1 | Niveau 2 |
| --- | --- | --- | --- |
| Chemin réseau vers le périmètre | Aucun | Aucun | Temporaire, physique, supervisé |
| Équipement du prestataire | Aucun | Fourni par vous | Poste de rebond, réinitialisé |
| Journal | Sas | Sas + escorte | Enregistrement complet |
| Décision | Exploitation | Responsable périmètre | Responsable périmètre + sécurité |

## Contractualiser

Le contrat de maintenance doit dire : niveau d’accès autorisé, délai de prévenance, identification nominative des techniciens, interdiction de matériel propre, droit d’enregistrement, obligation de fournir les hachages des outils utilisés. Un fabricant qui refuse ces clauses vous dit quelque chose sur sa maturité.

:::note Le modem « de secours » du fabricant
S’il existe déjà (leçon 2 du briefing), retirez-le physiquement. Pas « désactivez » : retirez. Puis proposez le niveau 0 ou 2 en remplacement. La plupart des fabricants acceptent quand l’alternative existe.
:::

## Mise en pratique

Listez chaque contrat de maintenance touchant le périmètre. Qualifiez le niveau actuel (souvent : niveau 2 sans sas, c’est-à-dire un pont) et le niveau cible. Rédigez l’avenant type.

## Checklist

- [ ] Chaque demande d’accès reçoit d’abord la réponse niveau 0
- [ ] Aucun équipement de prestataire n’entre dans le périmètre
- [ ] Tout accès distant est activé manuellement, borné, enregistré et regardé
- [ ] Le conduit vers le périmètre est physique et temporaire

```quiz
[
  {"q":"Première réponse à une demande de diagnostic par le fabricant ?","choices":["Un VPN dédié","L’export des données de diagnostic vers la DMZ","Une visite sur site","Un refus"],"answer":1,"explain":"Le diagnostic repose sur des données ; les exporter évite tout chemin réseau."},
  {"q":"Rôle de l’exploitant pendant un accès distant de niveau 2 ?","choices":["Aucun, la session est enregistrée","Activer, borner et regarder la session en direct","Fournir les identifiants","Valider la facture"],"answer":1,"explain":"La présence humaine en direct est la mesure qui transforme l’accès en travail à deux."}
]
```
