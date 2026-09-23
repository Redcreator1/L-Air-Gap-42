---
minutes: 35
---

Dernier exercice avant le capstone : une confrontation **sur table** entre une équipe qui cherche à franchir l’isolation (rouge) et une équipe qui la défend (bleue), sur *votre* architecture cible. Aucun outil, aucune technique offensive : des cartes, des règles et des décisions. Le résultat est une liste des chemins que votre architecture laisse encore ouverts.

## Objectifs

- Jouer un exercice red/blue sur table en 2 heures avec les règles proposées.
- Utiliser les neuf surfaces et les quatre profils d’adversaires comme cartes de jeu.
- Convertir chaque chemin trouvé en action ou en risque accepté.

## Le matériel

- Votre schéma cible (module 2) affiché.
- Votre matrice des flux et votre runbook à portée de main de l’équipe bleue.
- Cartes « surface » : les neuf surfaces du module 1 (une carte chacune).
- Cartes « adversaire » : les quatre profils, avec leurs capacités (module 1, leçon 2).
- Cartes « contrôle » : les contrôles que vous avez réellement en place (sas, kiosque, diode, allowlisting, baselines, scellés, escorte…), une carte chacun. **Seuls les contrôles réellement en place sont dans la pile.**

## Les règles

1. L’équipe rouge tire une carte adversaire. Elle dispose des capacités de ce profil, pas plus.
2. L’équipe rouge choisit une surface et décrit, en langage courant, un chemin d’entrée ou de sortie plausible pour ce profil par cette surface. Exemple : « L’initié négligent, surface médias : il ramène de chez lui la clé qu’il utilise pour ses photos, parce que le média dédié était au sas et que le sas était fermé à 19 h. »
3. L’équipe bleue répond avec les cartes contrôle qu’elle possède **et** décrit comment ce contrôle bloque ou détecte, en se référant au runbook ou au plan de détection. « Carte : ports scellés + contrôle des classes de périphériques. La clé personnelle n’est pas reconnue ; l’insertion est journalisée ; incident. »
4. L’animateur tranche : bloqué, détecté (passe, mais vu), ou passe. Un « passe » est une découverte. Un « détecté » est acceptable si le délai de détection est cohérent avec la conséquence.
5. Cinq rounds par profil d’adversaire, en montant en capacité : opportuniste, négligent, malveillant, ciblé.
6. L’équipe rouge marque un point par « passe ». L’équipe bleue marque un point par « bloqué » justifié par un document. Les « détecté » ne marquent pas : ils vont dans la liste de revue.

## Ce que vous allez découvrir

Les « passe » se concentrent presque toujours sur trois zones : les horaires (le sas fermé, l’astreinte de nuit), les rôles secondaires (nettoyage, climatisation, auditeur), et les sorties (l’export de diagnostic que personne ne relit). C’est normal : ce sont les zones que le modèle de menace traite le moins bien parce qu’elles ne sont pas techniques.

:::tip Rouge = les nouveaux
Confiez l’équipe rouge aux personnes qui connaissent le moins le périmètre. Elles poseront les questions naïves (« et si je viens un dimanche ? ») que les experts ne posent plus. L’équipe bleue est celle des experts, qui doit se défendre avec des documents, pas avec de l’assurance.
:::

## Restitution

Pour chaque « passe » : une action (nouveau contrôle, modification de processus) ou une acceptation de risque écrite. Pour chaque « détecté » : le délai de détection est-il acceptable ? Sinon, action. Intégrez au plan 90 jours ou 12 mois.

## Mise en pratique

Organisez l’exercice dans les trente jours. Partagez le nombre de « passe » par surface (anonymisé) dans le canal du module 6 : la communauté compile ces statistiques, et elles disent où l’ensemble des membres est faible.

## Checklist

- [ ] Exercice joué avec seuls les contrôles réels dans la pile bleue
- [ ] Quatre profils joués, cinq rounds chacun
- [ ] Chaque « passe » converti en action ou en risque accepté écrit
- [ ] Délais de détection des « détecté » évalués

## Le cas SITE 42

La confrontation sur table entre l’équipe rouge et l’équipe bleue, sur l’architecture cible de SITE 42.

```
SITE 42 - exercice rouge contre bleu

code  equipe rouge                    reponse bleue
----  ------------------------------  ------------------------------
rb1   media apporte par un mainteneur kiosque, quarantaine 24 h
rb2   reactivation de wlan0           balayage radio trimestriel
rb3   exfiltration par diode d etat   aucune, canal non instrumente
rb4   compte tech-auto reutilise      journal hmi, alerte
```

```epreuve
{
  "enonce": "Sur un seul coup, l'équipe bleue n'a rien à opposer — et c'est précisément celui que le modèle de menace avait accepté comme risque assumé. Donnez son code.",
  "reponse": "rb3",
  "indice": "Un risque accepté reste un risque : il ne disparaît pas parce qu'il est écrit."
}
```
