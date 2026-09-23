# Trouver les premiers clients

Ce document est le plan d'acquisition, dans l'ordre d'exécution. Il ne contient aucun chiffre inventé : les hypothèses de conversion sont dans `MONETISATION.md` et restent à valider par vos propres données.

Le principe directeur : à 390–1 900 € en B2B sécurité, **personne n'achète chez un inconnu**. On n'achète pas de l'attention, on construit de la preuve. L'ordre ci-dessous n'est donc pas négociable — l'étape 3 ne fonctionne pas sans l'étape 2, qui ne fonctionne pas sans l'étape 1.

---

## Étape 0 — Boucher le seau (avant toute chose)

Aujourd'hui, les trois chemins de conversion du site aboutissent au même endroit :

| Chemin | Destination actuelle |
| --- | --- |
| Bouton « Être prévenu de l'ouverture » | `mailto:` vers `site.contactEmail` |
| Formulaire newsletter sans endpoint configuré | le même `mailto` |
| Achat | aucun : `checkout.paypal.clientId` et les trois `checkoutUrl` sont vides |

`contact@airgap42.example` utilise un domaine réservé par la RFC 2606 : il ne résout pas, et tout message envoyé rebondit. **Un visiteur convaincu ne peut aujourd'hui ni acheter, ni s'inscrire, ni écrire.** Faire venir du monde avant d'avoir corrigé cela revient à payer pour remplir un seau percé.

Quatre champs de `site/config.js`, tous modifiables depuis l'éditeur web de GitHub, sans aucune commande :

- [ ] `site.contactEmail` — une adresse qui reçoit réellement.
- [ ] `checkout.paypal.clientId` — identifiant client PayPal (public). À défaut, trois liens de paiement PayPal collés dans les `checkoutUrl` : aucun code, la clé de licence est alors envoyée à la main.
- [ ] `newsletter.endpoint` — un endpoint Formspree (offre gratuite : 50 soumissions par mois).
- [ ] `community.discordInvite` — une invitation permanente, et non `REMPLACER`.

Optionnel mais utile dès le premier visiteur : `analytics.provider` (Plausible ou Umami, sans cookie). Sans mesure, on ne sait pas d'où vient ce qui marche, et on optimise à l'aveugle.

**Tant que cette étape n'est pas faite, aucune des suivantes ne produit un euro.**

---

## Étape 1 — La cohorte 0 : dix places offertes

C'est la seule étape où votre réseau personnel compte plus que le produit, et c'est celle qui débloque tout le reste.

`config.testimonials` est vide, et la section reste masquée — c'est honnête, et c'est aussi votre plus gros manque commercial. Un acheteur qui hésite à 1 190 € cherche une chose : la preuve que quelqu'un d'autre l'a fait avant lui.

**Le marché :** vous offrez le palier Elite. En échange, la personne s'engage sur trois choses — terminer au moins un module, écrire un retour de quelques lignes, et autoriser sa publication avec son prénom, son initiale et sa fonction.

**Qui viser :** dix personnes qui exercent réellement le métier — ingénieur OT, administrateur système en environnement contraint, RSSI, auditeur, consultant. Un ami complaisant produit un témoignage inutilisable.

