# Stratégie de monétisation

Ce document décrit comment le produit est conçu pour vendre, et ce qu'il faut faire au lancement et après. Les chiffres sont des hypothèses de travail à ajuster avec vos données.

## Positionnement

- **Niche à fort enjeu, faible concurrence.** La sécurité des systèmes isolés concerne l'énergie, la défense, la santé, la finance, l'industrie. Les formations existantes sont soit génériques (OT/ICS), soit des slides de conférence. Aucune ne traite transferts, détection hors-ligne, canaux cachés et conformité comme un parcours opérationnel.
- **Acheteur B2B, budget formation.** L'acheteur type fait financer par son employeur (plan de formation, OPCO) ou facture à son client (consultant). Le prix se compare à une journée de conseil, pas à un cours en ligne grand public. D'où les prix : 490 / 1 490 / 4 900 € HT.
- **Promesse mesurable.** « Score d'isolation » avant/après, livrables concrets (modèle de menace, schéma, runbook, plan 90 jours, dossier d'architecture). On vend un résultat, pas des heures de vidéo.

## Les trois paliers

| Palier | Prix | Pour qui | Ce qui justifie le saut |
| --- | --- | --- | --- |
| Essentiel | 490 € | Ingénieur qui veut comprendre et concevoir | Modules 1–2, accès à vie |
| **Pro** (ancre) | 1 490 € | Responsable d'un périmètre à défendre | Modules 3–5 (là où 80 % des incidents se jouent), lives, templates, revues par les pairs |
| Elite | 4 900 € | RSSI, auditeur, consultant | Module 6 (audit facturable), coaching 1:1, kit d'audit, mastermind |

Le palier **Pro** est l'ancre : mis en avant, « le plus choisi ». Essentiel sert de porte d'entrée et d'upgrade ; Elite crée le référentiel de prix qui rend Pro raisonnable et capte les consultants pour qui 4 900 € s'amortissent en une mission.

**Upgrade** : à tout moment, en payant la différence (ajoutez un palier « Upgrade Essentiel → Pro » à 1 000 € dans la configuration, ou envoyez une demande de paiement PayPal). La progression est conservée.

**Entreprise** : à partir de 5 licences, devis. Proposez une session privée de lancement (2 h) et un tarif dégressif (−20 % à 5, −30 % à 10).

## Tunnel de vente

1. **Acquisition** : le module 0 gratuit (3 leçons de qualité, lisibles sans compte) + le lead magnet « 7 erreurs qui trouent 90 % des air gaps » par newsletter. Partagez les leçons gratuites sur LinkedIn, dans les communautés OT/ICS, en conférence. Le flux RSS et le sitemap indexent les leçons gratuites.
2. **Activation** : la page d'accueil est une page de vente complète (problème → méthode → preuve → offre → FAQ → urgence). Le compte à rebours et les places restantes sont pilotés par `config.cohort`.
3. **Conversion** : bouton PayPal en un clic, garantie 14 jours. Pas de compte à créer sur le site : la clé de licence suffit.
4. **Rétention** : communauté (rituels hebdomadaires), lives, mises à jour trimestrielles, certificat. Le certificat exige 100 % des quiz : il pousse à terminer, et un membre qui termine recommande.
5. **Expansion** : upgrade, licences entreprise, et pour les Elite, un flux de missions d'audit qu'ils facturent avec le kit → ils deviennent prescripteurs.

## Le modèle de cohorte

Le contenu est en accès à vie, mais la **vente est par cohortes** (4 par an). Pourquoi :

- l'urgence est réelle (les lives et les revues suivent la cohorte) ;
- le groupe progresse ensemble, ce qui fait vivre la communauté ;
- vous concentrez l'effort d'animation sur 6 semaines par trimestre.

Entre deux cohortes, laissez la vente ouverte sans compte à rebours (`cohort.closesAt` dans le passé → la note « inscriptions closes, liste d'attente » s'affiche) ou basculez vers la cohorte suivante.

## Hypothèses de revenu

Une cohorte de 42 places, répartition observée sur ce type d'offre (à valider) :

| Palier | Part | Ventes | CA HT |
| --- | --- | --- | --- |
| Essentiel | 40 % | 17 | 8 330 € |
| Pro | 50 % | 21 | 31 290 € |
| Elite | 10 % | 4 | 19 600 € |
| **Total cohorte** | | 42 | **59 220 €** |

Quatre cohortes par an + upgrades + entreprise : un objectif de 250 à 300 k€ HT annuels est réaliste avec une audience de quelques milliers de professionnels du secteur. Le coût marginal est quasi nul (GitHub Pages est gratuit, PayPal prélève une commission par transaction) ; le coût réel est votre temps d'animation (lives, revues, coaching Elite).

## Ce qu'il faut préparer avant la première cohorte

- [ ] Des témoignages réels (offrez la cohorte 0 à 10 personnes de votre réseau contre un retour écrit et un accord de publication). `config.testimonials` est vide par défaut et la section reste masquée tant qu'il le reste : le site ne publie aucun témoignage fictif.
- [ ] La présentation du formateur (`site.instructor`), avec une expérience vérifiable. La section est masquée tant que le nom est vide.
- [ ] Le lead magnet (PDF de 8 pages) et 5 e-mails de séquence d'accueil.
- [ ] La bibliothèque de templates Pro (politique de médias, matrice de flux, runbook, checklist d'audit, rapport direction) au format docx/xlsx, livrée via un dossier partagé dont le lien est dans une leçon du module 3.
- [ ] Le kit d'audit Elite (grilles, modèles de rapport, lettre d'autorisation de test).
- [ ] Le calendrier des lives de la cohorte, publié sur la page Communauté.
- [ ] Un prix « early bird » (−30 %) pour les 10 premières places, via `price` et `priceBefore` dans la configuration.

## Indicateurs à suivre

| Indicateur | Source | Cible |
| --- | --- | --- |
| Visiteurs → newsletter | Plausible `Newsletter` / visiteurs uniques | > 5 % |
| Visiteurs page Tarifs → clic Checkout | événement `Checkout` | > 8 % |
| Clic Checkout → achat | PayPal | > 40 % |
| Taux de complétion (certificats délivrés) | déclaratif Discord + quiz | > 50 % |
| Remboursements | PayPal | < 5 % |
| Upgrades | PayPal | > 15 % des Essentiel sous 90 jours |

## Ce que le modèle statique ne fait pas, et comment compenser

- **Pas de compte utilisateur** : la progression est locale au navigateur (exportable). Compensation : l'espace membre propose export/import ; pour un suivi centralisé, l'API Vercel peut être étendue.
- **Clé de licence partagée par palier**. Compensation : `api/activate.js`, qui ne délivre la clé qu'après vérification d'un paiement réel ; et le contrat (CGV) qui interdit le partage. Dans les faits, le contenu B2B à ce prix est peu piraté ; la valeur est dans la communauté et les lives, qui ne se copient pas.
- **Pas de vidéo hébergée** : ajoutez des liens vers des vidéos non listées (YouTube/Vimeo) dans les `resources` d'une leçon, ou un lecteur intégré dans le Markdown. Les replays de lives suivent le même chemin.
