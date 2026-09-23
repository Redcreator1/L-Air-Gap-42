---
minutes: 24
---

Toute organisation isolée a une politique de médias amovibles. Presque aucune n’est appliquée. L’écart vient d’un malentendu : une politique est écrite pour interdire, alors qu’elle devrait être écrite pour **rendre le chemin autorisé plus facile que le chemin interdit**.

## Objectifs

- Rédiger une politique de médias en six règles, applicables et vérifiables.
- Mettre en place le parc de médias dédiés et leur cycle de vie.
- Mesurer l’application par deux indicateurs simples.

## Les six règles

1. **Seuls les médias fournis par le périmètre entrent dans le périmètre.** Ils sont identifiés (numéro gravé, couleur distinctive), inventoriés, et ne sortent jamais du site. Un média inconnu inséré est un incident, pas une faute.
2. **Tout média entrant passe par le sas** (leçon 17). Pas d’exception pour l’urgence : l’urgence a sa propre procédure au sas, plus rapide, pas moins contrôlée.
3. **Un média a un sens.** Les médias « entrants » (vers le périmètre) et « sortants » (vers l’extérieur) sont physiquement distincts. Un média ne change jamais de sens. Cela supprime la classe entière du média qui fait l’aller-retour.
4. **Un média a une durée de vie.** Effacement sécurisé et destruction physique après N cycles ou M mois. Le média usé est détruit, pas réaffecté.
5. **Les périphériques USB non-stockage sont des médias.** Claviers, adaptateurs, dongles : fournis par le périmètre, inventoriés, jamais apportés.
6. **Les ports non utilisés sont obturés et scellés.** Le scellé numéroté fait partie de l’inventaire ; sa rupture est un incident.

## Le parc

| Type | Marquage | Usage | Cycle de vie |
| --- | --- | --- | --- |
| Entrant | Vert, numéroté | Sas → périmètre | 20 cycles ou 6 mois, puis destruction |
| Sortant | Rouge, numéroté | Périmètre → sas | 20 cycles ou 6 mois, puis destruction |
| Secours | Jaune, sous scellé | Procédure d’urgence | Usage unique |

## Ce qui fait qu’elle est appliquée

- Le média autorisé est **à portée de main** : un stock au sas, disponible en trente secondes, sans formulaire.
- L’inventaire est **visuel** : un tableau à crochets numérotés. Un crochet vide se voit.
- Le prestataire est prévenu **avant** de venir : « n’apportez aucun média, nous fournissons ». Il l’accepte, parce que c’est écrit au contrat (leçon 12).

:::warning Le mot « exception »
Si votre politique contient une procédure d’exception qui permet d’insérer un média non dédié « avec l’accord du responsable », vous n’avez pas de politique : vous avez une formalité. La seule exception acceptable est le média de secours sous scellé, dont l’usage est un incident documenté.
:::

## Indicateurs

- **Taux de conformité** : insertions journalisées au sas / insertions détectées sur les postes (module 4). Objectif : 100 %. Tout écart est un média non passé par le sas.
- **Âge moyen du parc** : signale un cycle de vie non appliqué.

## Mise en pratique

Rédigez la politique en une page à partir des six règles. Commandez le parc. Obturez les ports. Planifiez la mesure du taux de conformité.

## Checklist

- [ ] Médias dédiés, marqués, à sens unique, à durée de vie bornée
- [ ] Ports inutilisés obturés et scellés, scellés inventoriés
- [ ] Chemin autorisé disponible en moins d’une minute
- [ ] Taux de conformité mesuré

## Le cas SITE 42

La politique de médias de SITE 42 existe. Voici ce que trente jours de transferts en disent réellement.

```
SITE 42 - application reelle sur 30 jours

code  regle                                    conformes
----  ---------------------------------------  ---------
r1    media fourni par l exploitant            28 / 31
r2    passage au kiosque avant entree          31 / 31
r3    demande ecrite et approbation             9 / 31
r4    journal signe des deux cotes             30 / 31
```

```epreuve
{
  "enonce": "Une règle écrite pour interdire est contournée ; une règle écrite pour rendre le bon geste possible est appliquée. Donnez le code de celle que l'exploitation contourne massivement.",
  "reponse": "r3",
  "indice": "Un chiffre s'écarte violemment des autres."
}
```
