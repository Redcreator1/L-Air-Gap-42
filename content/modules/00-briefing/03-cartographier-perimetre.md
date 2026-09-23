---
minutes: 30
---

Vous ne pouvez pas isoler ce que vous ne voyez pas. Cette leçon vous fait produire, en 90 minutes chrono, une **carte de périmètre** honnête : pas le schéma du projet initial, la réalité d’aujourd’hui.

C’est le premier livrable du programme, et vous le réutiliserez dans chaque module.

## Objectifs

- Produire une carte de périmètre en quatre couches : actifs, interfaces, flux, personnes.
- Mesurer votre « dette de visibilité » avec un score simple.
- Repérer les trois premiers candidats au statut de pont non documenté.

## Pourquoi 90 minutes et pas trois semaines

Parce qu’une carte parfaite dans un mois vaut moins qu’une carte imparfaite ce soir. L’objectif n’est pas l’exhaustivité, c’est la **révélation des inconnues**. Chaque case que vous ne pouvez pas remplir est une information en soi.

Vous ferez trois passes de 30 minutes. Chronométrez-les vraiment.

## Passe 1 · Les actifs et les interfaces (30 min)

Listez, de mémoire puis en vous déplaçant physiquement si possible, chaque équipement du périmètre isolé. Pour chacun, notez ses interfaces **physiques**, qu’elles soient utilisées ou non :

- ports Ethernet (combien ? lesquels sont câblés ?),
- ports USB, série, HDMI/DisplayPort (oui : l’affichage est une interface),
- radio : Wi-Fi, Bluetooth, cellulaire, propriétaire (regardez les antennes),
- lecteurs de cartes, lecteurs optiques,
- ports de debug (JTAG, console) sur les équipements industriels.

Utilisez ce tableau :

| Actif | Rôle | Interfaces présentes | Interfaces utilisées | Désactivées (comment ?) |
| --- | --- | --- | --- | --- |
| Poste ingénierie 1 | Programmation automates | 2×RJ45, 4×USB, Wi-Fi, BT | 1×RJ45, 1×USB | Wi-Fi/BT : BIOS ? OS ? inconnu |

La dernière colonne est la plus importante. « Désactivé dans l’OS » n’est pas « désactivé ». Une interface qui existe physiquement peut être réactivée par n’importe qui disposant des droits ou d’un tournevis.

## Passe 2 · Les flux (30 min)

Pour chaque interface *utilisée*, décrivez le flux : quoi, vers où, dans quel sens, à quelle fréquence, déclenché par qui.

```
Interface        Contenu                 Direction   Fréquence     Déclencheur
RJ45 poste ing.  Programmes automates    → automates Hebdo         Ingénieur
USB poste ing.   Projets / mises à jour  ← extérieur Mensuel       Ingénieur
USB poste ing.   Exports diagnostics     → extérieur Sur incident  Prestataire
```

Notez en particulier les flux **sortants**. Un air gap est presque toujours conçu pour empêcher les entrées ; les sorties (exports, sauvegardes, diagnostics) sont l’angle mort classique, et c’est par elles que la confidentialité s’évapore.

:::tip La question qui débloque tout
Demandez à chaque exploitant : « La dernière fois que quelque chose est *entré* dans ce système, comment est-ce arrivé ? » La réponse décrit votre vrai processus de transfert, celui que personne n’a écrit.
:::

## Passe 3 · Les personnes (30 min)

Listez chaque rôle ayant un accès, physique ou logique, au périmètre : exploitants, ingénieurs, maintenance interne, prestataires, fabricants, auditeurs, direction, ménage (oui), sécurité du site.

Pour chacun : fréquence d’accès, ce qu’il apporte avec lui (matériel, média), ce qu’il repart avec, et qui l’accompagne.

Cette passe révèle presque toujours un rôle oublié qui traverse le périmètre avec du matériel : le prestataire de climatisation qui branche un portable sur l’automate de la centrale de traitement d’air en est l’archétype.

## Le score de dette de visibilité

Comptez vos cases vides ou marquées « inconnu » dans les trois passes. Puis :

| Cases inconnues | Lecture |
| --- | --- |
| 0 à 5 | Périmètre bien tenu. Vérifiez quand même la passe 3. |
| 6 à 15 | Typique. Le module 1 vous donne la méthode pour réduire cela en deux semaines. |
| 16 et plus | Vous n’avez pas encore d’air gap, vous avez une intention. C’est une bonne nouvelle : tout ce que vous ferez sera mesurable. |

## Vos trois premiers suspects

Terminez en désignant les **trois éléments** de votre carte les plus susceptibles d’être des ponts non documentés. Critères : interface radio présente et « désactivée » sans preuve, rôle externe avec matériel propre, flux sortant sans journal.

Vous les traiterez en priorité dans les modules 1 et 3. Si vous n’avez qu’une chose à faire cette semaine, faites celle-ci.

## Pour aller plus loin

Le module 1 transforme cette carte en modèle de menace, puis en matrice de flux autorisés : la référence contre laquelle vous mesurerez chaque écart. Le module 4 automatise la détection des écarts. Vous venez de faire manuellement ce que vous saurez industrialiser dans quatre semaines.

## Le cas SITE 42

Voici les deux documents que vous produirez : la matrice déclarée, et ce qu'on relève réellement en ouvrant les armoires.

```
SITE 42 - matrice des flux declares (revision 4)
  scada-serveur-01    -> diode-sortie-01     historisation
  relais-fichiers-01  -> hist-donnees-01     import de signatures
  hmi-salle-01        -> plc-*               conduite

SITE 42 - inventaire releve en armoire (ce matin)
  plc-filtration-01, plc-chloration-02, plc-pompage-03
  hmi-salle-01, scada-serveur-01, hist-donnees-01
  diode-sortie-01, relais-fichiers-01
  ap-maint-03   (point d acces sans fil, alimente, SSID masque)
```

```epreuve
{
  "enonce": "Un équipement est alimenté sur le site sans apparaître dans une seule ligne de la matrice. C'est l'écart entre le schéma et la réalité. Donnez son nom.",
  "reponse": "ap-maint-03",
  "indice": "Comparez les deux listes équipement par équipement."
}
```
