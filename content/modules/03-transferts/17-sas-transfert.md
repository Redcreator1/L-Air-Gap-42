---
minutes: 28
---

Le sas est le **conduit humain** de votre isolation. C’est là que se joue la différence entre un air gap et une convention. Cette leçon décrit la procédure de transfert entrant et sortant, le journal, et le double contrôle qui rend le processus résistant à l’initié.

## Objectifs

- Décrire la procédure de transfert entrant en huit étapes et sortant en cinq.
- Concevoir le journal du sas comme une preuve, pas comme une formalité.
- Mettre en œuvre le double contrôle sans paralyser l’exploitation.

## Le lieu

Un espace physique dédié, à la frontière du périmètre, avec : le kiosque, le stock de médias dédiés, le tableau d’inventaire, le journal (papier ou poste isolé), une caméra si la politique du site le permet. Deux zones matérialisées au sol : côté extérieur, côté périmètre. Rien ne traverse la ligne sans changer de média.

## Transfert entrant (extérieur → périmètre)

1. **Demande** : le demandeur décrit ce qui entre (fichiers, origine, usage, hachage attendu si disponible). Une ligne dans le journal.
2. **Vérification d’origine** : signature ou hachage confronté à la source de référence (leçon 18). Pas de source de référence : pas d’entrée, sauf procédure d’exception documentée.
3. **Analyse au kiosque** : résultat consigné, hachage de chaque fichier.
4. **Quarantaine** si applicable (leçon 19) : mises à jour, firmwares, exécutables attendent leur fenêtre.
5. **Copie sur média entrant dédié**, numéro du média consigné.
6. **Double contrôle** : une seconde personne vérifie la correspondance journal / contenu / hachage et signe.
7. **Insertion dans le périmètre** par le demandeur, sur le poste de destination consigné.
8. **Retour du média** au sas, effacement, retour au crochet.

## Transfert sortant (périmètre → extérieur)

1. Demande décrivant ce qui sort, pourquoi, vers qui.
2. Copie sur média sortant dédié.
3. **Revue de contenu** par une seconde personne : le contenu correspond-il à la demande ? Rien de plus ?
4. Copie vers l’extérieur au sas, hachage consigné.
5. Effacement du média sortant, retour au crochet.

## Le journal comme preuve

Chaque ligne : date, heure, demandeur, second contrôleur, sens, média n°, poste de destination ou d’origine, liste des fichiers avec hachages, résultat kiosque, référence de la vérification d’origine. Le journal est **immuable** : papier relié à pages numérotées, ou poste isolé avec journal en ajout seul et hachage chaîné.

C’est ce journal qui, rapproché des insertions détectées sur les postes (module 4), donne votre taux de conformité.

## Le double contrôle tenable

Le double contrôle échoue quand il est bureaucratique. Il tient quand :

- le second contrôleur est **n’importe quel** membre habilité présent, pas un rôle spécifique qu’il faut attendre ;
- la vérification prend **moins de trois minutes** (comparer trois champs et signer) ;
- la procédure d’urgence existe : média de secours sous scellé, un seul contrôleur, incident déclaré et revue sous 24 h.

:::tip L’urgence est prévue, pas improvisée
Une procédure d’urgence documentée et rapide est ce qui empêche l’exploitation de contourner le sas « parce qu’il n’y avait personne ». L’urgence passe par le sas. Elle passe simplement plus vite, et laisse une trace plus voyante.
:::

## Mise en pratique

Rédigez la procédure du sas sur une page recto verso, affichée au sas. Testez-la avec un transfert réel chronométré. Objectif : moins de quinze minutes hors quarantaine pour un transfert entrant standard.

## Checklist

- [ ] Espace physique dédié avec ligne de séparation
- [ ] Procédures entrante et sortante affichées
- [ ] Journal immuable avec hachages
- [ ] Double contrôle en moins de trois minutes, procédure d’urgence définie

```quiz
[
  {"q":"Que fait-on d’un fichier entrant sans source de référence pour vérifier son origine ?","choices":["On l’analyse au kiosque et on l’accepte","On refuse, sauf procédure d’exception documentée","On le met en quarantaine 24 h","On demande au fabricant par téléphone"],"answer":1,"explain":"Sans référence, la vérification d’origine est impossible ; le kiosque seul ne couvre pas cette menace."},
  {"q":"Ce qui rend le double contrôle tenable ?","choices":["Un rôle dédié","N’importe quel habilité présent, moins de trois minutes, procédure d’urgence","La signature électronique","Un formulaire détaillé"],"answer":1,"explain":"Un contrôle lent ou dépendant d’une personne est contourné ; un contrôle rapide et disponible est appliqué."}
]
```
