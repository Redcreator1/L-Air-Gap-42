---
minutes: 22
---

Sans annuaire central, sans fournisseur d’identité en ligne, comment gérer comptes, mots de passe, certificats et secrets dans un périmètre isolé ? Mal, en général : comptes partagés, mots de passe sur post-it, certificats expirés. Cette leçon propose une organisation tenable.

## Objectifs

- Décider entre annuaire local dédié et comptes locaux gérés.
- Organiser la gestion des secrets hors-ligne : coffre, rotation, dépôt sous scellé.
- Gérer les certificats sans accès aux autorités en ligne.

## Le pont d’identité

Première règle : **aucune identité ne doit exister des deux côtés de l’isolation.** Un annuaire d’entreprise étendu au périmètre isolé (réplique, relation d’approbation, même par diode) importe chaque compromission de compte. L’identité du périmètre est locale, point.

## Deux organisations possibles

| Option | Quand | Avantages | Contraintes |
| --- | --- | --- | --- |
| Annuaire local dédié | Plus de ~15 actifs ou ~10 utilisateurs | Comptes nominatifs, politiques centralisées, journal | Un serveur de plus à durcir, sauvegarder, administrer par sas |
| Comptes locaux gérés | Petit périmètre | Simplicité, pas de dépendance | Rotation manuelle, risque de divergence, comptes partagés tentants |

Dans les deux cas, chaque compte est nominatif. Les comptes de service ont un propriétaire humain. Les comptes fabricant par défaut sont désactivés ou, à défaut, leur mot de passe changé et consigné.

## Les secrets

- Un **coffre hors-ligne** (gestionnaire de mots de passe sur poste isolé, base chiffrée) détenu par l’exploitation, avec une copie sous scellé physique dans un coffre-fort, ouverture à deux personnes.
- **Rotation** à chaque départ d’une personne ayant eu accès, et au minimum annuelle pour les comptes à privilèges.
- **Comptes de bris de glace** : identifiants de secours sous enveloppe scellée, dont l’ouverture est journalisée et déclenche une rotation.

## Les certificats

Une autorité de certification interne au périmètre, hors-ligne, avec une racine sous scellé et une autorité émettrice sur un poste dédié. Durées de vie longues (les renouvellements se font par sas), inventaire des dates d’expiration dans le registre d’hypothèses (« H9 : aucun certificat n’expire dans les 90 jours »).

:::tip La revue trimestrielle
Un périmètre isolé ne reçoit pas les alertes de départ RH automatiquement. Instituez une revue trimestrielle : liste des comptes contre liste du personnel habilité, signée par le responsable du périmètre. C’est la mesure de sécurité la plus efficace de cette leçon, et elle ne coûte qu’une heure.
:::

## Mise en pratique

Inventoriez les comptes du périmètre. Marquez : nominatif / partagé / fabricant par défaut / service sans propriétaire. Chaque compte hors « nominatif » est une action. Planifiez la première revue trimestrielle.

## Checklist

- [ ] Aucune identité commune aux deux côtés de l’isolation
- [ ] Tous les comptes sont nominatifs ou ont un propriétaire nommé
- [ ] Coffre hors-ligne avec copie sous scellé et ouverture à deux
- [ ] Revue trimestrielle des comptes signée

```quiz
[
  {"q":"Une réplique en lecture seule de l’annuaire d’entreprise dans le périmètre isolé :","choices":["Est une bonne pratique","Crée un pont d’identité","Est sans risque via diode","Est exigée par ISO 27001"],"answer":1,"explain":"Chaque compromission de compte d’entreprise devient valable dans le périmètre, sans réseau."},
  {"q":"Mesure la plus rentable pour l’identité hors-ligne ?","choices":["Un HSM","La revue trimestrielle des comptes contre le personnel habilité","Des mots de passe de 24 caractères","La biométrie"],"answer":1,"explain":"Sans alerte RH automatique, seule une revue périodique détecte les comptes orphelins."}
]
```
