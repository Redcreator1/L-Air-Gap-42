---
minutes: 22
---

Chaque incident ci-dessous a touché un système que ses exploitants considéraient comme isolé. Aucun n’a nécessité une faille dans l’isolation elle-même : tous ont exploité **ce qui traverse l’isolation par conception**.

Nous les présentons non pas pour la technique, mais pour la *leçon d’architecture* que chacun impose. À la fin, vous disposerez d’une grille de six questions à poser à n’importe quel air gap.

## Objectifs

- Identifier, pour six incidents publics, le « pont » qui a été utilisé et pourquoi il existait.
- Extraire de chaque cas une question d’audit réutilisable.
- Comprendre pourquoi la plupart des ponts sont légitimes, documentés, et pourtant fatals.

## 1. Le média amovible autorisé (Stuxnet, 2010)

Le cas fondateur. Des systèmes de contrôle industriel isolés ont été atteints par du code transporté sur des supports amovibles utilisés par des intervenants, puis propagé entre postes d’ingénierie avant d’atteindre les automates.

**Le pont :** les clés USB étaient un moyen *officiel* de transporter fichiers de projet et mises à jour. Personne ne les a introduites en fraude.

**Leçon d’architecture :** un média autorisé est une interface réseau à part entière. Il mérite la même politique : origine contrôlée, contenu vérifié, journalisation de chaque insertion.

> Question d’audit n° 1 : *Pouvez-vous lister chaque média inséré dans le périmètre sur les 90 derniers jours, avec sa provenance ?*

## 2. Le poste d’ingénierie à double usage

Scénario décrit à plusieurs reprises dans des rapports publics d’agences nationales de cybersécurité : un ordinateur portable d’ingénieur sert à la fois à programmer les automates du réseau isolé et à lire ses e-mails sur le réseau d’entreprise. Il alterne entre les deux mondes plusieurs fois par jour.

**Le pont :** l’humain, par commodité. Le laptop est *techniquement* déconnecté du réseau isolé quand il est sur Internet. Mais son disque, lui, fait le voyage.

**Leçon d’architecture :** l’isolation s’applique aux équipements, pas aux moments. Un équipement qui a touché les deux zones appartient à la zone la moins sûre, définitivement.

> Question d’audit n° 2 : *Existe-t-il un équipement, y compris portable, qui a été connecté aux deux côtés de l’isolation dans sa vie ?*

## 3. Le modem de télémaintenance oublié

Cas régulièrement décrit dans la littérature publique sur les infrastructures critiques : un fabricant installe, à la livraison d’une machine, un modem cellulaire pour son propre support à distance. Il figure sur le bon de livraison, pas sur le schéma réseau. Des années plus tard, il fonctionne encore, avec un mot de passe par défaut.

**Le pont :** une connexion externe *fournie par un tiers*, en dehors du processus de conception du réseau.

**Leçon d’architecture :** l’inventaire doit être fait depuis l’intérieur du périmètre (que voit-on physiquement dans l’armoire ?) et non depuis le schéma. Le module 4 vous apprendra à détecter ces émetteurs.

> Question d’audit n° 3 : *Avez-vous physiquement inspecté chaque armoire à la recherche d’interfaces radio ou modem non documentées ?*

## 4. La mise à jour piégée en amont

Plusieurs campagnes publiques ont visé des éditeurs de logiciels pour insérer du code malveillant dans des mises à jour légitimes, signées avec les clés de l’éditeur. Les organisations isolées ont importé ces mises à jour par leur processus normal, avec vérification de signature.

**Le pont :** la chaîne d’approvisionnement logicielle. La vérification a fonctionné : le paquet était authentique. Le problème était en amont.

**Leçon d’architecture :** la signature prouve l’origine, pas l’innocuité. Un environnement isolé doit ajouter une **fenêtre de quarantaine** et une vérification comportementale avant déploiement, précisément parce qu’il ne bénéficiera pas d’une alerte en temps réel.

