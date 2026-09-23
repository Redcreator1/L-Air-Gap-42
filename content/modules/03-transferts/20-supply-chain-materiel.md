---
minutes: 24
---

Tout ce qui est *installé* dans le périmètre a été acheté, livré, stocké, déballé. Chaque étape est une opportunité de substitution ou d’ajout. Cette leçon organise la supply chain matérielle avec des contrôles proportionnés, du serveur à la clé USB.

## Objectifs

- Cartographier la chaîne d’approvisionnement matériel et ses points de vulnérabilité.
- Appliquer trois niveaux de contrôle selon la criticité de l’équipement.
- Gérer le cycle de vie : réception, stockage, mise en service, réforme.

## La chaîne et ses points faibles

Fabricant → distributeur → transporteur → réception → stockage → installation → exploitation → réforme. Les points les plus exposés dans la pratique : le **transport** (colis accessible), le **stockage** (magasin partagé, accès large), la **réforme** (équipement parti avec ses données et ses secrets).

## Trois niveaux de contrôle

| Niveau | Équipements | Contrôles |
| --- | --- | --- |
| Standard | Périphériques, câbles, médias | Fournisseur référencé, réception vérifiée (emballage, référence), stockage fermé |
| Renforcé | Postes, serveurs, switchs | + livraison directe avec scellés fournisseur, vérification firmware (version, hachage si fourni), réinitialisation complète avant mise en service |
| Critique | Automates, SIS, diodes, HSM, kiosque | + double réception (deux personnes), photos des scellés, vérification physique (ouverture, comparaison avec référence), firmware réinstallé depuis source de référence, mise en service sous témoin |

## Ce que « réinitialisation complète » veut dire

Effacer le disque ne suffit pas. Réinstaller le système depuis votre image maîtresse (transportée par le sas), réinitialiser le firmware aux paramètres constructeur puis l’amener à votre configuration documentée, changer tous les identifiants, désactiver ou retirer les interfaces non nécessaires (leçon 4 du module 1). Consigner la version de firmware et son hachage dans l’inventaire.

## Les pièces de rechange

Un stock de rechange est un stock d’équipements *installables sans délai*, donc à contrôler comme ceux qui sont installés. Il est sous scellé, inventorié, et une pièce sortie du stock repasse par la mise en service renforcée ou critique. Le stock est renouvelé : un automate de rechange stocké huit ans a un firmware de huit ans.

## La réforme

Un équipement qui quitte le périmètre emporte : ses données, ses secrets (clés, mots de passe stockés), sa configuration (qui décrit votre architecture). Procédure : extraction des secrets et révocation, effacement sécurisé ou destruction du stockage, effacement de la configuration, journal de sortie. Un équipement en panne renvoyé au fabricant pour réparation suit la même procédure : le stockage reste chez vous.

:::warning L’adaptateur qui n’était pas au bon de commande
Une inspection de réception doit comparer le colis au bon de commande **et** repérer ce qui est en trop : un adaptateur, un câble, un dongle « offert ». Ce qui n’a pas été commandé n’entre pas.
:::

## Mise en pratique

Classez vos équipements par niveau. Rédigez la fiche de réception pour le niveau critique. Inspectez le stock de rechange et son scellé.

## Checklist

- [ ] Chaque équipement a un niveau de contrôle et une fiche de réception
- [ ] Réinitialisation complète avant mise en service, firmware consigné
- [ ] Stock de rechange scellé, inventorié, renouvelé
- [ ] Réforme avec révocation des secrets et conservation du stockage

## Le cas SITE 42

La réception du lot matériel 2025-Q3 de SITE 42. Chaque étape avant le déballage est une occasion de substitution.

```
SITE 42 - reception du lot 2025-Q3

reference        livre le  scelle intact  serie conforme au bon
---------------  --------  -------------  ---------------------
plc-pompage-04   03/07     oui            oui
carte-reseau-11  03/07     oui            oui
disque-hist-05   18/07     oui            oui
cle-usb-lot-9    03/07     oui            non
```

```epreuve
{
  "enonce": "Un seul article est arrivé avec un numéro de série qui ne correspond pas au bon de livraison. Donnez sa référence.",
  "reponse": "cle-usb-lot-9",
  "indice": "La dernière colonne ne porte qu'un seul « non »."
}
```
