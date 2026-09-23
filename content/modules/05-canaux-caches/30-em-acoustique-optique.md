---
minutes: 26
---

Pour les périmètres où l’acteur ciblé est crédible, voici les contre-mesures par famille, classées par rapport coût/efficacité. La règle : **d’abord la distance et le contrôle physique, ensuite le durcissement, enfin le blindage**.

## Objectifs

- Appliquer les contre-mesures proportionnées à chaque famille de canal caché.
- Prioriser par coût et efficacité, en commençant par ce qui est presque gratuit.
- Savoir quand le blindage certifié se justifie, et quand il ne se justifie pas.

## Niveau 1 · Distance et contrôle physique (coût faible)

Tous les canaux ont une portée courte ou une ligne de vue. Les contre-mesures les moins chères agissent là-dessus :

- **Zone de contrôle** : aucun équipement non maîtrisé (téléphone, ordinateur portable, objet connecté) dans un rayon défini autour des actifs critiques. Casiers à l’entrée. C’est la mesure la plus efficace contre l’acoustique et l’optique, et elle coûte des casiers.
- **Pas de ligne de vue** : actifs critiques sans fenêtre, écrans non visibles depuis l’extérieur ou depuis des caméras non maîtrisées.
- **Séparation des circuits électriques** : les actifs critiques sur un circuit dédié, filtré, sans compteur communicant partagé.
- **Distance entre machines** de zones différentes : pas de machine externe adjacente à une machine isolée (thermique, vibration).

## Niveau 2 · Réduction des émetteurs (coût faible à moyen)

- **Retirer** haut-parleurs, microphones, webcams, LED non nécessaires (obturer ou déconnecter physiquement). Un composant absent n’émet pas.
- **Désactiver au firmware** ce qui ne peut être retiré, et vérifier (module 4).
- **Ventilation** : châssis à ventilation contrôlée, ou refroidissement passif pour les actifs les plus sensibles.
- **Câblage** : câbles blindés et courts ; les longs câbles non blindés sont des antennes.

## Niveau 3 · Détection (coût moyen)

- **Surveillance spectrale** permanente ou périodique de la zone de contrôle : un émetteur inattendu (le téléphone qui n’aurait pas dû entrer, le récepteur planté) est détecté.
- **Caméras maîtrisées** de la zone de contrôle, pour détecter la présence physique nécessaire à la réception.

## Niveau 4 · Blindage (coût élevé)

- **Salles ou baies blindées** (cage de Faraday) pour l’électromagnétique, avec filtres sur toutes les pénétrations (alimentation, fibre).
- **Traitement acoustique** de la salle.
- **Équipements à émissions réduites** selon les normes gouvernementales applicables, pour les contextes classifiés.

Le niveau 4 se justifie quand un référentiel réglementaire l’impose, ou quand la valeur de l’actif et l’adversaire retenu le justifient explicitement. Sinon, les niveaux 1 à 3 couvrent l’essentiel à une fraction du coût.

| Famille | Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4 |
| --- | --- | --- | --- | --- |
| EM | Distance, circuits | Câbles blindés | Spectral | Cage |
| Acoustique | Casiers, pas de téléphone | Retirer HP/micro, ventilation | Caméras | Traitement |
| Optique | Pas de ligne de vue | Obturer LED, écrans | Caméras | — |
| Thermique | Distance entre machines | — | — | — |

:::warning Le blindage qui rassure et le téléphone qui entre
Une cage de Faraday avec un téléphone à l’intérieur ne sert à rien. Le niveau 1 (contrôle de ce qui entre dans la zone) conditionne tous les autres. Commencez par les casiers.
:::

## Mise en pratique

Si votre modèle retient l’acteur ciblé : mettez en œuvre le niveau 1 cette semaine, le niveau 2 dans le trimestre, évaluez le niveau 3. Documentez chaque mesure dans le registre (« H11 : aucun équipement non maîtrisé dans la zone de contrôle, méthode : casiers + inspection »).

## Checklist

- [ ] Zone de contrôle définie avec casiers et inspection
- [ ] Ligne de vue et circuits électriques traités
- [ ] Émetteurs non nécessaires retirés ou obturés
- [ ] Niveau 4 décidé sur justification écrite, pas par défaut

## Le cas SITE 42

Les contre-mesures envisagées pour SITE 42, avec ce qu’elles couvrent et ce qu’elles coûtent.

```
SITE 42 - contre-mesures envisagees

code  mesure                                 couvre      cout
----  -------------------------------------  ----------  -----------
cm1   perimetre d exclusion de 20 m          k1, k2, k3  faible
cm2   suppression des diodes d etat          k3          faible
cm3   cage de Faraday sur la salle           k1          tres eleve
cm4   interdiction des telephones en salle   k2          faible
```

```epreuve
{
  "enonce": "La règle est constante : d'abord la distance et le contrôle physique, le blindage ensuite. Une seule mesure couvre trois familles pour un coût faible. Donnez son code.",
  "reponse": "cm1",
  "indice": "Comparez la colonne « couvre » à la colonne « coût »."
}
```
