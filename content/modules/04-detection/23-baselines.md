---
minutes: 24
---

Détecter l’anormal suppose de connaître le normal. Dans un périmètre isolé, le normal est **petit et stable** : c’est un avantage immense qu’on gaspille si on n’en fait pas une référence explicite. Cette leçon construit vos baselines.

## Objectifs

- Établir cinq baselines : inventaire, réseau, processus, périphériques, comportement humain.
- Mettre en place la comparaison périodique et l’alerte sur écart.
- Gérer le changement légitime sans noyer l’alerte.

## Cinq baselines

**Inventaire.** Liste des actifs, versions de système et de firmware, interfaces, hachage des exécutables critiques. Comparaison mensuelle. Tout écart non lié à une fenêtre de patch documentée est une alerte.

**Réseau.** Table des adresses MAC par port de switch, matrice des conversations observées (qui parle à qui, sur quel port). Dans un périmètre isolé, cette matrice se stabilise en quelques jours et **ne devrait plus changer**. Une nouvelle conversation est une alerte. Une nouvelle MAC est un incident jusqu’à preuve du contraire.

**Processus et services.** Liste des processus attendus par poste, services, tâches planifiées, pilotes. Un nouveau processus persistant est une alerte.

**Périphériques.** Historique des identifiants de périphériques USB vus par poste. Un identifiant inconnu (hors parc de médias dédiés) est un incident.

**Comportement humain.** Heures et jours de connexion par compte, postes utilisés, fréquence des transferts au sas par personne. Utile contre l’initié malveillant, à manier avec transparence vis-à-vis du personnel et en conformité avec le droit du travail.

| Baseline | Fréquence de comparaison | Écart = |
| --- | --- | --- |
| Inventaire | Mensuelle | Alerte |
| Réseau | Continue (switch) ou quotidienne | Nouvelle MAC : incident ; nouvelle conversation : alerte |
| Processus | Quotidienne | Alerte |
| Périphériques | Continue | Identifiant inconnu : incident |
| Humain | Hebdomadaire | Revue, pas d’alerte automatique |

## Le changement légitime

Une baseline devient inutile si chaque changement légitime déclenche une alerte que personne ne traite. Règle : **tout changement est annoncé avant d’avoir lieu** (fenêtre de patch, intervention, ajout d’actif), et l’annonce met à jour la baseline *à la date prévue*. Une alerte qui coïncide avec une annonce est fermée en une minute. Une alerte sans annonce est traitée. C’est aussi ce qui fait de la gestion des changements un outil de détection.

:::tip La première baseline
Lors de la toute première capture, vous trouverez des choses inattendues : un processus oublié, une MAC inconnue, un compte de test. Ne les intégrez pas à la baseline « parce qu’ils étaient là ». Chaque élément inexpliqué est traité comme un incident avant d’être accepté ou supprimé. La première baseline est un audit.
:::

## Mise en pratique

Capturez la baseline réseau (MAC par port) et périphériques cette semaine. Expliquez chaque ligne. Mettez en place la comparaison quotidienne, même par un script simple qui compare deux fichiers.

## Checklist

- [ ] Cinq baselines capturées et chaque ligne expliquée
- [ ] Comparaison périodique automatisée pour inventaire, réseau, processus, périphériques
- [ ] Changements annoncés avant exécution, baseline mise à jour à date
- [ ] Baseline humaine traitée en revue, avec transparence

## Le cas SITE 42

La référence de comportement normal de SITE 42, confrontée à la mesure du 14/09.

```
SITE 42 - reference contre mesure du 14/09

observation                     reference  mesure
------------------------------  ---------  ------
processus en execution          38         38
connexions sortantes par heure  0          3
comptes ouverts simultanement   2          2
cles usb montees par semaine    1          1
```

```epreuve
{
  "enonce": "Dans un périmètre isolé, le normal est petit et stable : c'est ce qui rend l'anormal visible. Une seule mesure s'écarte. Donnez l'intitulé de l'observation, tel qu'il figure à gauche.",
  "reponse": "connexions sortantes par heure",
  "indice": "Quatre lignes, une seule différence entre les deux colonnes."
}
```
