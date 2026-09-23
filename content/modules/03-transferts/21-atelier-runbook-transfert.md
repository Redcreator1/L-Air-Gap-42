---
minutes: 45
---

Fin du module 3. Vous assemblez politique de médias, kiosque, sas, vérification d’origine, quarantaine et supply chain en **un runbook de transfert** : le document que l’exploitation suit sans réfléchir, à 3 h du matin, un jour d’incident.

## Objectifs

- Rédiger le runbook au format « une procédure par page ».
- Le tester en conditions réelles avec un transfert entrant et un sortant.
- Le faire relire par la communauté et l’intégrer au dossier d’architecture.

## Structure du runbook

**Page 0 · Principes (5 lignes).** Tout transfert passe par le sas. Médias dédiés à sens unique. Vérification d’origine avant analyse. Double contrôle. Journal immuable.

**Page 1 · Transfert entrant standard.** Les huit étapes de la leçon 17, avec pour chacune : qui, quoi, outil, champ du journal à remplir, critère de passage à l’étape suivante.

**Page 2 · Transfert entrant de mise à jour.** Idem, avec la quarantaine : durée, où attend le paquet, qui décide la fin de quarantaine, alimentation du dépôt miroir avec hachage de lot.

**Page 3 · Transfert sortant.** Les cinq étapes, avec la revue de contenu et la liste des types de données qui ne sortent jamais (secrets, configurations complètes, schémas non anonymisés).

**Page 4 · Procédure d’urgence.** Média de secours sous scellé, un contrôleur, déclaration d’incident, revue sous 24 h. Critères qui autorisent l’urgence (sécurité des personnes, arrêt de production imminent).

**Page 5 · Réception matériel.** Fiches par niveau (leçon 20).

**Page 6 · Que faire si.** Hachage non conforme, kiosque positif, média inconnu trouvé inséré, scellé rompu, second contrôleur indisponible. Pour chacun : action immédiate, qui prévenir, ce qu’on consigne.

**Annexes.** Registre des sources de référence, inventaire des médias, plan du sas.

## Le test

Faites un transfert entrant réel (une mise à jour non urgente, par exemple) et un transfert sortant réel en suivant le runbook **à la lettre**, chronomètre en main, par une personne qui n’a pas participé à sa rédaction. Notez chaque hésitation : c’est une phrase à réécrire. Objectif : un transfert standard en moins de quinze minutes, une urgence en moins de cinq.

:::tip Le test de la personne nouvelle
Le runbook est bon quand un exploitant arrivé la semaine dernière peut réaliser un transfert conforme sans poser de question. Pas parce qu’il est intelligent : parce que le document est complet.
:::

## Relecture

Postez la page 6 (« Que faire si ») dans le canal du module 3. C’est la page où la communauté ajoute le plus de cas vécus.

## Checklist de fin de module

- [ ] Politique de médias en six règles, parc en place, ports scellés
- [ ] Kiosque isolé, réinitialisable, limites documentées
- [ ] Sas avec procédures affichées, journal immuable, double contrôle rapide
- [ ] Registre des sources de référence, poste de vérification
- [ ] Politique de mise à jour, quarantaine, dépôt miroir, retour arrière testé
- [ ] Supply chain matérielle par niveaux, réforme sécurisée
- [ ] Runbook testé par une personne nouvelle, chronométré, relu

Le module 4 vous apprend à **voir** : ce qui passe par le sas, et surtout ce qui n’y passe pas.

## Le cas SITE 42

Le runbook de transfert entrant proposé pour SITE 42, dans l’ordre où l’exploitation l’exécuterait.

```
SITE 42 - runbook de transfert entrant (proposition)

  e1  demande ecrite, objet et justification
  e2  approbation par le responsable d exploitation
  e3  releve de l empreinte a la source, sur un poste distinct
  e4  passage au kiosque, impression du rapport
  e5  quarantaine 24 h sur relais-fichiers-01
  e6  transfert vers la zone de conduite
  e7  journal signe par le demandeur
```

```epreuve
{
  "enonce": "Il manque une étape : comparer l'empreinte relevée en e3 à celle du fichier arrivé, seule façon de détecter une substitution pendant le transfert. Donnez le code de l'étape existante juste après laquelle elle doit s'insérer.",
  "reponse": "e6",
  "indice": "On ne peut comparer qu'une fois le fichier arrivé de l'autre côté."
}
```
