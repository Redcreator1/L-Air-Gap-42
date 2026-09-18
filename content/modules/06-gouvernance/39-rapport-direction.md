---
minutes: 22
---

Vous avez le modèle, le schéma, les plans, le score. La direction a dix minutes. Cette leçon vous apprend à écrire le rapport qu’elle lira, et qui débouche sur une décision : budget, arbitrage, acceptation de risque explicite.

## Objectifs

- Structurer le rapport en cinq blocs, une page, avec un langage de risque et de coût.
- Formuler des demandes de décision, pas des recommandations.
- Anticiper les trois objections classiques.

## Le langage

La direction ne raisonne pas en hypothèses d’isolation ; elle raisonne en **conséquences, probabilités, coûts et responsabilités**. Traduisez :

| Vous dites | Elle entend | Dites plutôt |
| --- | --- | --- |
| « H2 non vérifiée » | Rien | « Nous ne pouvons pas prouver l’absence de connexion sans fil dans la salle de supervision. » |
| « Taux de conformité sas 71 % » | Un chiffre | « Trois insertions de média sur dix échappent à notre contrôle. Chacune peut arrêter la ligne 2 pour plusieurs jours. » |
| « Allowlisting recommandé » | Un projet informatique | « Pour dix jours de travail interne, le code inconnu ne peut plus s’exécuter sur les postes qui programment les automates. » |
| « Risque résiduel canaux cachés accepté » | Un aveu | « Nous proposons d’accepter formellement un risque à faible probabilité, dont le traitement coûterait X sans réduire nos risques principaux. » |

## Les cinq blocs

**1. Situation (3 lignes).** Ce qui est isolé, pourquoi, score d’isolation actuel, en une phrase : « Le réseau de supervision de l’unité 3, dont dépend la production de la ligne 2, est isolé à 61/100 : l’isolation est réelle sur le réseau mais contournée par les transferts de médias. »

**2. Les trois risques (une ligne chacun).** Formulés en conséquence : « Un média non contrôlé introduit un code qui arrête la ligne 2 : probabilité élevée (3 insertions sur 10 hors sas), conséquence : X jours d’arrêt, Y k€. »

**3. Ce qui a été fait (3 lignes).** Les livrables des 42 jours, en termes de résultats : « Périmètre réduit de 40 %, matrice des flux signée, sas opérationnel, premières baselines. »

**4. Décisions demandées (3 à 5 lignes).** Chacune avec coût, délai, et ce qu’elle change sur un risque du bloc 2. « Décision 1 : allouer 10 jours d’ingénierie sur 30 jours pour l’allowlisting des postes d’ingénierie ; ramène le risque 1 de élevé à faible. » « Décision 3 : accepter formellement le risque résiduel canaux cachés (signature). »

**5. Ce qui se passe sans décision (2 lignes).** Sans dramatiser : « Sans décision 1, la probabilité du risque 1 reste élevée ; en cas d’incident, l’obligation de notification NIS2 s’appliquera et l’absence de contrôle des médias sera documentée. »

## Les trois objections

**« On n’a jamais eu d’incident. »** Réponse : « Nous n’avions pas non plus de moyen de le voir. Depuis les baselines, nous avons détecté N écarts en M semaines. » Les preuves négatives datées et le taux de conformité sont vos chiffres.

**« C’est isolé, donc c’est sûr. »** Réponse : les six ponts du briefing, en une phrase chacun, avec celui que vous avez trouvé chez vous.

**« Combien ça coûte de ne rien faire ? »** Réponse : le bloc 5, et le coût d’un arrêt de production que vous avez chiffré avec le responsable du procédé.

:::tip Une demande, pas une recommandation
« Nous recommandons » laisse la direction libre de ne pas répondre. « Nous demandons la décision suivante, d’ici telle date » oblige à un oui, un non, ou un arbitrage. Les trois sont des résultats. Le silence n’en est pas un.
:::

## Mise en pratique

Rédigez votre rapport en une page. Faites-le lire à quelqu’un hors sécurité : s’il ne peut pas reformuler les trois risques et les décisions demandées, réécrivez.

## Checklist

- [ ] Une page, cinq blocs, langage de conséquence et de coût
- [ ] Trois risques formulés avec probabilité et conséquence chiffrée
- [ ] Décisions demandées avec coût, délai, effet sur un risque
- [ ] Objections anticipées avec chiffres

```quiz
[
  {"q":"Différence entre une recommandation et une demande de décision ?","choices":["Le ton","La demande oblige à un oui, un non ou un arbitrage d’ici une date","La recommandation est plus professionnelle","Aucune"],"answer":1,"explain":"Une demande datée transforme le rapport en événement de décision ; une recommandation peut rester sans réponse."},
  {"q":"Réponse à « on n’a jamais eu d’incident » ?","choices":["C’est vrai, mais le risque existe","Nous n’avions pas de moyen de le voir ; voici ce que nous détectons depuis les baselines","Les statistiques du secteur","Un scénario catastrophe"],"answer":1,"explain":"Les écarts détectés depuis la mise en place de la visibilité sont l’argument factuel."}
]
```
