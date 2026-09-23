---
minutes: 22
---

Le kiosque de décontamination (ou station blanche) est un poste dédié qui analyse les médias avant leur entrée dans le périmètre. Il est utile. Il n’est pas magique. Cette leçon vous aide à le concevoir, à savoir ce qu’il détecte, et surtout ce qu’il ne détecte pas.

## Objectifs

- Définir les fonctions d’un kiosque et ses limites de détection.
- Concevoir son architecture : isolé lui-même, journalisé, réinitialisable.
- Le positionner dans la chaîne du sas comme un contrôle parmi d’autres.

## Ce qu’un kiosque fait

- **Analyse multi-moteurs** : plusieurs antivirus, pour réduire les angles morts d’un seul éditeur.
- **Filtrage par type** : seuls les types de fichiers attendus passent (liste blanche d’extensions *et* de signatures de format).
- **Reconstruction de contenu** (CDR) : les documents sont reconstruits sans macros, scripts ni objets embarqués. Efficace contre les documents piégés.
- **Transfert vers un média dédié** : le média extérieur ne va jamais plus loin que le kiosque ; le contenu est copié sur un média entrant (leçon 15).
- **Journal** : qui, quand, quoi, résultat, hachage de chaque fichier.

## Ce qu’un kiosque ne fait pas

- Détecter un code malveillant inconnu ou ciblé. Les antivirus détectent ce qu’ils connaissent.
- Vérifier qu’un fichier *légitime* est celui attendu (un programme automate modifié est un programme automate valide).
- Protéger contre un périphérique USB qui n’est pas un stockage (un « clavier » qui tape des commandes).
- Remplacer la vérification d’origine par signature (leçon 18) ni la quarantaine (leçon 19).

| Menace | Kiosque | Signature | Quarantaine | Double contrôle |
| --- | --- | --- | --- | --- |
| Malware connu | oui | — | — | — |
| Document piégé | oui (CDR) | — | — | — |
| Mise à jour amont compromise | non | non | partiel | non |
| Fichier légitime altéré par un initié | non | oui | — | oui |
| Périphérique USB malveillant | non | — | — | non (isolation physique du port) |

## Architecture du kiosque

Le kiosque est lui-même un système à risque : il touche tous les médias extérieurs. Il doit être **isolé du périmètre** (il n’a aucun lien réseau avec lui), **réinitialisé** régulièrement à partir d’une image maîtresse (idéalement à chaque démarrage), et ses **mises à jour de signatures** doivent arriver par un canal qui n’est pas le média analysé (média dédié, ou diode entrante dédiée aux signatures avec quarantaine).

:::note Kiosque commercial ou construit ?
Les solutions commerciales apportent le multi-moteurs et le CDR clé en main. Une station construite en interne apporte la maîtrise. Dans les deux cas, exigez : journal exportable, réinitialisation d’image, et démonstration de ce que la solution ne détecte pas.
:::

## Mise en pratique

Décrivez votre kiosque actuel ou cible sur le tableau ci-dessus. Pour chaque « non », identifiez le contrôle complémentaire (leçons 17 à 19) qui couvre la menace.

## Checklist

- [ ] Kiosque sans lien réseau avec le périmètre, réinitialisé depuis une image
- [ ] Multi-moteurs, liste blanche de types, CDR pour les documents
- [ ] Journal avec hachage de chaque fichier
- [ ] Limites documentées et couvertes par d’autres contrôles

## Le cas SITE 42

Le rapport imprimé par le kiosque de SITE 42 le jour de l’incident du 02/09.

```
SITE 42 - rapport du kiosque, media usb-presta-07, 02/09

  fichiers analyses         412
  moteurs antiviraux        3, signatures du 28/08
  detections                0
  types non reconnus        1  (maj-plc.bin, format proprietaire)
  fichiers non analysables  2  (archives chiffrees, sans mot de passe)
  verdict imprime           AUCUNE MENACE DETECTEE
```

```epreuve
{
  "enonce": "Le verdict est devenu une autorisation de franchissement, alors que trois fichiers n'ont pas été réellement analysés. Donnez le nom du fichier dont le format n'a pas pu être reconnu.",
  "reponse": "maj-plc.bin",
  "indice": "Un antivirus reconnaît ce qui est déjà connu, et rien d'autre."
}
```
