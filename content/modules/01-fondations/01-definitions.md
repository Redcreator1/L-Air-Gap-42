---
minutes: 20
---

Les mots que vous employez dans un dossier d’architecture, un contrat de maintenance ou un rapport d’audit **engagent**. Dire « air gap » quand on a une isolation logique, c’est promettre quelque chose qu’on ne tient pas. Cette leçon fixe le vocabulaire du programme, et vous donne un test simple pour chaque terme.

## Objectifs

- Distinguer air gap physique, isolation logique, isolation unidirectionnelle et segmentation.
- Savoir quel niveau vous avez réellement, avec un test observable.
- Employer le bon terme dans vos documents pour éviter la sur-promesse.

## Les quatre niveaux

**Air gap physique.** Aucun chemin électrique, optique ou radio entre le périmètre et tout autre réseau. Le test : *pouvez-vous suivre chaque câble et chaque antenne, et montrer qu’aucun ne sort ?* Si un équipement possède une interface radio active, ce n’est pas un air gap physique.

**Isolation unidirectionnelle.** Un lien existe, mais la physique garantit qu’il ne fonctionne que dans un sens (diode de données, passerelle unidirectionnelle). Le test : *le sens interdit est-il impossible par construction, ou par configuration ?* Une règle de pare-feu n’est pas une diode.

**Isolation logique.** Les chemins existent mais sont bloqués par des équipements configurables : pare-feu, VLAN, listes de contrôle. Le test : *une erreur de configuration ou une compromission de l’équipement de filtrage ouvrirait-elle un chemin ?* Si oui, vous êtes ici.

**Segmentation.** Le réseau est découpé, les flux sont filtrés, mais des connexions bidirectionnelles légitimes existent. C’est la norme en informatique d’entreprise. Ce n’est pas de l’isolation.

## Le tableau qui évite les malentendus

| Niveau | Ce qui bloque | Ce qui casse l’isolation | Vocabulaire à employer |
| --- | --- | --- | --- |
| Air gap physique | L’absence de chemin | Un média, un humain, la physique | « isolé physiquement » |
| Unidirectionnel | La physique du lien | Une seconde voie, un retour caché | « isolé en entrée » ou « en sortie » |
| Logique | La configuration | Une erreur, une compromission du filtre | « cloisonné » |
| Segmentation | Des règles | Une règle trop large | « segmenté » |

:::warning Le glissement sémantique
Le glissement le plus fréquent : un système déployé en air gap physique reçoit un lien « juste pour la supervision ». Il devient logiquement isolé. Mais les documents, les contrats et la culture de l’équipe continuent de dire « air gap ». Personne n’a menti ; la réalité a bougé.
:::

## Mise en pratique

Reprenez votre carte de périmètre du module 0. Pour chaque actif, écrivez son niveau réel en utilisant les tests ci-dessus. Puis ouvrez le dernier document officiel (schéma, PSSI, contrat) qui décrit ce système : quel terme emploie-t-il ? Notez chaque écart.

## Checklist

- [ ] Chaque actif a un niveau d’isolation qualifié par un test observable, pas par une intention
- [ ] Les documents officiels emploient le terme correspondant au niveau réel
- [ ] Les interfaces radio présentes sont traitées comme des chemins, même « désactivées »

## Le cas SITE 42

Le dossier d'architecture de SITE 42 qualifie ces quatre liens d'« air gap ». Appliquez les tests de la leçon.

```
SITE 42 - liens quittant la zone de conduite

lien                                   ce qui empeche le sens interdit
-------------------------------------  ------------------------------
scada-serveur-01 -> diode-sortie-01    la physique du composant optique
scada-serveur-01 -> relais-fichiers-01 une regle sur fw-dmz-01
hmi-salle-01 -> plc-pompage-03         rien, le lien est bidirectionnel
hist-donnees-01 -> poste-bureau-12     aucun lien : rien n est cable
```

```epreuve
{
  "enonce": "Un seul de ces liens relève de l'isolation logique au sens de la leçon : son sens interdit n'est bloqué que par une configuration. Donnez le nom de son équipement de destination.",
  "reponse": "relais-fichiers-01",
  "indice": "Une règle de pare-feu n'est pas une diode."
}
```
