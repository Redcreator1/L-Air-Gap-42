# Kit de lancement — messages prêts à copier

Tous les textes ci-dessous sont à copier-coller depuis le navigateur. Aucune commande à exécuter.

**Trois règles avant de poster quoi que ce soit :**

1. **On partage le briefing ou les niveaux gratuits, jamais la page Tarifs.** Ces communautés sanctionnent la promotion directe, et le lien vers le contenu convertit mieux.
2. **Rien de ce qui n'existe pas.** Pas de lives, pas de coaching, pas de communauté active, pas de « déjà X apprenants » tant que c'est faux. Ce qui est écrit engage le vendeur (art. L121-2 C. conso.), et une communauté de sécurité repère une exagération en une lecture.
3. **Étape 0 de `ACQUISITION.md` faite d'abord.** Tant que l'adresse de contact rebondit et que le paiement n'est pas branché, chaque visiteur envoyé est un visiteur perdu.

Adresse publique du site : `https://redcreator1.github.io/L-Air-Gap-42/`

---

## 1. Recrutement de la cohorte 0 — message individuel

À envoyer un par un, jamais en copie groupée. Adaptez la première phrase à la personne : c'est elle qui fait la différence entre un message lu et un message supprimé.

> Bonjour [Prénom],
>
> [Une phrase précise et vraie sur la personne : où vous l'avez croisée, ce qu'elle a publié, sur quoi elle travaille.]
>
> J'ai passé les derniers mois à construire quelque chose sur la sécurité des systèmes isolés, et j'arrive au moment où j'ai besoin de gens qui font vraiment le métier pour me dire où ça casse.
>
> C'est un parcours de 45 niveaux qui se joue dans un terminal, hors-ligne, un niveau par jour. Pas de vidéo, pas de compte, pas de serveur : vous téléchargez une archive, vous vérifiez son empreinte, vous la lancez. Chaque niveau pose un concept, un atelier applicable sur votre environnement, et des questions de contrôle.
>
> Je cherche dix personnes à qui l'offrir en entier. Ce que je demande en échange : que vous fassiez au moins un module, que vous m'écriviez franchement ce qui ne va pas, et que je puisse citer quelques lignes de votre retour avec votre prénom, votre initiale et votre fonction. Un retour tiède m'est plus utile qu'un retour poli.
>
> Les trois premiers niveaux sont en accès libre si vous voulez juger avant de dire oui : [lien /jouer/]
> Et le briefing sur les sept erreurs les plus fréquentes, en lecture libre aussi : [lien /briefing/]
>
> Si ce n'est pas votre sujet, dites-le franchement, ça ne me vexera pas. Et si quelqu'un d'autre vous vient à l'esprit, je prends.
>
> [Votre nom]

**Relance, une seule, dix jours après :** deux lignes. « Je me permets une relance courte — le lien est toujours valable, et il me reste [N] places. Si le moment est mauvais, aucun souci. »

---

## 2. Hacker News — *Show HN*

Un seul essai utile. Postez un jour de semaine, en matinée sur la côte est des États-Unis.

**Titre** (HN privilégie le factuel, pas le superlatif) :

```
Show HN: An offline air-gap security wargame that runs in POSIX sh
```

**Premier commentaire**, à poster vous-même immédiatement après :

> Auteur ici. J'enseigne la sécurité des systèmes isolés, et j'ai fini par trouver absurde de le faire dans un navigateur connecté. Le parcours se joue donc hors-ligne, dans un terminal.
>
> Le lanceur est un seul fichier POSIX `sh`. Il ne contacte aucun serveur, n'écrit que dans son propre dossier, ne demande aucun privilège, et se lit intégralement avant d'être exécuté — ce qui me paraissait la moindre des choses pour un cours sur l'isolation.
>
> Les niveaux sont chiffrés dans le format natif d'`openssl enc` (AES-256-CBC, PBKDF2-HMAC-SHA256), donc le lanceur n'a aucune dépendance au-delà d'`openssl` et de `sh`. Chaque niveau porte un marqueur d'intégrité vérifié après déchiffrement : sans lui, AES-CBC rend des octets parasites avec une mauvaise clé, et une clé invalide passait pour valide — c'est un défaut que j'ai introduit puis corrigé, et c'est maintenant testé.
>
> Les trois premiers niveaux sont libres, et c'est le vrai contenu, pas une démo bridée. Le reste est payant ; j'ai essayé de rendre la page de vente ennuyeuse et exacte plutôt que l'inverse.
>
> Je prends volontiers les critiques sur le modèle de menace, et sur le lanceur.

**Ce à quoi vous devez être prêt :** on vous demandera pourquoi c'est payant, pourquoi `sh` plutôt qu'autre chose, et on relèvera que le dépôt est public (voir `SETUP.md` §8). Répondez directement, sans défensive. Un auteur qui reconnaît une limite gagne le fil ; un auteur qui argumente le perd.

---

## 3. Reddit — r/netsec, r/ICS_Security

**Ne postez pas le produit.** Postez le briefing. Lisez les règles du sous-reddit avant : plusieurs interdisent tout lien commercial, et un compte neuf qui poste un lien est retiré automatiquement.

**Titre :**

```
Seven recurring failures in supposedly air-gapped environments, and how to test for each
```

**Corps :**

