---
minutes: 22
---

« Ce réseau est isolé » est une hypothèse. Cette leçon vous apprend à la transformer en une série de **preuves vérifiables et datées**, parce que c’est exactement ce qu’un auditeur, un assureur ou un juge vous demandera après un incident.

## Objectifs

- Décomposer l’affirmation « isolé » en hypothèses élémentaires testables.
- Associer à chaque hypothèse une preuve, un responsable et une fréquence de revérification.
- Créer le registre des hypothèses d’isolation, pièce maîtresse de votre dossier.

## De l’affirmation aux hypothèses

« Le réseau de supervision est isolé » se décompose, au minimum, en :

- H1. Aucun équipement du périmètre n’a de lien filaire vers un autre réseau.
- H2. Aucun équipement du périmètre n’a de radio active.
- H3. Tout média inséré passe par le sas et est journalisé.
- H4. Aucun équipement nomade n’est connecté sans être dédié au périmètre.
- H5. Toute mise à jour importée est vérifiée et mise en quarantaine.
- H6. Toute exception a une date de fin et un propriétaire.
- H7. Toute sortie de données est journalisée.

Chaque hypothèse doit être **falsifiable** : on doit pouvoir décrire l’observation qui la contredirait.

## Le registre

| Hypothèse | Preuve | Méthode | Responsable | Fréquence | Dernière vérif. |
| --- | --- | --- | --- | --- | --- |
| H1 | Schéma + inspection des baies | Suivi physique des câbles | Resp. réseau OT | Trimestrielle | 2026-06-12 |
| H2 | Balayage spectral + config BIOS | Analyseur portable, capture d’écran BIOS | Sécurité | Semestrielle | 2026-03-04 |
| H3 | Journal du sas | Rapprochement journal / accès badge | Exploitation | Mensuelle | 2026-09-01 |

Trois colonnes font toute la différence : **méthode** (comment on regarde), **fréquence** (quand on re-regarde) et **dernière vérification** (une preuve a une date de péremption).

:::tip La preuve négative
Prouver l’absence de quelque chose est difficile. Votre preuve n’est jamais « il n’y a rien », mais « voici la méthode employée, à cette date, par cette personne, qui n’a rien trouvé ». C’est la seule formulation défendable.
:::

## Mise en pratique

Rédigez votre registre avec au moins sept hypothèses. Pour chacune, si vous n’avez pas de preuve datée de moins d’un an, marquez « non vérifiée ». Ce registre devient le plan de travail du module 4 (détection continue de la violation des hypothèses).

## Checklist

- [ ] Chaque hypothèse est falsifiable et a une méthode d’observation
- [ ] Chaque preuve est datée et a un responsable nommé
- [ ] Les hypothèses non vérifiées depuis plus d’un an sont marquées comme telles

## Le cas SITE 42

Chaque hypothèse d’isolation de SITE 42, et la preuve datée qui la soutient — ou pas.

```
SITE 42 - hypotheses et preuves

code  hypothese                             preuve datee
----  ------------------------------------  ----------------------
h1    aucun cable ne sort de la zone 1      releve d armoire 12/01
h2    la diode est unidirectionnelle        essai constructeur 03/19
h3    aucun lien radio actif                -
h4    les medias passent par le kiosque     journal du sas, continu
h5    aucun compte partage sur automates    audit interne 11/02
```

```epreuve
{
  "enonce": "Une hypothèse sans preuve datée n'est pas une hypothèse : c'est un espoir. Donnez le code de la seule qui n'est adossée à rien.",
  "reponse": "h3",
  "indice": "Regardez la colonne de droite, ligne par ligne."
}
```
