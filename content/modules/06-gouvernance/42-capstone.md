---
minutes: 60
---

Jour 42. Vous assemblez l’ensemble en un **dossier d’architecture complet** : le document unique qui décrit, justifie, prouve et planifie l’isolation de votre périmètre. C’est le livrable que vous présenterez à un auditeur, à un régulateur, à un nouvel arrivant, ou à un client si vous êtes consultant.

## Objectifs

- Assembler les livrables des six modules dans une structure de dossier normalisée.
- Vérifier la cohérence interne du dossier avec la grille fournie.
- Le faire relire par la communauté et, pour le palier Elite, par un architecte senior.

## Structure du dossier

**0. Synthèse (1 page).** Le rapport à la direction (leçon 39), actualisé. Score d’isolation, trois risques, décisions obtenues, plan.

**1. Périmètre et modèle de menace.** Carte de périmètre (M0), niveaux d’isolation qualifiés, adversaires, actifs et périmètre minimal, neuf surfaces, registre des hypothèses, modèle en une page (M1).

**2. Architecture.** Zones et conduits, positionnement Purdue, DMZ, diodes et compteurs, accès distant gradué, identité hors-ligne, schéma cible avec absences prouvées, tableau des écarts (M2).

**3. Transferts et supply chain.** Politique de médias, kiosque et limites, procédures du sas, registre des sources de référence, politique de mise à jour et quarantaine, supply chain matérielle, runbook (M3).

**4. Détection et réponse.** Architecture de collecte, baselines, campagnes, chasses et preuves négatives, playbook avec notification, compte rendu d’exercice, plan de détection (M4).

**5. Durcissement.** Décision canaux cachés et contre-mesures, firmware, système, clés, physique, plan de durcissement (M5).

**6. Gouvernance.** Cadres applicables, correspondance normes, mini-déclaration d’applicabilité, rapport d’audit et score, plan 90 jours et 12 mois, compte rendu red/blue (M6).

**Annexes.** Matrice des flux signée, journaux types, contrats et avenants, fiches de réception, procès-verbaux de cérémonies.

## La grille de cohérence

Avant de livrer, vérifiez ces croisements. Chaque « non » est une incohérence que l’auditeur trouvera :

| Vérification | Oui / Non |
| --- | --- |
| Chaque flux de la matrice emprunte exactement un conduit du schéma | |
| Chaque conduit du schéma a ses exigences dans le tableau des conduits | |
| Chaque hypothèse du registre a une preuve datée ou un angle mort écrit | |
| Chaque hypothèse a une source de détection dans le plan de détection | |
| Chaque risque prioritaire du modèle a une hypothèse de chasse | |
| Chaque adversaire retenu a au moins un contrôle qui le vise | |
| Chaque action du plan 90 jours renvoie à un écart, un constat ou un « passe » | |
| Chaque « passe » du red/blue a une action ou une acceptation | |
| Chaque exception a un propriétaire en poste et une date de fin | |
| Le vocabulaire (isolé, cloisonné, unidirectionnel) est cohérent dans tous les documents | |
| La synthèse ne contient aucune affirmation absente du corps du dossier | |

## Relecture et certification

- Postez la synthèse et la grille de cohérence remplie dans le canal capstone. Deux pairs relisent : « Quelle incohérence n’ai-je pas vue ? »
- Palier Elite : soumettez le dossier complet à la revue par un architecte senior, prévue dans votre offre. Vous recevrez un retour écrit sous deux semaines.
- Validez ce quiz : votre certificat de programme est disponible dans l’espace membre.

## Et après

Un dossier d’architecture vit. Planifiez : revue semestrielle du modèle de menace, campagnes de détection selon le calendrier, exercice annuel, audit annuel avec score. Les mises à jour trimestrielles du programme vous apporteront les nouvelles menaces et évolutions réglementaires ; la communauté, les retours d’expérience.

:::note Ce que vous avez maintenant
Il y a 42 jours, vous aviez une intention d’isolation. Vous avez aujourd’hui un périmètre justifié, une architecture prouvée, un processus de transfert tenu, une détection alignée sur vos hypothèses, un durcissement priorisé, et un dossier qui parle la langue de ceux qui vous demanderont des comptes. Ce n’est pas la fin de l’isolation. C’est le début de sa preuve.
:::

## Checklist finale

- [ ] Dossier assemblé selon la structure en sept parties
- [ ] Grille de cohérence remplie, tout à « oui » ou justifié
- [ ] Relu par deux pairs ; revue senior demandée (Elite)
- [ ] Cycle de vie du dossier planifié : revues, campagnes, exercice, audit

## Le cas SITE 42

Le sommaire du dossier d’architecture de SITE 42, au terme des 42 jours.

```
SITE 42 - dossier d architecture, sommaire

code  piece                        etat
----  ---------------------------  ---------------------------
j1    modele de menace             a jour, h3 desormais prouvee
j2    schema d architecture cible  a jour, d5 corrige
j3    runbook de transfert         a jour, etape ajoutee en e6
j4    plan de detection            a jour, s4 attribue
j5    plan de durcissement         a jour, a2 passe au rang 1
j6    plan 90 jours                a jour, v4 attribue
j7    preuve de tenabilite         manquante
```

```epreuve
{
  "enonce": "Le dossier est complet à une pièce près, et c'est exactement celle que l'audit avait signalée comme non évaluée. Donnez son code.",
  "reponse": "j7",
  "indice": "Un air gap ne se conçoit pas une fois : il se prouve, périodiquement."
}
```
