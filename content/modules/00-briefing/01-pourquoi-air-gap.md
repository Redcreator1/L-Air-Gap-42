---
minutes: 18
---

Vous avez déjà entendu la phrase. Peut-être l’avez-vous prononcée : *« Ce réseau n’est pas connecté, il n’y a pas de risque. »*

Cette leçon a un seul but : vous convaincre que l’air gap est à la fois **la mesure de sécurité la plus puissante dont vous disposez** et **la plus mal exploitée**. Les deux affirmations sont vraies en même temps, et c’est précisément l’écart entre les deux que ce programme comble.

## Ce que vous saurez faire à la fin

- Expliquer en une phrase pourquoi l’isolation physique change la nature d’un risque plutôt que de le réduire.
- Distinguer les trois promesses de l’air gap (confidentialité, intégrité, disponibilité) et savoir laquelle est réellement tenue.
- Reconnaître les quatre signaux qu’un air gap est en train de se dégrader silencieusement.

## L’air gap change la nature du risque, pas seulement son niveau

Un pare-feu réduit une probabilité. Un air gap supprime une *classe entière* de scénarios : l’attaque distante opportuniste. Le ransomware qui balaie Internet à la recherche d’un port RDP ouvert ne vous trouvera jamais. Le scanner qui teste une CVE fraîchement publiée sur des milliers d’adresses IP ne vous atteindra pas.

C’est énorme, et c’est mécanique : une attaque distante suppose un chemin réseau. Retirer ce chemin, c’est retirer l’attaquant automatisé, l’attaquant pressé, l’attaquant qui n’a pas de raison particulière de s’intéresser à *vous*.

Ce qui reste, c’est l’attaquant qui a une raison. Et celui-là ne passe pas par le câble que vous avez retiré. Il passe par la clé USB, le prestataire, la mise à jour, la personne. Le risque n’a pas disparu : il a changé de forme, et il exige d’autres défenses que celles que vous avez l’habitude de déployer.

:::note À retenir
L’air gap déplace le champ de bataille du réseau vers les **processus** et les **personnes**. Si votre budget sécurité reste concentré sur le réseau, vous défendez un front que l’adversaire a déjà quitté.
:::

## Les trois promesses, et celle qui est vraiment tenue

| Promesse | Ce que l’air gap apporte | Ce qu’il n’apporte pas |
| --- | --- | --- |
| Confidentialité | Pas d’exfiltration réseau en continu | Rien contre l’exfiltration par média, par personne, par canal caché |
| Intégrité | Pas de modification à distance | Rien contre le code malveillant importé lors d’une mise à jour ou d’une intervention |
| Disponibilité | Pas de déni de service réseau externe | Rien contre une panne interne, une erreur humaine, un sabotage |

La promesse la mieux tenue est la **disponibilité face aux menaces externes**. C’est d’ailleurs pour cela que les systèmes industriels, hospitaliers ou militaires choisissent l’isolation : la continuité prime.

La promesse la plus fragile est l’**intégrité**. Tout ce que votre système isolé exécute a été importé un jour. Par qui ? Vérifié comment ? Cette question sera le fil rouge du module 3.

## Quatre signaux d’un air gap qui se dégrade

Un air gap ne casse presque jamais d’un coup. Il s’érode. Voici quatre signes avant-coureurs à chercher chez vous :

1. **Les exceptions ont une durée de vie infinie.** Un accès temporaire accordé « pour la migration » il y a trois ans est toujours actif. Personne ne sait plus qui l’a demandé.
2. **Le nombre de médias amovibles n’est pas connu.** Si vous ne pouvez pas répondre à « combien de clés USB ont été insérées le mois dernier ? », vous n’avez pas d’air gap, vous avez une convention.
3. **Les prestataires viennent avec leur propre matériel.** Un laptop de maintenance qui a vu dix autres sites avant le vôtre est un pont ambulant.
4. **Le schéma réseau date du projet initial.** L’écart entre le schéma et la réalité est proportionnel au temps écoulé depuis sa dernière mise à jour.

Si vous cochez au moins deux de ces cases, ce programme est fait pour vous. Si vous n’en cochez aucune, vérifiez : les leçons 2 et 3 de ce briefing vous donneront de quoi le faire honnêtement.

## Ce que ce programme n’est pas

Soyons clairs, parce que cela conditionne la confiance que vous pouvez accorder à ce qui suit :

- Ce n’est **pas** un cours de techniques offensives. Nous décrivons les catégories de menaces pour concevoir des défenses, pas pour les reproduire.
- Ce n’est **pas** un catalogue de produits. Aucun fabricant de diodes ou de kiosques ne finance ce contenu. Quand nous citons une catégorie d’équipement, nous en donnons les limites.
- Ce n’est **pas** une préparation à une certification. Mais vous y trouverez les correspondances avec IEC 62443, ISO 27001 et NIS2, parce que vous devrez les démontrer un jour.

## Mise en pratique (10 minutes)

Prenez une feuille. Répondez, sans consulter de document, à ces trois questions sur le système isolé que vous connaissez le mieux :

- Quand a-t-il été mis à jour pour la dernière fois, et comment le média de mise à jour est-il arrivé jusqu’à lui ?
- Combien de personnes différentes y ont eu un accès physique ou logique dans les 90 derniers jours ?
- Où est le schéma qui décrit ses interfaces, et à quelle date a-t-il été validé ?

Gardez cette feuille. Vous la comparerez à la réalité dans la leçon 3, et vous mesurerez l’écart. Cet écart, c’est votre point de départ.

## Le cas SITE 42

SITE 42 est une station de traitement d'eau potable. Son registre des systèmes, révision du 02/03, décrit ce qui est censé rester isolé.

```
SITE 42 - registre des systemes (extrait)

systeme             interfaces declarees        sort du perimetre ?
------------------  --------------------------  -------------------
plc-filtration-01   eth0, serie -> modem RTC    oui, ligne telephonique
plc-chloration-02   eth0                        non
scada-serveur-01    eth0, eth1 (zone 3)         oui, vers la DMZ
hist-donnees-01     eth0, wlan0 (desactive)     oui si wlan0 revient
```

```epreuve
{
  "enonce": "Un seul de ces quatre systèmes n'a aucune interface capable de sortir du périmètre isolé — ni aujourd'hui, ni après une simple erreur de configuration. Donnez son nom.",
  "reponse": "plc-chloration-02",
  "indice": "« Désactivé » n'est pas « absent ». Une interface qui existe est un chemin."
}
```
