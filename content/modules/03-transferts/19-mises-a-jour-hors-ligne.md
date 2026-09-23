---
minutes: 26
---

Ne pas mettre à jour un périmètre isolé est une décision, pas une fatalité. Mais mettre à jour sans processus, c’est importer la supply chain sans filtre. Cette leçon organise le cycle : veille, quarantaine, dépôt miroir, fenêtre de patch, retour arrière.

## Objectifs

- Décider une politique de mise à jour par catégorie d’actif, explicite et défendable.
- Mettre en place la quarantaine et le dépôt miroir hors-ligne.
- Planifier les fenêtres de patch avec retour arrière prouvé.

## La décision par catégorie

| Catégorie | Politique typique | Justification |
| --- | --- | --- |
| Automates, SIS | Mise à jour sur vulnérabilité exploitable dans le contexte, ou fin de support, après qualification fournisseur | La disponibilité et la sûreté priment ; l’exposition est minimale |
| Postes d’ingénierie, serveurs | Cycle régulier (trimestriel), correctifs critiques accélérés | Ils manipulent les médias entrants : exposition maximale du périmètre |
| Kiosque, sas, postes de vérification | Signatures quotidiennes, système mensuel | Ils sont en première ligne |
| Équipements réseau, diodes | Sur avis fournisseur, après quarantaine | Peu exposés, mais critiques |

Écrivez cette politique. « On ne met pas à jour » sans ce tableau est une non-décision ; avec ce tableau, c’est un choix argumenté que l’audit acceptera.

## La quarantaine

Entre la publication d’une mise à jour et son déploiement dans le périmètre, imposez un **délai minimal** (typiquement 14 à 30 jours pour les mises à jour non urgentes). Pendant ce délai : veille sur les retours de la communauté et de l’éditeur (retraits, incidents), test sur un environnement de pré-production isolé si vous en avez un. Le cas 4 du briefing (mise à jour amont compromise) a été détecté publiquement en quelques jours à quelques semaines : la quarantaine est votre détection différée.

Exception : une vulnérabilité **activement exploitée et atteignable dans votre contexte** (ce qui, en isolation, est rare) raccourcit la quarantaine, sur décision documentée.

## Le dépôt miroir

Un serveur dans le périmètre (ou dans la DMZ, côté entrant, avec sas vers le périmètre) qui contient les paquets vérifiés et mis en quarantaine. Les actifs s’y approvisionnent, sans jamais voir l’extérieur. Il est alimenté par le sas, en lots, avec journal. Chaque lot a un hachage global consigné : c’est le lien entre le journal du sas et l’état du dépôt.

## La fenêtre de patch

- Sauvegarde préalable **testée** (une restauration à blanc dans les 30 jours précédents).
- Ordre de déploiement : pré-production, puis actifs les moins critiques, puis cœur.
- Critère de succès défini avant (pas « ça marche » mais « ces trois fonctions vérifiées »).
- **Retour arrière** documenté et chronométré. Un retour arrière jamais testé n’existe pas.
- Journal : version avant, version après, hachage, opérateur, résultat.

:::note La mise à jour de firmware
Le firmware d’un automate ou d’un équipement réseau est le niveau le plus profond et le plus difficile à vérifier. Exigez du fabricant hachages et signatures, appliquez la quarantaine la plus longue, et conservez la version précédente sous scellé. Le module 5 revient sur le firmware.
:::

## Mise en pratique

Rédigez votre politique par catégorie. Définissez la durée de quarantaine. Planifiez une restauration à blanc ce mois-ci : c’est la partie que personne ne fait et qui sauve tout.

## Checklist

- [ ] Politique de mise à jour écrite par catégorie
- [ ] Quarantaine avec durée et critère de raccourcissement
- [ ] Dépôt miroir alimenté par le sas, avec hachage par lot
- [ ] Retour arrière testé à blanc dans les 30 jours

## Le cas SITE 42

Le cycle de mise à jour hors ligne de SITE 42, étape par étape, avec sa dernière exécution.

```
SITE 42 - cycle de mise a jour hors ligne

code  action                                 derniere execution
----  -------------------------------------  ------------------
e1    veille editeur et bulletins            01/09
e2    telechargement sur poste dedie         02/09
e3    verification de signature hors de e2   jamais
e4    depot au kiosque                       02/09
e5    fenetre de patch, essai sur banc       05/09
```

```epreuve
{
  "enonce": "Télécharger un fichier et le vérifier sur la même machine valide la compromission au lieu de la détecter. Donnez le code de l'étape qui n'a jamais été exécutée.",
  "reponse": "e3",
  "indice": "Une seule ligne porte « jamais »."
}
```
