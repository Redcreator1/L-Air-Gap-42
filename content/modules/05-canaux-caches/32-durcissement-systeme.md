---
minutes: 24
---

Un périmètre isolé a un atout unique pour le durcissement système : **on sait exactement ce qui doit s’y exécuter**. Cette leçon exploite cet atout avec la mesure la plus efficace et la plus sous-utilisée : l’allowlisting d’exécution. Puis la réduction de surface, la configuration de référence et le contrôle de la dérive.

## Objectifs

- Mettre en œuvre l’allowlisting d’exécution en mode audit puis en mode bloquant.
- Réduire la surface : services, protocoles, comptes, périphériques.
- Maintenir une configuration de référence et détecter la dérive.

## Allowlisting d’exécution

Principe : seuls les exécutables, bibliothèques et scripts explicitement autorisés s’exécutent. Tout le reste est bloqué et journalisé. Dans un réseau d’entreprise, c’est un projet de plusieurs mois. Dans un périmètre isolé, où les applications sont peu nombreuses et stables, c’est un projet de quelques semaines, et c’est **la contre-mesure la plus efficace contre le média piégé et la mise à jour compromise** : le code inconnu ne s’exécute pas, quelle que soit la façon dont il est entré.

Démarche :

1. **Inventaire** : à partir de la baseline processus (module 4), lister ce qui s’exécute légitimement sur chaque type de poste.
2. **Règles** : par éditeur (signature) quand c’est possible, par hachage sinon, par chemin en dernier recours (et jamais un chemin inscriptible par l’utilisateur).
3. **Mode audit** pendant deux à quatre semaines : tout ce qui *aurait* été bloqué est journalisé. Chaque entrée est expliquée et ajoutée aux règles ou traitée comme suspecte.
4. **Mode bloquant**, poste par poste, en commençant par les moins critiques.
5. **Procédure de changement** : une nouvelle application ou mise à jour passe par le sas *et* par une mise à jour des règles, dans la même fenêtre.

Les outils existent nativement dans les systèmes d’exploitation courants ou en produits tiers. Le choix compte moins que la démarche.

## Réduction de surface

| Domaine | Action |
| --- | --- |
| Services | Désactiver tout service non nécessaire ; documenter les services actifs |
| Protocoles | Désactiver les protocoles anciens et la découverte automatique ; pare-feu local en liste blanche des conversations de la matrice |
| Comptes | Aucun compte administrateur local partagé ; élévation nominative et journalisée |
| Périphériques | Contrôle des classes de périphériques : seuls le stockage du parc dédié et les classes nécessaires sont autorisés (bloquer l’émulation clavier par les périphériques inconnus) |
| Applications | Supprimer ce qui n’est pas utilisé ; pas de navigateur ni de client de messagerie dans le périmètre |
| Macros et scripts | Interdits sauf exception signée |

## Configuration de référence et dérive

Chaque type de poste a une **image maîtresse** (module 3) et une **configuration de référence** documentée (services, règles, comptes, politiques). Un outil de comparaison (même un script) vérifie mensuellement chaque poste contre sa référence. La dérive est traitée comme un changement non annoncé.

:::tip Le poste d’ingénierie
C’est le poste le plus exposé du périmètre : il reçoit les médias, il programme les automates. Il mérite le durcissement le plus strict et il est le premier candidat à l’allowlisting bloquant. Si vous ne durcissez qu’un poste, c’est celui-là.
:::

## Mise en pratique

Lancez l’allowlisting en mode audit sur un poste d’ingénierie cette semaine. Appliquez le tableau de réduction de surface au même poste. Documentez sa configuration de référence.

## Checklist

- [ ] Allowlisting en mode audit sur les postes d’ingénierie, passage en bloquant planifié
- [ ] Services, protocoles, comptes, périphériques réduits et documentés
- [ ] Image maîtresse et configuration de référence par type de poste
- [ ] Contrôle mensuel de la dérive

## Le cas SITE 42

Un périmètre isolé sait exactement ce qui doit s’y exécuter. Voici ce que SITE 42 exécute vraiment.

```
SITE 42 - executables attendus contre observes

equipement         attendus  liste blanche  observes
-----------------  --------  -------------  --------
scada-serveur-01   41        active         44
hmi-salle-01       28        active         28
hist-donnees-01    33        absente        33
plc-chloration-02  1         sans objet     1
```

```epreuve
{
  "enonce": "Un équipement exécute trois programmes de plus que ce que l'inventaire prévoit, alors même qu'une liste blanche y est active. Donnez son nom.",
  "reponse": "scada-serveur-01",
  "indice": "Une liste blanche active qui laisse passer l'imprévu n'est pas appliquée."
}
```