> J'ai rassemblé les sept défaillances que je retrouve le plus souvent entre « ce système est isolé » et « ce système est prouvé isolé » : matrice de flux absente ou périmée, supports amovibles traités comme un accessoire alors qu'ils sont l'interface officielle de l'air gap, chaîne d'approvisionnement qui entre par la grande porte, accès de télémaintenance absents des schémas, détection concentrée sur le périmètre et inexistante à l'intérieur, canaux de sortie hors réseau jamais arbitrés dans le modèle de menace, et le fait que la barrière sépare des réseaux mais pas les gens.
>
> Pour chacune j'ai mis la vérification qui tranche, applicable sans outillage.
>
> [lien /briefing/]
>
> C'est le briefing d'introduction d'un parcours que je vends, je le précise pour ne pas avancer masqué — mais celui-ci est en lecture libre, sans inscription et sans adresse e-mail à donner. Les points 3 et 6 sont ceux sur lesquels j'aimerais le plus être contredit.

---

## 4. LinkedIn — post en français

Le canal le plus direct vers les acheteurs français. Pas de lien dans le corps du post — LinkedIn en diminue fortement la portée ; mettez-le en premier commentaire.

> « Le système est isolé. »
>
> C'est la phrase que j'entends le plus souvent, et c'est presque toujours une supposition, pas une constatation.
>
> Le test est pourtant simple : demandez à voir la matrice de flux. Dans la majorité des environnements dits isolés, elle n'existe pas, ou elle date de la mise en service. Entre-temps il y a eu un automate remplacé, un prestataire qui a raccordé son portable, un modem de télémaintenance posé pour un diagnostic et jamais retiré.
>
> Un air gap n'est pas un état. C'est une contrainte à maintenir, et elle ne se dégrade pas par attaque : elle se dégrade par accumulation d'exceptions raisonnables. Chacune était justifiée. Aucune n'a été refermée.
>
> J'ai écrit les sept défaillances que je retrouve le plus souvent, avec pour chacune la vérification qui permet de trancher sur son propre environnement. C'est en lecture libre, sans inscription. Lien en commentaire.
>
> Et vous, quand avez-vous vérifié la vôtre pour la dernière fois ?

**Premier commentaire :** le lien vers `/briefing/`, et une phrase — « Le briefing complet ici, sans inscription : [lien] ».

---

## 5. Approche directe — RSSI et consultants

Trente messages travaillés, pas trois cents envoyés. Le ratio se joue entièrement sur la première phrase, qui doit prouver que vous avez regardé la personne.

> Bonjour [Prénom],
>
> [Une phrase vraie et précise : son intervention, sa publication, le secteur de son organisation.]
>
> Je viens de publier un briefing sur les sept défaillances les plus fréquentes des environnements isolés — matrice de flux, supports amovibles, télémaintenance oubliée, détection interne absente. C'est en lecture libre, sans inscription : [lien /briefing/]
>
> Je ne vous écris pas pour vous vendre quelque chose aujourd'hui. Je construis un parcours de formation sur ce sujet et je cherche à savoir si ce que j'y traite correspond à ce que vous rencontrez réellement. Quinze minutes de votre temps pour me dire ce qui manque me seraient très utiles.
>
> Si le sujet n'est pas le vôtre, ignorez ce message sans scrupule.
>
> [Votre nom]

**Ce qui fait échouer ce message :** une première phrase générique, une demande de rendez-vous commercial déguisée, ou une relance automatique. Une seule relance, courte, et on passe à autre chose.

---

## 6. Conférences et associations

On n'y vend pas, on y contribue. Une intervention acceptée vaut plus que n'importe quel budget publicitaire.

| Où | Format | À vérifier |
| --- | --- | --- |
| SSTIC | article ou conférence courte | échéance de soumission, chaque année différente |
| InCyber Forum (Lille) | table ronde, rencontres | c'est là que sont les RSSI avec un budget |
| Barbhack, LeHACK | présentation technique | public praticien, très bon pour le wargame |
| Botconf | présentation | angle détection |
| CLUSIF, CESIN, Club EBIOS | groupe de travail, retour d'expérience | adhésion souvent requise |

**Sujet de proposition qui fonctionne** (il raconte une histoire, il ne vend rien) :

> « Prouver l'isolation : ce que l'on découvre en testant les air gaps au lieu de les déclarer »
>
> Retour sur les sept écarts récurrents entre l'architecture documentée et l'architecture réelle des environnements isolés, et sur les vérifications qui permettent de les mettre en évidence sans outillage offensif.

---

## Calendrier des quatre premières semaines

| Semaine | Ce que vous faites | Ce que vous obtenez |
| --- | --- | --- |
| 1 | Étape 0 : les quatre champs de `config.js`. Puis l'arbitrage cohorte / accès continu. | Un visiteur peut acheter, s'inscrire, écrire. |
| 2 | Les dix messages de la cohorte 0, un par un. | Trois à cinq réponses, si les messages sont personnalisés. |
| 3 | LinkedIn et Reddit sur le briefing. Pas encore Hacker News. | Du trafic, et surtout les premières objections réelles. |
| 4 | Retours de la cohorte 0 → corrections du produit → premiers témoignages publiés. | De quoi vendre. C'est seulement ici que Hacker News vaut la peine. |

Hacker News en dernier, volontairement : on n'y passe qu'une fois, et il vaut mieux y arriver avec un produit déjà corrigé par dix praticiens.
