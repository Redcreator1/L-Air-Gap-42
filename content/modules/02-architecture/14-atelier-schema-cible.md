---
minutes: 45
---

Fin du module 2. Vous produisez le **schéma d’architecture cible** : zones, conduits, DMZ, diodes, sas, accès distant, identité. Un schéma qu’un nouvel arrivant comprend en cinq minutes et qu’un auditeur peut confronter au terrain.

## Objectifs

- Dessiner le schéma cible selon les conventions proposées.
- Produire l’écart entre l’existant (module 0) et la cible : votre feuille de route.
- Faire relire le schéma par la communauté.

## Conventions du schéma

Un bon schéma d’isolation montre **l’absence** autant que la présence. Conventions :

- **Zones** : rectangles, nommés, avec leur niveau de sécurité cible et leur niveau de Purdue.
- **Conduits réseau** : traits pleins, flèche indiquant le sens autorisé. Une diode est un trait avec un symbole de diode et un seul sens.
- **Conduits non réseau** (média, humain) : traits pointillés, avec le nom du processus (« sas C1 »).
- **Frontière d’isolation** : un trait épais rouge. Tout ce qui le traverse porte un numéro de conduit. Rien ne le traverse sans numéro.
- **Absences explicites** : une note « aucune radio active (H2, vérifié 2026-03) », « aucun compte commun (H10) ». Un schéma qui montre les preuves d’absence est un schéma d’isolation.

## Contenu minimal

1. Zones cœur, ingénierie, réplique, sas, DMZ, entreprise.
2. Conduits numérotés, avec renvoi au tableau des exigences (leçon 8).
3. Diode(s) avec compteurs supervisés.
4. Poste de rebond et conduit temporaire d’accès distant, marqué « physique, sur activation ».
5. Annuaire local et autorité de certification hors-ligne.
6. Légende avec les hypothèses d’isolation référencées.

## L’écart existant → cible

Superposez mentalement votre carte du module 0 et ce schéma. Listez chaque différence dans un tableau :

| Écart | Type | Effort | Risque couvert | Priorité |
| --- | --- | --- | --- | --- |
| Partage SMB vers bureautique | Pont à supprimer | Faible | Initié négligent / média | 1 |
| Historian consulté directement | Service à déplacer en DMZ | Moyen | Exposition | 2 |
| Pas de diode | Équipement à acquérir | Fort | Sortie non contrôlée | 3 |

Cette liste est votre plan de remédiation provisoire. Le module 6 le transformera en plan 90 jours chiffré.

:::tip Le test du nouvel arrivant
Montrez le schéma à quelqu’un qui ne connaît pas le site. Demandez-lui : « Par où entrerais-tu ? » S’il montre un chemin que vous n’aviez pas numéroté, le schéma est incomplet. S’il montre un conduit numéroté, vous avez un schéma.
:::

## Relecture

Postez le schéma anonymisé dans le canal du module 2. Demandez : « Quel conduit manque ? » et « Quelle absence n’est pas prouvée ? »

## Checklist de fin de module

- [ ] Zones et conduits définis par exigences
- [ ] Périmètre positionné dans Purdue, demandes de données classées
- [ ] DMZ conforme aux cinq règles
- [ ] Diodes intégrées avec compteurs et procédure de panne
- [ ] Accès distant gradué et contractualisé
- [ ] Identité locale, coffre, revue trimestrielle
- [ ] Schéma cible avec absences explicites, relu
- [ ] Tableau des écarts priorisé

Le module 3 attaque le point où tout se joue : ce qui entre et sort par le sas.

```quiz
[
  {"q":"Que doit montrer un schéma d’isolation en plus des équipements ?","choices":["Les adresses IP","Les absences prouvées (radio, comptes communs) avec référence aux hypothèses","Les fournisseurs","Le coût"],"answer":1,"explain":"L’isolation est faite d’absences ; un schéma qui ne les prouve pas ne prouve rien."},
  {"q":"Un chemin qui traverse la frontière d’isolation sans numéro de conduit est :","choices":["Acceptable s’il est chiffré","Un pont non documenté","Une exception temporaire","Normal en phase projet"],"answer":1,"explain":"Rien ne traverse sans numéro : c’est la règle qui rend le schéma opposable."}
]
```
