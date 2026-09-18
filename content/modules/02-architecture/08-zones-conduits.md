---
minutes: 24
---

IEC 62443 a donné aux architectes d’environnements industriels un vocabulaire précieux : **zones** (groupes d’actifs partageant des exigences de sécurité) et **conduits** (chemins de communication entre zones, eux-mêmes sécurisés). Cette leçon en extrait ce qui sert un air gap, et écarte ce qui le complique.

## Objectifs

- Découper votre périmètre en zones selon les exigences, pas selon la topologie.
- Définir chaque conduit avec ses exigences propres, y compris les conduits *non réseau*.
- Attribuer un niveau de sécurité cible (SL-T) sans en faire un exercice bureaucratique.

## Zones : par exigence, pas par câble

L’erreur classique est de dessiner les zones en suivant les switchs. Une zone se définit par ce que ses actifs ont en commun : conséquence en cas de compromission, adversaires crédibles, contraintes d’exploitation. Deux automates sur le même switch peuvent appartenir à des zones différentes ; un automate et son poste d’ingénierie dédié, à la même.

Pour un périmètre isolé, on aboutit typiquement à trois ou quatre zones :

- **Zone cœur** : actifs à conséquence maximale (sécurité, procédé). Aucun conduit entrant.
- **Zone ingénierie** : postes de programmation, serveurs de projets. Conduit entrant unique : le sas.
- **Zone réplique** : copies de données destinées à sortir. Conduit sortant unique : la diode.
- **Zone sas** : l’espace où entrent et sortent les médias. Techniquement hors du périmètre isolé, mais sous votre contrôle.

## Conduits : y compris ceux qui ne sont pas des câbles

Un conduit est tout chemin par lequel des données passent entre zones. Le média amovible entre le sas et l’ingénierie **est un conduit** et doit être documenté comme tel, avec ses exigences : contrôle d’intégrité, journal, double validation.

| Conduit | De → vers | Support | Exigences |
| --- | --- | --- | --- |
| C1 | Sas → Ingénierie | Média | Vérification hachage, antivirus multi-moteurs, quarantaine, journal |
| C2 | Ingénierie → Cœur | Filaire dédié | Authentification, journal des téléchargements de programmes |
| C3 | Cœur → Réplique | Filaire | Lecture seule (protocole) |
| C4 | Réplique → DMZ externe | Diode | Unidirectionnel physique, compteur d’intégrité |

## Niveaux de sécurité sans bureaucratie

IEC 62443 définit des niveaux SL 1 à 4 selon la capacité de l’adversaire. Utilisez-les comme raccourci de communication : la zone cœur d’un périmètre isolé vise typiquement SL 3 (adversaire aux moyens modérés, motivé). Ne passez pas trois semaines à remplir des tableaux d’exigences : déduisez-les de votre modèle de menace (module 1), qui contient déjà l’adversaire.

:::note Ce que la norme n’impose pas
IEC 62443 ne demande nulle part un air gap. Elle demande que les conduits soient sécurisés à la hauteur du niveau cible. L’air gap est *votre* choix d’implémentation pour certains conduits, et il doit être justifié comme tel.
:::

## Mise en pratique

Redessinez votre périmètre en zones et conduits. Chaque conduit, réseau ou non, a une ligne dans le tableau ci-dessus. Comparez avec la matrice des flux : chaque flux doit emprunter exactement un conduit.

## Checklist

- [ ] Zones définies par exigences communes, pas par topologie
- [ ] Chaque conduit, y compris média et humain, a ses exigences écrites
- [ ] Chaque flux de la matrice correspond à un conduit unique

```quiz
[
  {"q":"Qu’est-ce qui définit une zone selon IEC 62443 ?","choices":["Un segment réseau","Un ensemble d’actifs partageant des exigences de sécurité","Une salle","Un fournisseur"],"answer":1,"explain":"La topologie suit les exigences, pas l’inverse."},
  {"q":"Le passage d’un média du sas vers la zone ingénierie est :","choices":["Hors périmètre de la norme","Un conduit, avec ses exigences propres","Un flux interne sans exigence","Une exception"],"answer":1,"explain":"Tout chemin de données entre zones est un conduit, quel que soit son support."}
]
```
