---
minutes: 26
---

La diode de données est l’équipement emblématique de l’isolation. Elle mérite une leçon entière, parce qu’elle est à la fois indispensable et régulièrement mal comprise : mal placée, mal exploitée, ou remplacée par un produit qui n’en est pas une.

## Objectifs

- Comprendre le principe physique et ce qu’il garantit exactement.
- Distinguer diode matérielle, passerelle unidirectionnelle logicielle et « pare-feu unidirectionnel ».
- Concevoir l’intégration : protocoles, intégrité, supervision, panne.

## Le principe

Une diode matérielle sépare l’émission et la réception sur deux équipements distincts, reliés par un support (souvent optique) qui ne possède physiquement qu’un émetteur d’un côté et qu’un récepteur de l’autre. Il n’existe aucun composant capable de transmettre dans l’autre sens. Ce n’est pas une configuration : c’est une absence de matériel.

Ce que cela garantit : **aucune donnée ne remonte**. Ce que cela ne garantit pas : que ce qui descend est sain, ni que le récepteur ne sera pas saturé, ni que les données arrivent (pas d’acquittement possible).

## Les trois familles

| Famille | Garantie | Cas d’usage | Attention |
| --- | --- | --- | --- |
| Diode matérielle | Physique | Sortie de données du cœur isolé | Coût, protocoles limités, pas d’acquittement |
| Passerelle unidirectionnelle logicielle | Logique renforcée (deux machines, proxy, pas de route retour) | Environnements à moindre exigence | Reste une isolation logique : dites-le |
| « Pare-feu unidirectionnel » | Configuration | Aucun pour un périmètre isolé | Un pare-feu avec une règle n’est pas une diode |

## Concevoir l’intégration

**Protocoles.** Sans acquittement, TCP est impossible tel quel. Les diodes fonctionnent avec des proxys de chaque côté : le côté émetteur termine la connexion TCP source, envoie en UDP ou en flux propriétaire, le côté récepteur rejoue vers la destination. Chaque protocole supporté est un proxy à valider.

**Intégrité.** Sans retour, une perte de paquet n’est pas signalée. Utilisez la redondance (envoi multiple), les sommes de contrôle par bloc, et un **compteur de séquence** exposé des deux côtés : c’est votre supervision.

**Supervision.** Comparez régulièrement compteur émis et compteur reçu. Un écart croissant révèle une saturation ou une panne. Cet indicateur va dans votre plan de détection (module 4).

**Panne.** Une diode en panne coupe la sortie de données. Prévoyez : que fait l’entreprise sans les données pendant 48 h ? Si la réponse est « on branche un câble », votre architecture a une exception prévue. Prévoyez plutôt un média de secours par le sas, avec procédure.

:::warning La diode dans le mauvais sens
On voit des diodes installées en *entrée* pour « pousser des mises à jour vers le périmètre isolé ». C’est possible, mais cela signifie qu’un flux entrant sans validation humaine existe. C’est un choix d’architecture lourd, à réserver aux cas où le sas (module 3) est inapplicable, et à documenter comme un flux entrant automatisé avec quarantaine côté réception.
:::

## Mise en pratique

Pour chaque flux sortant de votre matrice, décidez : diode, ou sas. Si diode : quels protocoles, quel compteur, quelle procédure de panne. Ajoutez le compteur à votre registre d’hypothèses (« H8 : la diode transmet sans perte », méthode : comparaison des compteurs).

## Checklist

- [ ] Le sens interdit est physiquement impossible, pas configuré
- [ ] Chaque protocole traversant est un proxy validé
- [ ] Un compteur de séquence est supervisé des deux côtés
- [ ] La procédure de panne n’implique aucun câble

```quiz
[
  {"q":"Ce qu’une diode matérielle garantit :","choices":["Que les données arrivent","Que rien ne remonte","Que les données sont saines","Que le récepteur n’est pas saturé"],"answer":1,"explain":"L’absence physique d’émetteur côté réception interdit tout retour ; le reste relève de la conception autour."},
  {"q":"Pourquoi TCP ne traverse-t-il pas une diode tel quel ?","choices":["Débit insuffisant","Il nécessite des acquittements dans le sens interdit","Il n’est pas chiffré","Question de licence"],"answer":1,"explain":"Les proxys de chaque côté terminent et rejouent les connexions ; entre les deux, le flux est sans retour."}
]
```
