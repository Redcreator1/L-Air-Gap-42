---
minutes: 26
---

Sans Internet, pas de SIEM en nuage, pas de flux de renseignement, pas de mises à jour de règles en continu. Et pourtant, un périmètre isolé est **plus facile à surveiller** qu’un réseau d’entreprise : il est petit, stable, et tout ce qui s’y passe est censé être connu. Cette leçon organise la collecte.

## Objectifs

- Définir ce qu’on collecte, où on le stocke, et comment on le corrèle sans dépendance externe.
- Choisir entre collecte dans le périmètre et export par diode vers un SIEM d’entreprise.
- Garantir l’intégrité des journaux face à un initié.

## Que collecter

Priorité absolue aux événements qui **contredisent une hypothèse d’isolation** (module 1, leçon 5). Concrètement :

| Source | Événements | Hypothèse surveillée |
| --- | --- | --- |
| Postes et serveurs | Insertion de périphérique USB (tout type), montage de volume, changement d’interface réseau, activation radio | H2, H3, H4 |
| Switchs | Port up/down, nouvelle adresse MAC, changement de configuration | H1 |
| Diode | Compteurs émis/reçus | H8 |
| Sas (journal) | Transferts | H3 (rapprochement) |
| Annuaire local | Connexions, échecs, créations de compte, élévations | H10 |
| Automates | Téléchargement de programme, changement de mode, arrêt/démarrage | Intégrité du cœur |
| Physique | Ouverture d’armoire, badge, scellés | Accès physique |

Puis, en second, les événements système classiques (processus, services, tâches planifiées). Un périmètre isolé génère peu de bruit : vous pouvez être exhaustif.

## Où stocker

**Option A · Collecteur dans le périmètre.** Un serveur de journaux isolé, en ajout seul, avec stockage chaîné (chaque bloc contient le hachage du précédent). Consultation sur place. Avantage : aucun flux sortant. Inconvénient : l’analyste doit venir.

**Option B · Export par diode vers le SIEM d’entreprise.** Les journaux sortent en continu par la diode. Corrélation avec le reste de l’entreprise, analystes en place. Inconvénient : c’est un flux sortant (à inscrire dans la matrice) et les journaux décrivent votre périmètre : la DMZ qui les reçoit doit être protégée en conséquence.

La combinaison A + B est courante : stockage de référence dans le périmètre, copie par diode pour l’analyse.

## L’intégrité face à l’initié

Un initié qui compromet un poste peut vouloir effacer ses traces. Contre-mesures : envoi immédiat vers le collecteur (pas de tampon local long), collecteur administré par une personne différente de celles qui administrent les postes (séparation des tâches), chaînage par hachage, et **rapprochement périodique** avec des sources indépendantes (journal papier du sas, badges).

:::note Le temps
Sans serveur de temps externe, les horloges dérivent, et la corrélation devient impossible. Un serveur de temps interne au périmètre (GPS ou horloge de précision) est un prérequis. Vérifiez la dérive mensuellement.
:::

## Mise en pratique

Pour chaque hypothèse de votre registre, identifiez la source d’événements qui la surveille. Une hypothèse sans source est un angle mort : notez-la. Choisissez l’option de stockage et inscrivez le flux dans la matrice si nécessaire.

## Checklist

- [ ] Chaque hypothèse d’isolation a une source d’événements
- [ ] Collecteur en ajout seul, chaîné, administré séparément
- [ ] Temps synchronisé sur une source interne, dérive vérifiée
- [ ] Flux d’export inscrit dans la matrice si option B

## Le cas SITE 42

Ce que SITE 42 pourrait collecter, et ce qu’il collecte vraiment.

```
SITE 42 - sources de journaux en zone isolee

source              volume/jour  collecte ?  conservation
------------------  -----------  ----------  ------------
plc-*               faible       non         -
hmi-salle-01        moyen        oui         30 jours
scada-serveur-01    moyen        oui         30 jours
fw-dmz-01           eleve        oui         90 jours
relais-fichiers-01  faible       non         -
```

```epreuve
{
  "enonce": "Deux sources ne sont pas collectées. Une seule verrait passer tout ce qui franchit l'isolation par fichiers. Donnez son nom.",
  "reponse": "relais-fichiers-01",
  "indice": "Par où entrent les fichiers, d'après le module 3 ?"
}
```
