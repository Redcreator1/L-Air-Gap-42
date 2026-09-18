---
minutes: 40
---

Fin du module 4. Vous assemblez télémétrie, baselines, campagnes de détection, chasse, playbook et exercice en un **plan de détection** : ce que vous surveillez, comment, à quelle fréquence, et ce qui se passe quand ça sonne.

## Objectifs

- Rédiger le plan de détection au format proposé.
- Vérifier la couverture : chaque hypothèse d’isolation et chaque risque prioritaire ont une détection.
- Fixer le calendrier annuel des campagnes, chasses et exercices.

## Format du plan

**Section 1 · Couverture.** Un tableau : hypothèse ou risque → source de données → mécanisme (alerte continue, comparaison périodique, campagne, chasse) → fréquence → propriétaire. Toute ligne sans mécanisme est un angle mort assumé, écrit comme tel.

| Hypothèse / risque | Source | Mécanisme | Fréquence | Propriétaire |
| --- | --- | --- | --- | --- |
| H1 lien filaire | Tables switchs, suivi câbles, test de fuite | Continu + annuel + trimestriel | — | Réseau OT |
| H2 radio | Balayage, inspection, config | Campagne | Semestrielle | Sécurité |
| H3 médias | Baseline périphériques, journal sas | Continu + rapprochement | Mensuel | Exploitation |
| Risque prestataire | Baseline processus, journaux exécution | Chasse | Trimestrielle | Sécurité |

**Section 2 · Architecture de collecte.** Option A ou B (leçon 22), serveur de temps, séparation des tâches, rétention.

**Section 3 · Baselines.** Les cinq, avec date de capture, fréquence de comparaison, procédure de mise à jour sur changement annoncé.

**Section 4 · Traitement des alertes.** Qui regarde, quand (un périmètre isolé n’a pas de SOC 24/7 ; définissez la revue quotidienne et le délai maximal), critères de qualification en incident, renvoi au playbook.

**Section 5 · Calendrier annuel.** Campagnes radio, périphériques, topologie ; chasses mensuelles ; exercice sur table semestriel ; revue du plan.

**Section 6 · Indicateurs.** Taux de conformité sas, nombre d’alertes / incidents / preuves négatives par mois, délai moyen de qualification, âge des baselines.

## Vérification de couverture

Croisez le plan avec le registre d’hypothèses et les risques prioritaires. Une hypothèse sans détection est acceptable si elle est **écrite comme telle** et justifiée (« H6 exceptions : détection par revue documentaire trimestrielle uniquement »). Ce qui n’est pas acceptable, c’est l’angle mort implicite.

:::tip Les indicateurs pour la direction
Deux chiffres suffisent à la direction : le taux de conformité du sas (« 100 % des insertions passent par le sas ») et le nombre de preuves négatives datées (« 14 vérifications d’isolation cette année, 0 pont »). Ils racontent une histoire d’isolation prouvée, pas d’absence d’incident.
:::

## Relecture

Postez la section 1 anonymisée dans le canal du module 4. Question aux pairs : « Quelle hypothèse ai-je considérée couverte alors qu’elle ne l’est pas ? »

## Checklist de fin de module

- [ ] Télémétrie alignée sur les hypothèses, temps synchronisé, collecteur séparé
- [ ] Cinq baselines expliquées, comparées, mises à jour sur changement annoncé
- [ ] Trois campagnes de détection planifiées et consignées
- [ ] Chasse mensuelle instituée, preuves négatives au registre
- [ ] Playbook en six phases, boîte à outils importée, matrice de décision validée
- [ ] Exercice sur table planifié ou réalisé, actions attribuées
- [ ] Plan de détection avec couverture vérifiée et calendrier annuel

Le module 5 traite ce qui reste quand tout le reste est fait : la physique, et le durcissement en profondeur.

```quiz
[
  {"q":"Une hypothèse d’isolation sans mécanisme de détection est acceptable si :","choices":["Elle est peu probable","Elle est écrite comme angle mort assumé et justifiée","Le budget manque","Elle est couverte par le contrat fabricant"],"answer":1,"explain":"L’angle mort explicite est une décision ; l’angle mort implicite est une surprise."},
  {"q":"Indicateur qui raconte l’isolation prouvée à la direction ?","choices":["Le nombre d’incidents","Le nombre de preuves négatives datées et le taux de conformité du sas","Le nombre d’alertes","Le budget dépensé"],"answer":1,"explain":"L’absence d’incident ne prouve rien ; des vérifications datées et un sas à 100 % prouvent la méthode."}
]
```
