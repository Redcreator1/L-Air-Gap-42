---
minutes: 26
---

« Nos systèmes sont isolés » n’est pas une réponse à un régulateur. C’est le début d’une question : *prouvez-le, montrez comment vous le surveillez, et dites-nous ce qui se passe quand ça casse.* Cette leçon parcourt ce que les grands cadres réglementaires européens et français demandent à un périmètre isolé, et comment vos livrables des modules 1 à 5 y répondent.

## Objectifs

- Situer votre organisation dans NIS2, la LPM (opérateurs d’importance vitale) et DORA (secteur financier).
- Traduire les exigences génériques en attentes concrètes pour un air gap.
- Constituer le dossier de preuves à partir de ce que vous avez déjà produit.

## Trois cadres, une logique commune

| Cadre | Qui | Ce qu’il attend | Délais clés |
| --- | --- | --- | --- |
| NIS2 (directive UE, transposée nationalement) | Entités essentielles et importantes de nombreux secteurs | Gestion des risques, sécurité de la chaîne d’approvisionnement, gestion des incidents, continuité, responsabilité de la direction | Notification d’incident significatif : alerte précoce sous 24 h, notification sous 72 h, rapport final sous un mois |
| LPM (France, OIV) | Opérateurs d’importance vitale, systèmes d’information d’importance vitale | Règles de sécurité homologuées, cartographie, journalisation, détection, déclaration d’incident, audits | Déclaration sans délai à l’autorité nationale |
| DORA (UE, finance) | Entités financières et leurs prestataires TIC critiques | Gestion du risque TIC, tests de résilience, gestion des tiers, notification d’incidents majeurs | Notification initiale sous quelques heures, rapports intermédiaire et final |

Ces cadres ne mentionnent pas l’air gap. Ils exigent une **gestion du risque démontrable**. L’isolation est un choix de traitement du risque, qui doit être documenté, surveillé, testé et rapporté comme n’importe quel autre.

## Ce que cela veut dire pour un périmètre isolé

**Gestion des risques.** Votre modèle de menace (module 1) et votre registre d’hypothèses sont l’analyse de risque. Ils doivent être datés, revus, approuvés par la direction. NIS2 rend la direction responsable : le modèle en une page est précisément le document qu’elle doit avoir lu et signé.

**Chaîne d’approvisionnement.** Le runbook de transfert, la vérification d’origine, la quarantaine, les clauses contractuelles avec les fabricants (modules 2 et 3) répondent directement aux exigences de sécurité de la chaîne d’approvisionnement, qui sont l’un des points les plus contrôlés.

**Détection et journalisation.** Le plan de détection (module 4), les baselines, les campagnes et les preuves négatives datées sont la démonstration attendue. La LPM en particulier attend une journalisation et une détection formalisées.

**Gestion des incidents et notification.** Le playbook (module 4) doit intégrer les délais de notification : qui qualifie « significatif » ou « majeur », qui notifie, avec quelles informations, sous quel délai. Un incident dans un périmètre isolé avec impact sur un service essentiel est notifiable. Ajoutez la phase « notification » à votre playbook avec les contacts et les modèles de déclaration.

**Tests.** DORA et la LPM attendent des tests : votre exercice sur table (module 4) et vos campagnes de détection en font partie. Consignez-les.

**Continuité.** Votre procédure de panne de diode, vos sauvegardes testées, votre retour arrière (modules 2 et 3) sont des éléments de continuité.

:::warning Le mythe de l’exemption
Aucun cadre n’exempte un système parce qu’il est isolé. Au contraire : un système isolé qui contribue à un service essentiel est un système d’importance, et l’isolation est une mesure qu’il faut **prouver** avec plus de rigueur, parce qu’elle porte davantage de la réduction du risque.
:::

## Mise en pratique

Déterminez sous quel(s) cadre(s) votre organisation tombe (juridique, DSI, ou votre autorité sectorielle). Ajoutez à votre playbook la phase de notification avec délais et contacts. Listez, pour chaque exigence du tableau, le livrable du programme qui y répond, et notez les trous.

## Checklist

- [ ] Cadre(s) applicable(s) identifié(s) avec l’autorité compétente
- [ ] Modèle de menace approuvé par la direction, daté, revu
- [ ] Phase de notification ajoutée au playbook avec délais et contacts
- [ ] Correspondance exigences → livrables établie, trous listés

```quiz
[
  {"q":"Que demande NIS2 concernant la direction ?","choices":["Rien de spécifique","Qu’elle approuve et supervise la gestion des risques, avec responsabilité","Qu’elle signe les factures","Qu’elle nomme un RSSI"],"answer":1,"explain":"La responsabilité de la direction est explicite ; le modèle de menace en une page est le document qu’elle doit connaître."},
  {"q":"Un incident dans un périmètre isolé contribuant à un service essentiel :","choices":["N’est pas notifiable, le système est isolé","Est notifiable selon les délais du cadre applicable","Est notifiable uniquement s’il y a eu exfiltration","Est notifiable après un mois"],"answer":1,"explain":"L’isolation n’exempte pas ; l’impact sur le service détermine la notification."}
]
```
