---
minutes: 26
---

Le firmware est la couche sous le système d’exploitation : UEFI, contrôleurs, cartes réseau, disques. Un code malveillant qui s’y installe survit à une réinstallation complète, et votre image maîtresse ne le voit pas. Cette leçon organise le durcissement firmware avec les outils disponibles sur du matériel courant.

## Objectifs

- Comprendre la chaîne de démarrage et ce que Secure Boot, TPM et démarrage mesuré garantissent.
- Configurer et **verrouiller** le firmware des postes et serveurs du périmètre.
- Inventorier et vérifier les firmwares, y compris ceux des équipements industriels.

## La chaîne de démarrage

Firmware UEFI → chargeur de démarrage → noyau → système. Chaque maillon peut vérifier le suivant (Secure Boot) et/ou le mesurer dans le TPM (démarrage mesuré). La confiance remonte au firmware lui-même, qui doit donc être protégé en écriture et vérifié.

| Mécanisme | Garantit | Ne garantit pas |
| --- | --- | --- |
| Secure Boot | Seuls des composants signés par une clé de confiance démarrent | Que le firmware lui-même est intact ; que les clés de confiance sont les bonnes |
| Démarrage mesuré (TPM) | Une empreinte de chaque maillon est enregistrée et peut être attestée | Bloquer un démarrage altéré (il le rend détectable) |
| Protection en écriture du firmware | Le firmware ne peut être modifié sans mot de passe / sans intervention physique | Contre un attaquant disposant du mot de passe ou d’un accès physique long |
| Mot de passe firmware | Personne ne modifie la configuration | Contre la réinitialisation matérielle (cavalier, pile) |

## Configurer et verrouiller

Pour chaque poste et serveur du périmètre :

1. **Mettre à jour** le firmware à une version vérifiée (module 3), consigner version et hachage.
2. **Activer Secure Boot** avec vos propres clés si le système le permet, ou au minimum avec les clés constructeur, en retirant les clés non nécessaires.
3. **Activer le TPM** et le démarrage mesuré ; enregistrer les empreintes de référence.
4. **Désactiver** dans le firmware : démarrage sur USB / réseau / optique, interfaces non nécessaires (radio, ports), contrôleurs non utilisés.
5. **Mot de passe** firmware, distinct par machine, dans le coffre hors-ligne (module 2, leçon 13).
6. **Protection physique** : châssis scellé, détection d’ouverture activée si disponible.
7. **Consigner** une capture de la configuration (photos ou export) comme référence.

## Vérifier

- Comparer périodiquement les empreintes TPM aux références : un écart signale une modification de la chaîne de démarrage. C’est une baseline de plus (module 4).
- Vérifier la version de firmware à chaque inventaire.
- Vérifier l’intégrité des scellés.

## Les équipements industriels

Automates, variateurs, passerelles : le firmware est souvent le seul niveau logiciel, et les mécanismes ci-dessus sont rares. Ce qu’on peut faire : verrouillage physique du mode de programmation (commutateur à clé), mot de passe de téléchargement, journalisation des changements de programme, comparaison périodique du programme chargé avec la version de référence (hachage), et exigences contractuelles de signature du firmware pour les prochains achats.

:::note Le firmware des périphériques
Cartes réseau, contrôleurs de disque, clés USB : ils ont un firmware, rarement vérifiable. La réponse est en amont (supply chain, module 3, leçon 20) et dans la réduction : moins de périphériques, tous d’origine contrôlée.
:::

## Mise en pratique

Prenez un poste d’ingénierie. Appliquez les sept étapes. Chronométrez : c’est le coût unitaire de votre plan de durcissement (leçon 35). Enregistrez les empreintes de référence.

## Checklist

- [ ] Firmware à jour, version et hachage consignés
- [ ] Secure Boot et démarrage mesuré actifs, empreintes de référence enregistrées
- [ ] Démarrage externe et interfaces inutiles désactivés, mot de passe firmware en coffre
- [ ] Châssis scellés ; programmes automates vérifiés contre référence

```quiz
[
  {"q":"Ce que Secure Boot ne garantit pas :","choices":["Que le chargeur est signé","Que le firmware lui-même est intact","Que le noyau est signé","Que les pilotes sont signés"],"answer":1,"explain":"Secure Boot vérifie ce qui vient après le firmware ; la protection du firmware repose sur son verrouillage en écriture et sa vérification."},
  {"q":"Pourquoi un code malveillant dans le firmware est-il particulièrement dangereux pour un air gap ?","choices":["Il se propage par réseau","Il survit à la réinstallation depuis l’image maîtresse","Il désactive le TPM","Il est toujours détecté"],"answer":1,"explain":"La réinstallation, réponse standard à une compromission, ne touche pas le firmware."}
]
```