> Question d’audit n° 4 : *Quel délai et quel contrôle séparent la publication d’une mise à jour de son déploiement dans le périmètre isolé ?*

## 5. Le partage de fichiers « temporaire »

Situation classique en salle de supervision : un partage réseau créé lors d’une migration pour transférer des historiques entre le réseau de production et le réseau bureautique. La migration a duré trois semaines. Le partage est resté quatre ans.

**Le pont :** l’exception au processus, jamais révoquée.

**Leçon d’architecture :** toute exception doit naître avec une date de fin et un propriétaire nommé. Sans mécanisme de révocation automatique, l’exception devient l’architecture.

> Question d’audit n° 5 : *Chaque exception d’isolation a-t-elle une date d’expiration et un propriétaire encore en poste ?*

## 6. Le canal caché démontré en laboratoire

Des équipes de recherche ont démontré à plusieurs reprises l’exfiltration de données depuis des machines isolées via des émissions électromagnétiques, acoustiques, optiques ou thermiques, captées à quelques mètres. Ces démonstrations exigent d’abord une compromission de la machine, et les débits sont très faibles.

**Le pont :** la physique. Toute machine rayonne.

**Leçon d’architecture :** ces canaux sont réels mais **secondaires** : ils supposent un adversaire déjà à l’intérieur. Le module 5 vous aidera à les traiter proportionnellement, sans céder à la fascination technique ni à la négligence.

> Question d’audit n° 6 : *Vos actifs les plus sensibles ont-ils une exigence explicite de distance ou de blindage, ou bien la question n’a jamais été posée ?*

## Ce que ces six cas ont en commun

Relisez les six « ponts » : média autorisé, équipement à double usage, connexion tierce, mise à jour légitime, exception non révoquée, physique. **Aucun n’est une intrusion.** Tous sont des fonctionnalités, des commodités ou des lois de la nature.

C’est la thèse centrale de ce programme : *un air gap ne se défend pas contre des attaques, il se défend contre ses propres exceptions.*

:::warning Le piège de la fascination
Les canaux cachés font de bons articles. Les clés USB de prestataires font de vrais incidents. Priorisez par fréquence observée, pas par spectaculaire.
:::

## Mise en pratique (15 minutes)

Reprenez les six questions d’audit. Pour votre système, répondez à chacune par **oui**, **non** ou **je ne sais pas**. Comptez les « je ne sais pas » : c’est votre dette de visibilité, et c’est ce que la leçon suivante attaque.

```quiz
[
  {
    "q": "Point commun aux six incidents présentés ?",
    "choices": [
      "Une faille logicielle non corrigée",
      "Un pont légitime ou une exception, jamais une intrusion réseau",
      "Un attaquant interne malveillant",
      "Un défaut de chiffrement"
    ],
    "answer": 1,
    "explain": "Chaque cas exploite quelque chose qui traverse l’isolation par conception : média, équipement, tiers, mise à jour, exception ou physique."
  },
  {
    "q": "Une mise à jour correctement signée par l’éditeur garantit :",
    "choices": ["Qu’elle est sans danger", "Son origine, pas son innocuité", "Qu’elle a été testée par un tiers", "Sa compatibilité"],
    "answer": 1,
    "explain": "La signature authentifie la source. Si la source est compromise en amont, la signature est valide et le contenu malveillant."
  },
  {
    "q": "Que faire d’un portable qui a été connecté aux deux côtés de l’isolation ?",
    "choices": ["Le nettoyer avec un antivirus puis le réutiliser côté isolé", "Le considérer comme appartenant à la zone la moins sûre", "L’isoler 24 h avant réutilisation", "Rien, s’il était déconnecté au moment du transfert"],
    "answer": 1,
    "explain": "L’isolation s’applique aux équipements, pas aux moments : un équipement qui a touché les deux zones reste du côté le moins sûr."
  }
]
```