**Ce que vous en retirez, au-delà des témoignages :** les bugs du lanceur remontés par de vrais utilisateurs, les niveaux mal expliqués, le temps réel par niveau (l'estimation actuelle de 20 à 45 minutes est une hypothèse), et dix prescripteurs dans le milieu.

Le message de recrutement est rédigé dans `LANCEMENT.md`.

---

## Étape 2 — Le produit est le marketing

Vous avez un actif que les concurrents n'ont pas : **un wargame en terminal, hors-ligne, dont on peut lire le code avant de l'exécuter.** C'est précisément le format qui circule tout seul dans ce milieu — OverTheWire est connu de toute une profession sans avoir jamais fait de publicité.

Les trois niveaux gratuits ne sont pas une démonstration bridée : ce sont les vrais niveaux. C'est ce qui rend le partage crédible.

Deux actifs publics, tous deux en lecture libre et sans inscription :

- **Le briefing** « Les sept erreurs qui trouent un air gap » — publié sur `/briefing/`. Il prouve la compétence avant de demander un euro, et c'est la pièce que l'on cite et que l'on partage.
- **L'archive elle-même**, vérifiable par son empreinte SHA-256 affichée sur `/jouer/`.

Où poster, par ordre de rendement décroissant pour ce format :

| Canal | Angle | Remarque |
| --- | --- | --- |
| Hacker News (*Show HN*) | le wargame hors-ligne | un seul essai utile ; soignez le titre et l'heure |
| r/netsec, r/ICS_Security | le briefing, pas la vente | ces communautés rejettent la promotion directe |
| Lobste.rs | l'aspect technique du lanceur | invitation nécessaire |
| LinkedIn, groupes OT/ICS | le briefing, en français | c'est là que sont les acheteurs français |
| Root-Me, Zenk-Security | le wargame | public francophone, culture wargame établie |

Règle commune à tous : **on partage le briefing ou les niveaux gratuits, jamais la page Tarifs.** Ces communautés sanctionnent la promotion directe, et le lien vers le contenu convertit mieux de toute façon.

---

## Étape 3 — Aller chercher les acheteurs là où ils sont

Le budget « formation air gap » est chez les RSSI d'opérateurs d'importance vitale et d'entités essentielles, poussés par NIS2 et la LPM, et chez les consultants qui les facturent.

**Associations et clubs français :** CLUSIF, CESIN, Club EBIOS, les pôles régionaux de cybersécurité. On n'y vend pas, on y contribue — une intervention sur les sept erreurs vaut mieux qu'un stand.

**Conférences :** SSTIC, InCyber Forum (Lille), Barbhack, LeHACK, Botconf. Un appel à communications accepté vaut plus que n'importe quel budget publicitaire. **Vérifiez les dates et les échéances de soumission chaque année, elles bougent.**

**Approche directe, à petite échelle :** trente messages individuels, pas trois cents. On propose le briefing et les niveaux gratuits, on demande quinze minutes de retour. Ce n'est pas de la prospection, c'est de la recherche utilisateur — et c'est ce qui la rend acceptable. Les messages types sont dans `LANCEMENT.md`.

---

## L'arbitrage qui reste à rendre : cohorte ou accès continu

Le site annonce l'ouverture de la cohorte 1 au **20 septembre 2026**, avec **42 places sur 42**. Deux problèmes :

1. Il n'y a pas encore d'audience à qui ouvrir. Un compte à rebours devant une salle vide se voit.
2. Tous les `engagements` sont à `false` — ni lives, ni revues, ni coaching. Or c'est précisément ce qui justifie une cohorte : un groupe qui avance ensemble avec un animateur. Sans ces services, « cohorte » décrit une contrainte de calendrier sans contrepartie.

Deux sorties cohérentes, au choix :

- **Accès continu.** On retire le compte à rebours et le décompte de places. C'est ce que le produit est aujourd'hui : une archive qu'on achète et qu'on garde. Honnête, et vendable immédiatement.
- **Cohorte, mais plus tard.** On repousse `cohort.closesAt` et `cohort.startsOn` au terme de l'étape 1, et on n'ouvre que lorsqu'au moins un engagement est réellement tenu.

Ce choix engage commercialement le vendeur : il vous revient. Les deux se règlent dans `config.cohort`.

---

## Ce qu'il ne faut pas faire

- **Acheter de la publicité maintenant.** Sans témoignage ni trafic mesuré, vous paierez pour découvrir que la page ne convertit pas.
- **Afficher un prix barré pour « lancer ».** Illicite tant que le prix haut n'a pas été réellement pratiqué 30 jours (directive Omnibus, art. L112-1-1 C. conso.). Pour un tarif de lancement, baissez `price` franchement et laissez `priceBefore` vide.
- **Activer un `engagement` « pour voir ».** Chaque ligne passée à `true` est une promesse opposable (art. L111-1 et L121-2 C. conso.).
- **Publier un témoignage arrangé.** C'est le risque juridique le plus bête du lot, et le plus facile à éviter : attendez l'étape 1.

---

## Les trois chiffres à regarder au début

Tout le reste est du bruit tant que le volume est faible :

| Indicateur | Ce qu'il dit | Si c'est mauvais |
| --- | --- | --- |
| Visiteurs `/briefing/` → `/jouer/` | le contenu donne-t-il envie d'essayer | le briefing ne débouche pas assez clairement |
| Téléchargements de l'archive | l'essai est-il réellement tenté | la page Jouer fait peur ou paraît compliquée |
| Retours de la cohorte 0 | le produit tient-il sa promesse | corrigez le produit avant de dépenser en acquisition |
