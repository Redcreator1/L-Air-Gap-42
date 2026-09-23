---
minutes: 26
---

Le pont non documenté est la menace n° 1 d’un air gap. Cette leçon organise sa **détection active** : radio, USB, réseau fantôme, et les liens qui n’apparaissent sur aucun schéma.

## Objectifs

- Mettre en place trois campagnes de détection : spectre radio, périphériques, topologie.
- Définir la fréquence et la méthode pour que le résultat soit une preuve (registre d’hypothèses).
- Traiter une découverte : qualification, retrait, rapport.

## Détection radio

Objectif : prouver H2 (aucune radio active). Méthode : balayage avec un analyseur de spectre portable sur les bandes usuelles (Wi-Fi, Bluetooth, cellulaire, ISM sub-GHz), armoire par armoire, avec le périmètre en fonctionnement normal. Complétée par une **inspection visuelle** (antennes, modules, cartes) et une **revue de configuration** (BIOS, gestionnaire de périphériques, firmware des équipements industriels).

Ce que vous trouverez typiquement : le module cellulaire du fabricant (leçon 2 du briefing), le Bluetooth d’un onduleur, le Wi-Fi d’une imprimante, le point d’accès « temporaire » d’un prestataire. Fréquence : semestrielle, et après toute intervention lourde.

## Détection de périphériques

Objectif : prouver H3 et H4. Méthode : baseline des périphériques (leçon précédente) en continu, plus une **inspection physique** des ports : scellés intacts, aucun adaptateur ni dongle inconnu, aucun périphérique intercalé entre clavier et poste. Fréquence : scellés mensuellement, inspection complète trimestrielle.

Le rapprochement journal du sas / insertions détectées (taux de conformité, module 3) fait partie de cette campagne.

## Détection de topologie

Objectif : prouver H1 (aucun lien filaire vers l’extérieur). Trois méthodes complémentaires :

1. **Suivi physique** de chaque câble du périmètre jusqu’à son extrémité. Fastidieux, irremplaçable. Annuel.
2. **Tables des switchs** : chaque port actif correspond à un actif inventorié. Continu.
3. **Test de fuite** : depuis un poste du périmètre, tenter d’atteindre une adresse de la DMZ et une adresse Internet (par un poste de test dédié, sous contrôle, avec autorisation écrite). Un succès est un pont. Trimestriel.

Du côté extérieur, la DMZ et le réseau d’entreprise peuvent aussi chercher le périmètre : une adresse du périmètre qui répond depuis l’extérieur est un pont.

| Campagne | Hypothèse | Fréquence | Livrable |
| --- | --- | --- | --- |
| Radio | H2 | Semestrielle | Rapport de balayage daté, par armoire |
| Périphériques | H3, H4 | Continue + trimestrielle | Baseline, état des scellés, taux de conformité |
| Topologie | H1 | Annuelle + trimestrielle + continue | Plan de câblage vérifié, test de fuite |

## Traiter une découverte

1. **Ne pas débrancher immédiatement** si l’équipement est en production : qualifier d’abord (qu’est-ce que c’est, depuis quand, qui l’a installé, que fait-il).
2. Documenter : photo, position, configuration.
3. Décider avec le responsable du périmètre : retrait, avec plan de continuité si nécessaire.
4. Rechercher les traces d’usage (journaux, connexions) : le pont a-t-il servi ?
5. Rapport d’incident, mise à jour du schéma et du registre.

:::warning Le pont qui sert
Un pont découvert qui a servi (des connexions dans les journaux) n’est pas un défaut de configuration : c’est une compromission potentielle du périmètre. Le playbook de réponse (leçon 26) s’applique.
:::

## Mise en pratique

Planifiez la première campagne radio et le premier test de fuite. Consignez la méthode dans le registre d’hypothèses. Préparez le formulaire de découverte.

## Checklist

- [ ] Trois campagnes planifiées avec fréquence et méthode consignées
- [ ] Taux de conformité sas / insertions mesuré
- [ ] Formulaire et procédure de traitement d’une découverte
- [ ] Un pont qui a servi déclenche le playbook de réponse

## Le cas SITE 42

La campagne de détection de ponts menée sur SITE 42 le 14/09.

```
SITE 42 - campagne de detection de ponts, 14/09

controle                          resultat
--------------------------------  ------------------------------
balayage radio 2,4 et 5 GHz       1 SSID masque, puissance stable
inventaire des ports USB montes   conforme
table ARP des automates           1 adresse hors plage
releve des armoires               conforme

Plan d adressage de la zone isolee : 10.42.0.0/16
Adresses vues dans la table ARP : 10.42.1.11, 10.42.2.22, 10.99.0.10
```

```epreuve
{
  "enonce": "Le pont non documenté est la menace numéro un d'un air gap. Donnez l'adresse vue dans la table ARP qui n'appartient pas au plan d'adressage de la zone isolée.",
  "reponse": "10.99.0.10",
  "indice": "Comparez chaque adresse au préfixe déclaré."
}
```
