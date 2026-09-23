---
minutes: 20
---

Isoler coûte cher : en exploitation, en agilité, en frustration. Isoler *tout* garantit que l’isolation sera contournée. Cette leçon vous fait décider **ce qui mérite vraiment l’isolation**, et ce qui peut vivre ailleurs.

## Objectifs

- Classer vos actifs selon trois critères : conséquence, exposition, substituabilité.
- Réduire le périmètre isolé à ce qui le justifie, pour le rendre tenable.
- Documenter le raisonnement pour l’audit et pour la direction.

## Les trois critères

**Conséquence.** Que se passe-t-il si cet actif est indisponible, altéré ou divulgué ? Utilisez une échelle courte : sécurité des personnes, arrêt de production, perte financière, atteinte réputationnelle, non-conformité. Ne notez que le pire cas réaliste.

**Exposition.** Combien de personnes, de processus, d’interfaces touchent cet actif ? Un actif à forte conséquence mais très faible exposition (un automate dans une salle fermée, sans port accessible) coûte peu à isoler. Un actif très exposé (un historian consulté par vingt personnes) coûtera cher, et l’isolation sera contestée.

**Substituabilité.** Peut-on obtenir la même fonction autrement, hors du périmètre ? Si les rapports de production peuvent être produits par une copie unidirectionnelle des données (module 2), l’outil de reporting n’a rien à faire dans la zone isolée.

## La règle du périmètre minimal

> Le périmètre isolé contient les actifs à forte conséquence **et** non substituables. Tout le reste en sort, avec une copie ou un service de substitution.

Chaque actif que vous sortez du périmètre réduit le nombre de personnes qui ont une raison de le franchir. C’est la mesure de sécurité la plus rentable de tout le programme.

| Actif | Conséquence | Exposition | Substituable ? | Décision |
| --- | --- | --- | --- | --- |
| Automates de sécurité (SIS) | Personnes | Faible | Non | Isolé, cœur |
| Postes d’ingénierie | Production | Moyenne | Non | Isolé |
| Historian | Financière | Forte | Oui (réplique unidirectionnelle) | Hors périmètre, réplique |
| Reporting | Réputation | Forte | Oui | Hors périmètre |

## Mise en pratique

Passez chaque actif de votre carte dans ce tableau. Vous devriez sortir entre 20 et 40 % des actifs du périmètre isolé. Si vous n’en sortez aucun, revérifiez la colonne substituabilité : c’est presque toujours là que le raisonnement est trop conservateur.

## Checklist

- [ ] Chaque actif du périmètre isolé est justifié par une conséquence forte ET une non-substituabilité
- [ ] Les actifs sortis disposent d’un mécanisme de substitution nommé
- [ ] Le raisonnement tient sur une page pour l’audit

## Le cas SITE 42

Isoler coûte cher. Voici ce que SITE 42 perdrait, actif par actif.

```
SITE 42 - consequence d une perte de maitrise

actif              consequence
-----------------  ---------------------------------------------
plc-filtration-01  eau trouble, production arretee, sans danger
plc-chloration-02  dosage de chlore modifie : sante publique
plc-pompage-03     pression perdue, reseau vide en heures
hist-donnees-01    historique fausse, aucun effet immediat
```

```epreuve
{
  "enonce": "Un seul actif justifie à lui seul le coût de l'isolation, parce que sa perte de maîtrise met directement en jeu la santé des personnes. Donnez son nom.",
  "reponse": "plc-chloration-02",
  "indice": "Demandez-vous ce qui arrive aux gens, pas au réseau."
}
```
