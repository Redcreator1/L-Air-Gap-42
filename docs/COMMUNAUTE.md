# Le Bunker — animation de la communauté

La communauté est ce qui fait qu'un acheteur termine le programme, reste, recommande et revient pour un upgrade. Elle repose sur trois outils gratuits et trois rituels hebdomadaires.

## Outils

| Outil | Usage | Accès |
| --- | --- | --- |
| Discord | Conversation, entraide, vocal pendant les lives | Salons publics ouverts ; salons par palier sur rôle |
| GitHub Discussions (+ giscus sous chaque leçon) | Questions par leçon, indexées et pérennes ; retours intégrés aux mises à jour | Public (référencement) ou privé (dépôt privé + collaborateurs) |
| Visio (Jitsi, Meet, Zoom) | Lives hebdomadaires, coaching Elite | URL visible aux membres Pro/Elite connectés |

## Plan du serveur Discord

```
📌 ACCUEIL
  #bienvenue        présentation : secteur, rôle, objectif à 42 jours (modérateur → rôle)
  #règles           la charte en trois règles
  #annonces         lives, mises à jour, nouvelles cohortes

🎯 SEMAINE
  #objectifs        lundi : chaque membre poste sa leçon-cible et son livrable
  #wins             ce qui a été livré, mis en place, découvert
  #incidents        vendredi : retour d'incident anonymisé (par l'équipe ou un membre)

📚 MODULES (rôle Essentiel+)
  #m0-briefing  #m1-fondations  #m2-architecture

📚 MODULES PRO (rôle Pro+)
  #m3-transferts  #m4-detection  #m5-canaux-caches
  #revue-par-les-pairs   postez un schéma ou une matrice anonymisés, 2 relectures sous 72 h
  #replays               enregistrements des lives

🏛 ELITE (rôle Elite)
  #m6-gouvernance  #mastermind  #audits (retours de missions, questions de facturation)

🔊 VOCAL
  Live hebdomadaire · Bunker (permanent, pour travailler ensemble)

💼 CARRIÈRE
  #emploi-missions       offres et demandes, secteur OT/sécurité
```

Rôles : `Essentiel`, `Pro`, `Elite`, `Modérateur`, `Alumni` (a obtenu le certificat). L'attribution du rôle se fait manuellement par un modérateur après vérification de l'achat (nom et e-mail du paiement PayPal), ou automatiquement avec un bot de licence si vous passez par l'API Vercel.

## Les trois rituels

**Lundi — Objectif de la semaine.** Un message épinglé : « Quelle leçon terminez-vous cette semaine, quel livrable produisez-vous ? » Chaque membre répond en un message. Le vendredi, on revient dessus. La responsabilité mutuelle est le premier facteur de complétion.

**Jeudi 19 h — Live.** Une heure. 20 minutes : revue d'architecture d'un cas de membre (anonymisé, soumis en avance dans `#revue-par-les-pairs`). 30 minutes : questions-réponses sur le module de la semaine. 10 minutes : annonce de la semaine suivante. Enregistré, replay dans `#replays` sous 24 h.

**Vendredi — Retour d'incident.** Un incident réel (public ou anonymisé), décortiqué en cinq lignes : ce qui a franchi l'isolation, par quel pont, ce qui l'aurait bloqué, à quelle leçon ça renvoie. Les membres commentent. C'est le contenu le plus partagé à l'extérieur : c'est votre canal d'acquisition organique.

## Charte

1. **Anonymisez** : jamais de nom de client, de site, d'adresse réelle.
2. **Défendez, n'attaquez pas** : contre-mesures, architectures, procédures. Pas d'outillage offensif ni de détails d'exploitation.
3. **Rendez ce que vous prenez** : une question posée = une relecture offerte.

Tout manquement : un avertissement privé, puis exclusion sans remboursement (prévu aux CGV).

## Calendrier d'une cohorte (6 semaines + capstone)

| Semaine | Modules | Live du jeudi |
| --- | --- | --- |
| 0 (lancement) | M0 | Présentation, méthode, comment utiliser l'espace membre, tour de table |
| 1 | M1 | Revue de modèles de menace de membres |
| 2 | M2 | Revue de schémas cibles ; débat diode vs sas |
| 3 | M3 | Démonstration d'un transfert au sas ; « que faire si » collectif |
| 4 | M4 | Exercice sur table joué en direct avec des volontaires |
| 5 | M5 | Plans de durcissement : arbitrages en direct |
| 6 | M6 | Red/blue sur table en direct ; préparation du capstone |
| 7 | Capstone | Présentation de 3 dossiers par des membres ; remise des certificats |

## Mesurer

- Membres actifs par semaine (messages ou réactions) / membres totaux : > 40 % pendant une cohorte.
- Objectifs postés le lundi / membres de la cohorte : > 60 %.
- Délai moyen de première réponse à une question : < 12 h.
- Certificats délivrés / inscrits : > 50 %.

## Modèles de messages

**Bienvenue (automatique)** : « Bienvenue au Bunker. Présentez-vous dans #bienvenue en trois lignes : votre secteur, votre rôle, ce que vous voulez avoir sécurisé dans 42 jours. Un modérateur vous ouvre ensuite les salons de votre palier. Premier live jeudi 19 h. »

**Objectif du lundi** : « Semaine N. Quelle leçon terminez-vous cette semaine ? Quel livrable ? Répondez en un message. Vendredi, on fait le point. »

**Relance à J+7 sans activité (message privé)** : « Vous n'avez pas encore commencé le module 1 : c'est le moment où la plupart décrochent. Qu'est-ce qui bloque ? Le live de jeudi peut vous débloquer en 10 minutes. »
