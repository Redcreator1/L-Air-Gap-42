---
minutes: 26
---

La matrice des flux autorisés est **le document de référence** de votre air gap. Tout ce qui n’y figure pas est interdit. Tout ce qui y figure a un propriétaire, un contrôle et un journal. Sans elle, « détecter un écart » n’a pas de sens : écart par rapport à quoi ?

## Objectifs

- Construire la matrice des flux à partir de la carte de périmètre et des neuf surfaces.
- Attribuer à chaque flux un contrôle, un journal et un propriétaire.
- Instituer la règle « par défaut interdit » de façon documentée et opposable.

## Structure de la matrice

Une ligne par flux. Un flux est défini par : source, destination, surface (une des neuf), contenu, sens, fréquence, déclencheur, contrôle, journal, propriétaire, date de revue.

| # | Source | Destination | Surface | Contenu | Sens | Fréq. | Contrôle | Journal | Propriétaire | Revue |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | Sas | Poste ing. | Média | Projets automates | Entrant | Hebdo | Double contrôle + antivirus + hachage | Registre sas | Chef ingénierie | 2027-03 |
| F2 | Historian | Réplique DMZ | Filaire | Données procédé | Sortant | Continu | Diode | Compteur diode | Resp. réseau | 2027-03 |
| F3 | Poste ing. | Sas | Média | Exports diagnostics | Sortant | Sur incident | Revue contenu | Registre sas | Chef ingénierie | 2027-03 |

## Les règles qui rendent la matrice opposable

1. **Par défaut interdit.** Le préambule de la matrice le dit explicitement, et la PSSI y renvoie.
2. **Aucun flux sans propriétaire en poste.** Un flux dont le propriétaire est parti est suspendu jusqu’à réattribution.
3. **Aucun flux sans journal.** Si on ne peut pas prouver qu’un flux a eu lieu, on ne peut pas prouver qu’un autre n’a pas eu lieu.
4. **Date de revue obligatoire.** Un flux non revu à sa date est suspendu. C’est la mesure qui tue les exceptions éternelles.
5. **Les flux sortants sont traités avec la même rigueur** que les entrants.

:::warning Le flux « divers »
Si vous êtes tenté d’écrire une ligne « transferts divers » pour couvrir ce que vous ne savez pas décrire, arrêtez-vous : c’est précisément le flux par lequel l’incident arrivera. Décomposez, ou interdisez.
:::

## Mise en pratique

Rédigez votre matrice. Comptez les lignes : un périmètre bien conçu en a rarement plus de quinze. Au-delà, revenez à la leçon 3 : votre périmètre est trop large. Faites signer la matrice par le responsable du périmètre et le responsable sécurité : c’est un engagement, pas une note technique.

## Checklist

- [ ] La matrice commence par « tout flux non listé est interdit »
- [ ] Chaque flux a un contrôle, un journal, un propriétaire en poste et une date de revue
- [ ] Les flux sortants sont aussi détaillés que les entrants
- [ ] La matrice est signée

```quiz
[
  {"q":"Que doit-il arriver à un flux dont la date de revue est dépassée ?","choices":["Rien, il reste autorisé","Il est suspendu jusqu’à revue","Il est supprimé définitivement","Il est signalé à la direction"],"answer":1,"explain":"La suspension automatique à la date de revue est ce qui empêche les exceptions temporaires de devenir permanentes."},
  {"q":"Pourquoi chaque flux doit-il avoir un journal ?","choices":["Pour la facturation","Pour prouver qu’un flux a eu lieu et donc qu’un autre n’a pas eu lieu","Pour mesurer le débit","Pour la conformité RGPD"],"answer":1,"explain":"Sans journal des flux autorisés, aucun écart n’est démontrable."}
]
```
