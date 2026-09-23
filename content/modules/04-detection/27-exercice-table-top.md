---
minutes: 35
---

Un playbook non exercé est une hypothèse de plus. Cette leçon vous fait jouer, sur table, en 90 minutes, un scénario réaliste : **la clé USB du prestataire**. Vous en sortirez avec une liste de failles de votre organisation, pas de votre technique.

## Objectifs

- Animer un exercice sur table avec les bons participants et un scénario en cinq injections.
- Observer les décisions, pas les connaissances.
- Transformer les observations en actions du plan 90 jours.

## Participants

Exploitation (celui qui tient le sas), responsable du procédé, responsable sécurité, un ingénieur du périmètre, un représentant de la direction (facultatif mais précieux), un animateur qui ne joue pas, un observateur qui note.

## Le scénario en cinq injections

**Injection 1 (T0).** Lundi 9 h 10. Un technicien du fabricant de la ligne 2 est sur site pour une intervention planifiée. Il demande à brancher sa clé USB « avec le firmware corrigé » sur le poste d’ingénierie. *Question au groupe : que se passe-t-il ?*

Ce qu’on observe : le runbook est-il connu ? Le média dédié est-il disponible ? Le technicien a-t-il été prévenu par contrat ?

**Injection 2 (T0 + 2 h).** Le transfert a été fait selon le runbook. Le kiosque n’a rien détecté. Le hachage du firmware ne correspond pas à celui figurant dans le courrier du fabricant reçu la semaine dernière. Le technicien dit que c’est une version plus récente. *Que fait-on ?*

Ce qu’on observe : la vérification d’origine est-elle bloquante ? Qui décide ? Le technicien est-il en position de forcer ?

**Injection 3 (T0 + 1 jour).** Le firmware a finalement été déployé après appel au support du fabricant. Le lendemain, la baseline réseau signale une nouvelle conversation entre l’automate de la ligne 2 et le poste d’ingénierie, sur un port inhabituel. *Que fait-on ?*

Ce qu’on observe : l’alerte est-elle vue ? Par qui ? Est-elle qualifiée en incident ?

**Injection 4 (T0 + 1 jour, 14 h).** L’investigation montre que le poste d’ingénierie a un nouveau service persistant, créé pendant l’intervention. Le responsable du procédé indique que la ligne 2 doit produire jusqu’à vendredi. *Que décide-t-on sur la production ? Sur l’escalade ?*

Ce qu’on observe : la matrice de décision existe-t-elle ? Le responsable du procédé et le responsable sécurité ont-ils la même lecture ?

**Injection 5 (T0 + 3 jours).** Le fabricant confirme qu’un de ses postes de développement a été compromis et que plusieurs clients ont reçu le firmware modifié. *Qui est informé ? Qu’est-ce qui doit être déclaré, à qui, sous quel délai ?*

Ce qu’on observe : obligations réglementaires connues ? Contacts prêts ? Communication interne ?

## Animer

L’animateur pose la question, laisse le silence, et note **qui décide** et **sur quelle base**. Il ne corrige pas. Les erreurs sont le produit de l’exercice. Chaque injection dure quinze minutes maximum.

## Restitution

Vingt minutes en fin d’exercice. Pour chaque injection : qu’est-ce qui a bien fonctionné, qu’est-ce qui a manqué (document, outil, décision, personne). Chaque manque devient une action avec un propriétaire et une date. Typiquement cinq à dix actions.

:::tip Le vrai résultat
Le résultat de l’exercice n’est pas la liste d’actions. C’est le moment où le responsable du procédé et le responsable sécurité découvrent qu’ils n’ont pas la même réponse à l’injection 4, et la construisent ensemble. Faites l’exercice pour ce moment.
:::

## Mise en pratique

Planifiez l’exercice dans les trente jours. Adaptez le scénario à votre contexte (nommez la ligne, le fabricant réel). Partagez les actions anonymisées dans le canal du module 4.

## Checklist

- [ ] Exercice planifié avec les participants clés
- [ ] Scénario adapté au contexte
- [ ] Observateur désigné, restitution planifiée
- [ ] Actions avec propriétaires et dates

## Le cas SITE 42

Le déroulé minute par minute de l’exercice sur table de SITE 42.

```
SITE 42 - exercice sur table, la cle USB du prestataire

  09h02  le prestataire arrive avec usb-presta-07, non annonce
  09h05  l accueil enregistre la visite, pas le media
  09h20  le media passe au kiosque : aucune menace detectee
  09h25  branchement direct sur hist-donnees-01
  11h40  un fichier inconnu apparait sur hist-donnees-01
  14h10  l exploitation s en apercoit en cherchant autre chose
```

```epreuve
{
  "enonce": "Une étape du runbook du module 3 a été purement sautée, celle qui aurait retardé de 24 heures l'événement suivant. Donnez l'horodatage de cet événement, tel qu'il est écrit.",
  "reponse": "09h25",
  "indice": "La quarantaine se place entre le kiosque et la zone de conduite."
}
```
