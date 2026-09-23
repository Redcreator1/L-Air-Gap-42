# Stratégie de monétisation

Ce document décrit comment le produit est conçu pour vendre, et ce qu'il faut faire au lancement et après. Les chiffres sont des hypothèses de travail à ajuster avec vos données.

## Positionnement

- **Niche à fort enjeu, faible concurrence.** La sécurité des systèmes isolés concerne l'énergie, la défense, la santé, la finance, l'industrie. Les formations existantes sont soit génériques (OT/ICS), soit des slides de conférence. Aucune ne traite transferts, détection hors-ligne, canaux cachés et conformité comme un parcours opérationnel.
- **Acheteur B2B, budget formation.** L'acheteur type fait financer par son employeur (plan de formation, OPCO) ou facture à son client (consultant). Le prix se compare à une journée de conseil, pas à un cours en ligne grand public. D'où les prix : 390 / 1 190 / 1 900 €. L'écart entre Pro et Elite reste proportionné à ce qui les sépare réellement aujourd'hui : le module gouvernance et audit.
- **Promesse mesurable.** Des livrables concrets : modèle de menace, schéma d'architecture, runbook de transfert, plan de détection, plan 90 jours, dossier d'architecture. On vend un résultat, pas des heures de vidéo. N'annoncez pas de « score » : le parcours ne mesure rien d'autre que le nombre de niveaux résolus, et c'est déjà une affirmation vérifiable.

## Les trois paliers

| Palier | Prix | Pour qui | Ce qui justifie le saut |
| --- | --- | --- | --- |
| Essentiel | 390 € | Ingénieur qui veut comprendre et concevoir | Niveaux 4 à 17 |
| **Pro** (ancre) | 1 190 € | Responsable d'un périmètre à défendre | Niveaux 4 à 38 : transferts, détection, canaux cachés |
| Elite | 1 900 € | RSSI, auditeur, consultant | Les 45 niveaux, gouvernance et audit compris |

Le palier **Pro** est l'ancre : mis en avant, recommandé. Essentiel sert de porte d'entrée et d'upgrade ; Elite fixe le haut de l'échelle et capte les consultants, pour qui 1 900 € s'amortissent en une mission.

**Upgrade** : à tout moment, en payant la différence (800 € d'Essentiel à Pro, 710 € de Pro à Elite), par demande de paiement PayPal. La progression, stockée chez l'apprenant, est conservée.

**Entreprise** : à partir de 5 licences, devis. Proposez une session privée de lancement (2 h) et un tarif dégressif (−20 % à 5, −30 % à 10).

## Tunnel de vente

1. **Acquisition** : le module 0 gratuit (3 leçons de qualité, lisibles sans compte) + le lead magnet « Les sept erreurs qui trouent un air gap » par newsletter. Partagez les niveaux gratuits sur LinkedIn, dans les communautés OT/ICS, en conférence. Le flux RSS et le sitemap indexent les niveaux libres.
2. **Activation** : la page d'accueil est une page de vente complète (problème → méthode → preuve → offre → FAQ → urgence). Le compte à rebours et les places restantes sont pilotés par `config.cohort`.
3. **Conversion** : bouton PayPal en un clic, garantie 14 jours. Pas de compte à créer sur le site : la clé de licence suffit.
4. **Rétention** : communauté, mises à jour, certificat. Le certificat exige les 45 niveaux validés : il pousse à terminer, et un membre qui termine recommande. N'annoncez chaque service qu'une fois `engagements` passé à `true`.
5. **Expansion** : upgrade, licences entreprise, et pour les Elite, un flux de missions d'audit qu'ils facturent avec le kit → ils deviennent prescripteurs.

## Le modèle de cohorte

Le contenu est en accès à vie, mais la **vente est par cohortes** (4 par an). Pourquoi :

- l'urgence est réelle (les lives et les revues suivent la cohorte) ;
- le groupe progresse ensemble, ce qui fait vivre la communauté ;
- vous concentrez l'effort d'animation sur 6 semaines par trimestre.

Entre deux cohortes, laissez la vente ouverte sans compte à rebours (`cohort.closesAt` dans le passé → la note « inscriptions closes, liste d'attente » s'affiche) ou basculez vers la cohorte suivante.

## Hypothèses de revenu

Une cohorte de 42 places, répartition observée sur ce type d'offre (à valider) :

| Palier | Part | Ventes | CA |
| --- | --- | --- | --- |
| Essentiel | 40 % | 17 | 6 630 € |
| Pro | 50 % | 21 | 24 990 € |
| Elite | 10 % | 4 | 7 600 € |
| **Total cohorte** | | 42 | **39 220 €** |

Quatre cohortes par an, plus les upgrades et les licences groupées : un ordre de grandeur de 150 à 180 k€ annuels, à condition d'atteindre une audience de quelques milliers de professionnels du secteur. Le coût marginal est quasi nul (GitHub Pages est gratuit, PayPal prélève une commission par transaction) ; le coût réel est votre temps d'animation (lives, revues, coaching Elite).

## Ce qu'il faut préparer avant la première cohorte

- [ ] Des témoignages réels (offrez la cohorte 0 à 10 personnes de votre réseau contre un retour écrit et un accord de publication). `config.testimonials` est vide par défaut et la section reste masquée tant qu'il le reste : le site ne publie aucun témoignage fictif.
- [ ] Relire la présentation de l'auteur (`site.instructor`) : n'y revendiquez que ce que vous pouvez montrer. La section est masquée tant que le nom est vide.
- [ ] Le lead magnet (PDF de 8 pages) et 5 e-mails de séquence d'accueil.
- [ ] La bibliothèque de templates Pro (politique de médias, matrice de flux, runbook, checklist d'audit, rapport direction) au format docx/xlsx, livrée via un dossier partagé dont le lien est dans une leçon du module 3.
- [ ] Le kit d'audit Elite (grilles, modèles de rapport, lettre d'autorisation de test).
- [ ] Le calendrier des lives de la cohorte, publié sur la page Communauté.
- [ ] Si vous voulez un tarif de lancement, baissez `price` pendant la période : un prix barré (`priceBefore`) n'est licite que s'il a été réellement pratiqué dans les 30 jours précédents.

## Indicateurs à suivre

| Indicateur | Source | Cible |
| --- | --- | --- |
| Visiteurs → newsletter | Plausible `Newsletter` / visiteurs uniques | > 5 % |
| Visiteurs page Tarifs → clic Checkout | événement `Checkout` | > 8 % |
| Clic Checkout → achat | PayPal | > 40 % |
| Taux de complétion (certificats délivrés) | déclaratif, code de vérification | > 50 % |
| Remboursements | PayPal | < 5 % |
| Upgrades | PayPal | > 15 % des Essentiel sous 90 jours |

## Ce que le modèle statique ne fait pas, et comment compenser

- **Pas de compte utilisateur** : la progression vit dans le dossier de l'archive, chez l'apprenant. Vous ne savez donc pas qui avance. Compensation : la communauté et le code de vérification du certificat.
- **Clé de licence partagée par palier**. Compensation : `api/activate.js`, qui ne délivre la clé qu'après vérification d'un paiement réel ; et le contrat (CGV) qui interdit le partage. Dans les faits, le contenu B2B à ce prix est peu piraté ; la valeur est dans la communauté et les lives, qui ne se copient pas.
- **Pas de vidéo hébergée** : ajoutez des liens vers des vidéos non listées (YouTube/Vimeo) dans les `resources` d'une leçon, ou un lecteur intégré dans le Markdown. Les replays de lives suivent le même chemin.
