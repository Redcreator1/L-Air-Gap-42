---
minutes: 26
---

Vérifier l’origine d’un fichier, c’est répondre à : « Est-ce bien ce que l’éditeur a publié ? » Cette leçon vous donne les outils : hachages, signatures, et la notion de source de référence, sans laquelle tout le reste est théâtre.

## Objectifs

- Distinguer hachage, signature et source de référence, et savoir lequel prouve quoi.
- Mettre en place la vérification d’origine au sas pour les cas courants.
- Comprendre pourquoi la transparence (journaux publics) complète la signature.

## Trois notions

**Hachage.** Une empreinte du contenu. Il prouve que *ce fichier* est identique à *celui dont on a le hachage*. Il ne prouve rien sur l’origine si le hachage vient du même endroit que le fichier. Un hachage n’a de valeur que confronté à une **source de référence indépendante** : page de l’éditeur consultée depuis un autre poste, courrier signé du fabricant, hachage publié dans un bulletin.

**Signature.** L’éditeur signe le fichier avec sa clé privée ; vous vérifiez avec sa clé publique. Elle prouve que le fichier vient du détenteur de la clé, et n’a pas été modifié depuis. Elle ne prouve pas que le détenteur n’a pas été compromis (leçon 2 du briefing, cas 4). Il faut aussi que la clé publique soit **arrivée par un canal sûr** : une clé téléchargée avec le fichier n’a aucune valeur.

**Source de référence.** Un canal que vous considérez de confiance, distinct de celui par lequel arrive le fichier. Sa gestion est le cœur de la vérification d’origine : quelles sources, comment consultées, par qui, avec quelles clés publiques enregistrées.

| Vous avez | Vous prouvez | Vous ne prouvez pas |
| --- | --- | --- |
| Hachage seul | Intégrité depuis la copie | Origine |
| Hachage + source de référence | Intégrité et correspondance à la publication | Que la publication est saine |
| Signature + clé publique de confiance | Origine et intégrité | Que l’éditeur n’est pas compromis |
| Signature + transparence | Que la version est celle vue par tous | Sanité |

## Au sas, concrètement

- Un **registre des sources de référence** : par éditeur, l’URL de publication, la clé publique (empreinte), la méthode de consultation (poste de l’extérieur dédié, jamais le poste qui a téléchargé le fichier).
- Un **poste de vérification** au sas, hors périmètre, avec les outils : calcul de hachages, vérification de signatures (formats courants : signatures d’exécutables, signatures détachées, paquets signés).
- La **règle** : le hachage attendu est noté dans le journal *avant* le calcul sur le fichier reçu. On compare, on ne recopie pas.

## Transparence

Certains écosystèmes publient chaque version dans un journal public en ajout seul. La vérification consiste alors à constater que la version reçue figure dans le journal, donc a été vue par tout le monde : un éditeur compromis qui distribuerait une version ciblée à vous seul serait détecté. C’est une protection partielle contre le cas 4, et elle s’applique de plus en plus aux logiciels et conteneurs.

:::warning La signature qui rassure trop
Une signature valide est nécessaire, jamais suffisante. Elle vous dit d’où vient le fichier. La quarantaine (leçon suivante) vous dit s’il s’est passé quelque chose depuis.
:::

## Mise en pratique

Créez le registre des sources de référence pour vos cinq éditeurs les plus fréquents. Enregistrez leurs clés publiques par un canal indépendant. Faites un transfert de test avec vérification complète et chronométrez.

## Checklist

- [ ] Registre des sources de référence avec empreintes de clés
- [ ] Poste de vérification distinct du poste de téléchargement
- [ ] Hachage attendu consigné avant comparaison
- [ ] Transparence utilisée quand l’écosystème le permet

## Le cas SITE 42

Le lot de correctifs 2025-09 de SITE 42, empreintes publiées contre empreintes reçues.

```
SITE 42 - verification du lot 2025-09

fichier              publiee par l editeur  fichier recu
-------------------  ---------------------  ------------
scada-patch-14.tar   9f2c4d81               9f2c4d81
hmi-patch-07.tar     1a77be30               1a77be30
plc-firmware-22.bin  4e5590cc               4e5591cc
doc-notes.pdf        b3d1f082               b3d1f082
```

```epreuve
{
  "enonce": "Une seule empreinte reçue ne correspond pas à celle publiée par l'éditeur. Donnez le nom du fichier concerné.",
  "reponse": "plc-firmware-22.bin",
  "indice": "Comparez caractère par caractère. L'écart tient en un chiffre."
}
```
