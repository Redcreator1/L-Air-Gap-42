---
minutes: 24
---

La DMZ industrielle est l’endroit où les données quittent le périmètre pour devenir utilisables par l’entreprise. Bien conçue, elle est le meilleur allié de l’isolation : elle absorbe toutes les demandes d’accès. Mal conçue, elle devient le pont que tout le monde emprunte.

## Objectifs

- Définir le rôle exact de la DMZ vis-à-vis d’un périmètre isolé.
- Appliquer les cinq règles qui l’empêchent de devenir un pont.
- Positionner les services de substitution (leçon 3 du module 1) dans la DMZ.

## Le rôle : terminer les flux, jamais les relayer

Une DMZ industrielle **termine** les flux venant du périmètre isolé (elle reçoit les données de la diode) et **sert** l’entreprise (elle expose des rapports, des historiques, des API). Elle ne relaie jamais un flux de l’entreprise vers le périmètre. Si un flux traverse la DMZ dans le sens entrant, ce n’est plus une DMZ : c’est un routeur.

## Les cinq règles

1. **Aucun protocole ne traverse.** Les données changent de forme dans la DMZ : le protocole industriel s’arrête à la réplique, le protocole d’entreprise commence au serveur de rapports. Un même protocole des deux côtés est le signe d’un relais.
2. **Aucun compte partagé.** Les identités de la DMZ n’existent pas dans le périmètre isolé et réciproquement. Un compte valable des deux côtés est un pont d’identité (leçon 13).
3. **Aucune administration depuis l’entreprise vers la DMZ sans sas.** L’administration de la DMZ passe par un poste dédié, sinon la DMZ hérite de tous les risques du réseau bureautique.
4. **Aucun stockage partagé.** Pas de partage de fichiers monté des deux côtés. Les données transitent par la diode ou par le sas, jamais par un volume commun.
5. **Journal exhaustif et exporté.** Tout accès à la DMZ est journalisé vers le SIEM d’entreprise. La DMZ est le point d’observation idéal : c’est là qu’on verra les tentatives d’atteindre le périmètre.

| Service en DMZ | Remplace, dans le périmètre | Alimenté par |
| --- | --- | --- |
| Historian réplique | Accès direct à l’historian | Diode |
| Serveur de rapports | Postes de supervision consultés par l’entreprise | Réplique |
| Dépôt de mises à jour miroir (entrant) | Téléchargement direct | Sas + quarantaine (module 3) |
| Serveur de journaux | Consultation locale | Diode |

:::tip La DMZ comme aimant
Chaque demande « j’ai besoin d’accéder au réseau isolé » doit recevoir la réponse « qu’est-ce qui, dans la DMZ, te le fournirait ? ». Neuf fois sur dix, la réponse existe ou se construit en une semaine. La dixième fois, vous avez identifié un vrai besoin d’accès, à traiter en leçon 12.
:::

## Mise en pratique

Listez les services de votre DMZ (ou ceux qu’il faudrait créer). Pour chacun, vérifiez les cinq règles. Toute règle violée est une ligne de votre plan de remédiation.

## Checklist

- [ ] Aucun flux ne traverse la DMZ vers le périmètre
- [ ] Rupture de protocole à chaque traversée
- [ ] Identités, stockage et administration séparés
- [ ] Journaux de la DMZ exportés et surveillés

## Le cas SITE 42

Les quatre flux qui traversent la DMZ industrielle de SITE 42.

```
SITE 42 - flux traversant la DMZ

code  sens                                 rupture protocolaire ?
----  -----------------------------------  ----------------------
f1    z-conduite -> z-dmz (historisation)  oui, diode
f2    z-dmz -> z-bureau (rapports)         oui, relais applicatif
f3    z-bureau -> z-dmz (signatures)       oui, depot de fichiers
f4    z-bureau -> z-conduite (supervision) non, flux direct
```

```epreuve
{
  "enonce": "Une DMZ devient un pont dès qu'un flux la traverse sans rupture. Donnez le code du flux qui va de bout en bout sans en subir aucune.",
  "reponse": "f4",
  "indice": "Lisez la colonne de droite."
}
```
