---
minutes: 24
---

La chasse aux menaces, c’est chercher ce que les alertes n’ont pas vu, à partir d’une hypothèse. En environnement isolé, sans flux de renseignement en temps réel, la chasse repose sur **votre connaissance du normal** et sur des hypothèses tirées de votre propre modèle de menace.

## Objectifs

- Formuler des hypothèses de chasse à partir des risques prioritaires du modèle de menace.
- Mener une chasse en quatre étapes avec les données du périmètre.
- Instituer un rythme mensuel tenable.

## De la menace à l’hypothèse

Reprenez les trois risques prioritaires de votre modèle (module 1, leçon 7). Chacun donne une hypothèse de chasse :

| Risque | Hypothèse de chasse | Où chercher |
| --- | --- | --- |
| Un prestataire introduit un code par média | « Un exécutable non présent dans la baseline a été lancé depuis un volume amovible » | Journaux d’exécution, historique USB, baseline processus |
| Une mise à jour amont compromise a été déployée | « Un composant mis à jour lors de la dernière fenêtre a un comportement réseau ou fichier nouveau » | Baseline réseau, tâches planifiées, fichiers créés depuis la fenêtre |
| Un pont sert à exfiltrer | « Un poste a une conversation réseau absente de la matrice » | Table des conversations, compteurs de la diode |

## Les quatre étapes

1. **Hypothèse** : une phrase, falsifiable, avec la source de données.
2. **Collecte** : extraire les données pertinentes sur la période (typiquement 30 à 90 jours).
3. **Analyse** : comparer à la baseline, chercher le rare (l’exécutable lancé une fois, la conversation unique, la connexion à 3 h).
4. **Conclusion** : soit une découverte (→ playbook), soit une preuve négative datée (→ registre d’hypothèses), soit une amélioration de la collecte (une donnée manquait). Les trois sont des résultats.

## Ce qui est spécifique au hors-ligne

- **Pas d’indicateurs externes récents** : la chasse par indicateurs (hachages, adresses connus) se fait par lots, avec des listes importées par le sas, en retard. Utile, pas central.
- **Pas de bruit** : dans un périmètre isolé, le rare est vraiment rare. Une chasse qui trouve « rien d’inhabituel » en une heure est une chasse réussie, et une preuve.
- **Les automates** : chercher les changements de programme non annoncés, les changements de mode, les téléchargements hors fenêtre. Les journaux d’automates sont sous-exploités et très parlants.

:::tip La chasse comme audit interne
Chaque chasse produit soit une découverte, soit une preuve négative datée. Rangez ces preuves dans le registre d’hypothèses : après un an, vous avez douze preuves datées que votre périmètre a été examiné avec méthode. C’est ce qu’un auditeur veut voir.
:::

## Rythme

Une chasse par mois, deux heures, une hypothèse. Tournez sur les risques prioritaires, puis sur les surfaces (module 1, leçon 4). Consignez chaque chasse : hypothèse, données, conclusion, durée.

## Mise en pratique

Rédigez trois hypothèses de chasse à partir de votre modèle. Menez la première ce mois-ci. Consignez le résultat dans le registre.

## Checklist

- [ ] Trois hypothèses de chasse tirées du modèle de menace
- [ ] Première chasse menée et consignée
- [ ] Rythme mensuel planifié
- [ ] Preuves négatives datées versées au registre

## Le cas SITE 42

Les hypothèses de chasse formulées sur SITE 42, et ce que les données permettent d’en faire.

```
SITE 42 - hypotheses de chasse

code  hypothese                              verifiable ?
----  -------------------------------------  ----------------------
c1    un media a introduit un non signe      oui, journal du kiosque
c2    un compte technique hors horaires      oui, journal hmi
c3    un automate execute un code non conforme  oui, empreinte
c4    des donnees sortent hors reseau        non, aucune mesure
```

```epreuve
{
  "enonce": "Une hypothèse qu'on ne peut pas vérifier avec les données disponibles n'est pas une hypothèse de chasse : c'est une inquiétude. Donnez son code.",
  "reponse": "c4",
  "indice": "Une seule ligne porte « non »."
}
```
