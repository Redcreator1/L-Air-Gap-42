---
minutes: 28
---

Un incident dans un périmètre isolé a deux particularités : l’aide extérieure ne peut pas se connecter, et le premier réflexe (« isoler ») n’a pas de sens puisque tout est déjà isolé. Cette leçon écrit le playbook de réponse adapté : contenir sans couper la production, investiguer sans outil en ligne, restaurer sans réimporter le problème.

## Objectifs

- Écrire un playbook en six phases adapté au hors-ligne.
- Préparer la boîte à outils d’investigation, importée à l’avance par le sas.
- Définir les critères de décision sur la production et sur l’escalade.

## Les six phases

**1. Détection et qualification (< 1 h).** D’où vient le signal (alerte, chasse, découverte de pont, kiosque positif, exploitant) ? Est-ce un incident de sécurité ou un défaut d’exploitation ? Critère : une hypothèse d’isolation est-elle potentiellement violée ? Si oui, incident.

**2. Confinement adapté.** Ne pas éteindre un automate en production sans le responsable du procédé. Options graduées : geler les transferts au sas (aucun média n’entre ni ne sort), isoler le poste suspect du réseau interne (le retirer du switch, pas l’éteindre : la mémoire est une preuve), interdire tout accès distant, sceller les armoires concernées.

**3. Collecte de preuves.** Avec les outils importés à l’avance (voir plus bas) : image mémoire, image disque, export des journaux du collecteur, journal du sas, photos. Les preuves sortent du périmètre par le sas sortant, avec hachage consigné, vers un poste d’analyse dédié en DMZ ou hors ligne.

**4. Investigation.** Sur le poste d’analyse. Questions dans l’ordre : par quel pont ? depuis quand ? quels actifs touchés ? le cœur (automates) est-il concerné ? y a-t-il eu sortie de données ? Le module 4 vous a donné les baselines qui rendent ces questions tractables.

**5. Éradication et restauration.** Réinstallation depuis l’image maîtresse (jamais nettoyage), restauration des données depuis une sauvegarde **antérieure à l’entrée** identifiée, vérification des programmes automates contre les versions de référence (hachages), rotation des secrets. Fermeture du pont identifié, mise à jour du schéma.

**6. Retour d’expérience.** Sous deux semaines : chronologie, pont utilisé, hypothèse violée, ce qui a détecté, ce qui aurait dû détecter plus tôt, décisions. Mise à jour du modèle de menace, du registre, des baselines. Partage anonymisé avec la communauté.

## La boîte à outils hors-ligne

Préparée **avant** l’incident, importée par le sas, vérifiée, stockée sous scellé au sas : outils d’acquisition mémoire et disque, utilitaires d’analyse de journaux, hachages de référence de tous les exécutables et programmes automates du périmètre, images maîtresses, procédure d’escalade avec numéros. Renouvelée à chaque fenêtre de patch.

| Décision | Qui | Critère |
| --- | --- | --- |
| Geler le sas | Exploitation | Immédiat, dès la qualification |
| Retirer un poste du réseau | Exploitation + responsable procédé | Poste suspect, hors cœur |
| Arrêter un automate | Responsable procédé seul | Sûreté ou intégrité du programme non vérifiable |
| Escalader (direction, autorités) | Responsable sécurité | Cœur touché, sortie de données, obligation réglementaire (module 6) |
| Déclarer l’incident clos | Responsable sécurité + périmètre | Pont fermé, restauration vérifiée, RETEX rédigé |

:::warning Réimporter le problème
Le risque principal de la phase 5 : restaurer une sauvegarde qui contient déjà l’intrusion, ou réimporter par le sas la mise à jour qui l’a introduite. D’où la nécessité de dater l’entrée avant de restaurer, et de conserver plusieurs générations de sauvegardes.
:::

## Mise en pratique

Rédigez le playbook en six pages. Constituez la boîte à outils et importez-la. Fixez la matrice de décision avec le responsable du procédé : c’est la conversation la plus importante de ce module.

## Checklist

- [ ] Playbook en six phases avec critères de décision
- [ ] Boîte à outils importée, scellée, renouvelée
- [ ] Matrice de décision validée avec le responsable du procédé
- [ ] Plusieurs générations de sauvegardes, hachages de référence disponibles

## Le cas SITE 42

Les premières actions du playbook de SITE 42, telles qu’elles ont été copiées du monde connecté.

```
SITE 42 - playbook, premieres actions

code  action                                pertinente ici ?
----  ------------------------------------  ----------------------
p1    isoler la machine du reseau           deja isolee, sans effet
p2    figer l etat : memoire, journaux      oui
p3    appeler le prestataire pour qu il se  impossible, pas de lien
      connecte
p4    basculer la conduite en mode manuel   oui, procedure existante
p5    conserver le media sous scelle        oui
```

```epreuve
{
  "enonce": "Deux actions sont des réflexes importés du monde connecté. L'une suppose une aide extérieure qui ne pourra jamais arriver. Donnez son code.",
  "reponse": "p3",
  "indice": "L'autre est simplement sans effet ; celle-ci est impossible."
}
```
