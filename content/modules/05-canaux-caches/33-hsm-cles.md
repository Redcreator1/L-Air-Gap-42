---
minutes: 22
---

Un périmètre isolé finit toujours par gérer des clés : autorité de certification interne, signature de vos propres images et programmes, chiffrement des sauvegardes, coffre de secrets. Sans service de gestion de clés en ligne, la question est : où vivent les clés privées, et qui peut les utiliser ?

## Objectifs

- Décider du niveau de protection des clés selon leur usage : logiciel, jeton matériel, HSM.
- Organiser les cérémonies de clés hors-ligne : génération, sauvegarde, rotation, révocation.
- Éviter les deux erreurs classiques : la clé racine sur un poste ordinaire, et le HSM sans procédure.

## Trois niveaux

| Niveau | Support | Pour | Limites |
| --- | --- | --- | --- |
| Logiciel | Fichier chiffré sur poste dédié | Clés de faible enjeu, court terme | La clé est extractible par qui contrôle le poste |
| Jeton matériel | Clé USB cryptographique, carte à puce | Clés d’autorité émettrice, signature d’images, identités d’administrateurs | Débit limité, gestion des jetons |
| HSM | Boîtier certifié, clés non extractibles, contrôle d’accès à quorum | Racine de l’autorité, clés de signature de production, chiffrement de sauvegardes à long terme | Coût, procédures lourdes, un HSM sans procédure est un HSM mal utilisé |

Règle pratique : la **clé racine** de votre autorité interne est générée sur un HSM ou, à défaut, sur un poste dédié jamais connecté à rien, et stockée hors ligne sous scellé (sauvegarde chiffrée, quorum de deux ou trois personnes). L’**autorité émettrice**, qui travaille au quotidien, est sur un jeton matériel ou un HSM en service. Les **clés d’usage** (serveurs, identités) sont logicielles avec durée de vie courte.

## Cérémonies

Une cérémonie de clés est une procédure écrite, exécutée par plusieurs personnes, avec témoin et procès-verbal, pour toute opération sensible :

- **Génération** de la racine : environnement isolé, matériel neuf ou réinitialisé, aléa vérifié, sauvegardes en parts (partage de secret) distribuées à des détenteurs distincts, scellés, PV signé.
- **Sauvegarde / restauration** : test de restauration à blanc annuel (comme les sauvegardes, module 3).
- **Rotation** : durée de vie planifiée, renouvellement avant expiration ; le calendrier est dans le registre d’hypothèses.
- **Révocation** : liste de révocation distribuée dans le périmètre par le sas ; procédure de compromission d’une clé (qui décide, quoi révoquer, quoi réémettre).

## Ce que le HSM change pour l’isolation

Un HSM rend la clé **non extractible** : un initié ou un code malveillant peut utiliser la clé pendant qu’il contrôle le poste, mais ne peut pas la copier pour l’emporter. C’est une protection contre la sortie de secrets, cohérente avec la logique de l’air gap. Il ne protège pas contre l’usage abusif pendant la compromission : d’où la journalisation des opérations de signature et le quorum pour les opérations rares.

:::warning La clé de signature des programmes automates
Si vous signez vos programmes automates (bonne pratique pour vérifier l’intégrité du cœur), la clé de signature devient l’actif le plus critique du périmètre : qui la contrôle contrôle le procédé. Jeton ou HSM, quorum, journal.
:::

## Mise en pratique

Inventoriez les clés privées du périmètre : où sont-elles, sur quel support, qui y accède, quand expirent-elles. Classez par niveau. Planifiez la cérémonie qui manque le plus (souvent : la sauvegarde de la racine sous scellé avec quorum).

## Checklist

- [ ] Inventaire des clés avec support, accès, expiration
- [ ] Racine hors ligne sous scellé avec quorum, émettrice sur jeton ou HSM
- [ ] Cérémonies écrites : génération, sauvegarde, rotation, révocation
- [ ] Opérations de signature journalisées

## Le cas SITE 42

Les secrets que SITE 42 doit gérer sans service en ligne, et où ils dorment.

```
SITE 42 - secrets de la zone isolee

code  secret                          stockage            rotation
----  ------------------------------  ------------------  --------
x1    autorite de certification       hsm en salle forte  3 ans
x2    cle de signature des images     hsm en salle forte  2 ans
x3    cle de chiffrement sauvegardes  fichier sur scada   jamais
x4    secrets de conduite             coffre hors ligne   annuelle
```

```epreuve
{
  "enonce": "Un secret stocké en clair sur la machine même qu'il protège n'est pas un secret. Donnez son code.",
  "reponse": "x3",
  "indice": "Trois lignes citent un coffre ou un HSM."
}
```
