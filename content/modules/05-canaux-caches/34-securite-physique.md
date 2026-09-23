---
minutes: 22
---

L’air gap est une mesure physique. Sa sécurité repose sur la sécurité physique du lieu : qui entre, ce qu’il apporte, ce qu’il touche, ce qu’il emporte. Cette leçon parcourt la « couche zéro » du point de vue de l’isolation, sans refaire un cours de sûreté des sites.

## Objectifs

- Définir les zones physiques et leurs contrôles en cohérence avec les zones logiques.
- Traiter les cinq points faibles classiques : baies, câblage, accès prestataire, nettoyage, réforme.
- Relier la sécurité physique à la détection (module 4).

## Zones physiques = zones logiques

Chaque zone logique (module 2) a une traduction physique : le cœur est dans un local ou une baie verrouillée ; l’ingénierie dans un espace à accès contrôlé ; le sas est un lieu identifiable ; la zone de contrôle (leçon 30) entoure les actifs critiques. Un actif de la zone cœur installé dans un couloir accessible est une incohérence d’architecture, pas un détail de sûreté.

| Zone | Contrôle d’accès | Journal | Ce qui entre |
| --- | --- | --- | --- |
| Cœur (baies, automates) | Clé ou badge nominatif, ouverture journalisée, détection d’ouverture | Automatique | Rien sans intervention planifiée et escortée |
| Ingénierie | Badge nominatif | Automatique | Personnel habilité, aucun équipement personnel |
| Sas | Accès habilités | Journal du sas | Médias extérieurs, jusqu’au kiosque seulement |
| Zone de contrôle | Casiers, inspection | Registre | Aucun équipement non maîtrisé |

## Cinq points faibles

**Baies et armoires.** Souvent ouvertes, ou fermées par une clé universelle du fabricant. Serrures dédiées, détection d’ouverture remontée au collecteur, scellés numérotés sur les armoires rarement ouvertes.

**Câblage.** Un câble qui traverse un faux plafond ou un local technique partagé est accessible. Chemins de câbles identifiés, dans des locaux du périmètre, et le suivi physique annuel (module 4) le vérifie.

**Accès prestataire.** Toujours escorté dans le cœur et l’ingénierie, jamais seul, jamais avec son matériel. L’escorte est un membre habilité qui sait ce qu’il regarde, pas un agent d’accueil.

**Nettoyage et services.** Le personnel de nettoyage a souvent un accès large, en dehors des heures, sans escorte. Dans le cœur et l’ingénierie : nettoyage en présence d’un habilité, ou pas de nettoyage (les salles techniques peuvent vivre sans).

**Réforme et déchets.** Les équipements, médias et documents réformés sortent du périmètre : procédure de réforme (module 3, leçon 20) et destruction des supports et documents sur place.

## Relier à la détection

Les événements physiques (ouverture de baie, badge, rupture de scellé) sont des sources de la télémétrie (module 4). Une ouverture de baie sans intervention planifiée est une alerte ; une insertion USB détectée sur un poste sans badge correspondant dans la salle est un incident. Ce rapprochement physique / logique est spécifique aux périmètres isolés et très efficace.

:::tip Le tour de salle
Une fois par mois, un habilité fait le tour du périmètre avec la liste : scellés, serrures, câbles visibles, équipements inconnus, post-it, portes calées. Trente minutes. C’est l’inspection la plus rentable de tout le programme.
:::

## Mise en pratique

Faites le tour de salle cette semaine avec la liste ci-dessus. Notez chaque écart. Vérifiez la cohérence entre zones logiques et zones physiques sur votre schéma.

## Checklist

- [ ] Zones physiques cohérentes avec les zones logiques
- [ ] Baies verrouillées avec détection d’ouverture, scellés inventoriés
- [ ] Prestataires et nettoyage escortés dans le cœur et l’ingénierie
- [ ] Événements physiques dans la télémétrie, tour de salle mensuel

## Le cas SITE 42

La couche zéro de SITE 42 : qui entre, ce qu’il apporte, ce qu’il touche.

```
SITE 42 - controles physiques

code  controle                        etat
----  ------------------------------  -------------------------------
y1    badge nominatif a l entree      en place
y2    accompagnement des externes     en place, sauf pour la maintenance
y3    scelles sur les armoires        en place, verifies mensuellement
y4    video sur la salle de conduite  en place, 30 jours
y5    fouille des sacs                non, ecartee
```

```epreuve
{
  "enonce": "Un contrôle est en place partout, sauf précisément pour la population qui ouvre le plus souvent les armoires. Donnez son code.",
  "reponse": "y2",
  "indice": "Qui intervient dans les armoires automates ?"
}
```
