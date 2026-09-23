---
minutes: 30
---

Auditer un air gap, le vôtre ou celui d’un client, c’est répondre à une question : *l’isolation affirmée est-elle réelle, surveillée et tenable ?* Cette leçon donne la méthode en six étapes, avec les preuves à collecter, les tests à réaliser et le format de restitution. Elle sert aussi bien pour un audit interne, une mission de conseil ou une préparation à un audit réglementaire.

## Objectifs

- Conduire un audit d’isolation en six étapes, en deux à cinq jours selon la taille.
- Distinguer les trois types de preuves : documentaire, observationnelle, testée.
- Restituer avec un score d’isolation et des constats actionnables.

## Les trois types de preuves

- **Documentaire** : ce que l’organisation dit (schéma, matrice, politique, journal). Nécessaire, jamais suffisante.
- **Observationnelle** : ce que l’auditeur constate (baie ouverte, câble non répertorié, scellé rompu, tableau d’inventaire). Le cœur de l’audit d’isolation.
- **Testée** : ce que l’auditeur provoque (test de fuite, insertion d’un média de test au sas, tentative d’accès distant). Avec autorisation écrite, périmètre et fenêtre définis.

Un constat s’appuie sur au moins deux types de preuves. « Le schéma dit qu’il n’y a pas de radio » (documentaire) + « le balayage n’en a pas détecté » (testée) = isolation radio établie à cette date.

## Les six étapes

**1. Cadrage (½ jour).** Périmètre audité, cadre de référence (interne, IEC 62443, réglementaire), autorisations de test, interlocuteurs, calendrier. Collecte du dossier documentaire : modèle de menace, schéma, matrice, registre, runbook, plan de détection, plan de durcissement. Un dossier absent est déjà un constat.

**2. Revue documentaire (½ à 1 jour).** Cohérence entre les documents : chaque flux de la matrice a-t-il un conduit sur le schéma ? Chaque hypothèse a-t-elle une preuve datée ? Le runbook correspond-il à la matrice ? Chaque incohérence est une question pour l’étape suivante.

**3. Observation sur site (1 à 2 jours).** Le tour de salle de l’auditeur : suivi des câbles, inspection des baies, ports et scellés, inventaire des interfaces (module 0), observation d’un transfert réel au sas, entretiens avec les exploitants (« la dernière fois que quelque chose est entré, comment ? »), vérification des configurations firmware sur un échantillon.

**4. Tests (½ à 1 jour).** Test de fuite depuis le périmètre, balayage radio, tentative d’insertion d’un média non dédié (avec un exploitant complice pour observer la réaction du processus), vérification du taux de conformité sas / journaux des postes, rapprochement physique / logique sur une semaine de journaux.

**5. Analyse et scoring (½ jour).** Chaque constat : description, preuves, hypothèse d’isolation concernée, gravité (pont avéré / pont potentiel / faiblesse de processus / défaut documentaire), recommandation. Score d’isolation sur 100 : voir ci-dessous.

**6. Restitution (½ jour).** Réunion avec le responsable du périmètre et la direction. Rapport en trois niveaux : une page de synthèse avec le score et les trois constats majeurs, dix pages de constats, annexes de preuves.

## Le score d’isolation

| Domaine | Points | Ce qui les fait perdre |
| --- | --- | --- |
| Périmètre et modèle de menace | 15 | Pas de modèle, périmètre non justifié, hypothèses sans preuve |
| Architecture (zones, conduits, DMZ, diodes) | 20 | Conduit non documenté, DMZ relais, diode logique présentée comme physique |
| Transferts (médias, sas, origine, quarantaine) | 25 | Média non dédié, sas contourné, pas de vérification d’origine, pas de quarantaine |
| Détection (télémétrie, baselines, campagnes) | 20 | Pas de baseline, hypothèses non surveillées, taux de conformité inconnu |
| Durcissement et physique | 10 | Firmware non verrouillé, baies ouvertes, pas d’allowlisting |
| Gouvernance (revues, exercices, plan) | 10 | Pas de revue, pas d’exercice, plan sans propriétaire |

Un pont avéré (chemin réel vers l’extérieur, ou média non contrôlé en usage courant) plafonne le score à 50, quel que soit le reste : un air gap avec un pont n’est pas un air gap.

:::tip L’audit comme service
Cette méthode, avec le kit du palier Elite (modèles de rapport, grilles de constats, lettre d’autorisation de test), est directement facturable : un audit d’isolation de trois à cinq jours est une mission à forte valeur, parce que peu de prestataires savent la mener au-delà du scan réseau.
:::

## Mise en pratique

Auditez votre propre périmètre avec cette méthode, en vous forçant à l’observation et aux tests. Calculez le score. C’est le point de départ de votre plan 90 jours (leçon 40).

## Checklist

- [ ] Chaque constat appuyé sur deux types de preuves
- [ ] Six étapes réalisées, tests avec autorisation écrite
- [ ] Score calculé, plafond appliqué si pont avéré
- [ ] Rapport en trois niveaux

## Le cas SITE 42

L’audit de SITE 42 conduit selon la méthode en six étapes, avec ses résultats.

```
SITE 42 - audit en six etapes

code  ce qui est verifie             resultat
----  -----------------------------  -------------------------
a1    perimetre et inventaire        conforme
a2    matrice des flux a jour        conforme depuis revision 5
a3    preuves d isolation datees     h3 toujours sans preuve
a4    transferts journalises         conforme
a5    detection effective            s4 sans lecteur
a6    tenabilite dans la duree       non evaluee
```

```epreuve
{
  "enonce": "L'audit répond à une question : l'isolation affirmée est-elle réelle, surveillée et tenable ? Une étape n'a tout simplement pas été conduite. Donnez son code.",
  "reponse": "a6",
  "indice": "Deux étapes remontent un défaut ; une seule n'a pas eu lieu."
}
```
