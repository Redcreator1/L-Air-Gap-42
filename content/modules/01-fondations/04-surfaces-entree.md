---
minutes: 25
---

Une fois le périmètre réduit à l’essentiel, énumérez **exhaustivement** par où quelque chose peut entrer ou sortir. Nous en comptons neuf. Si votre modèle en liste moins, il est incomplet ; s’il en liste plus, vous avez probablement dédoublé.

## Objectifs

- Connaître les neuf surfaces et l’exemple typique de chacune.
- Pour chaque surface, savoir si elle est fermée, contrôlée ou ouverte dans votre périmètre.
- Produire la liste des surfaces « ouvertes sans contrôle » : vos urgences.

## Les neuf surfaces

1. **Réseau filaire.** Tout port Ethernet, série, bus de terrain avec un chemin vers l’extérieur. Y compris les liens « temporaires ».
2. **Radio.** Wi-Fi, Bluetooth, cellulaire, LoRa, protocoles propriétaires, NFC. Inclut les équipements *fournis* avec une radio non demandée.
3. **Médias amovibles.** USB, cartes SD, disques externes, disques optiques. Inclut les périphériques USB « non stockage » (claviers, adaptateurs), qui peuvent embarquer du stockage ou se présenter comme tels.
4. **Équipements nomades.** Portables, tablettes, consoles de programmation, analyseurs. Tout ce qui entre et ressort avec un disque.
5. **Chaîne d’approvisionnement.** Matériel neuf, pièces de rechange, logiciels, mises à jour, firmwares. Tout ce qui est *installé*.
6. **Personnes.** Accès physique : employés, prestataires, visiteurs. Ce qu’elles savent, ce qu’elles portent, ce qu’elles photographient.
7. **Périphériques de proximité.** Écrans (lisibles à distance), imprimantes (avec mémoire), claviers (émissions), caméras de surveillance (qui filment les écrans).
8. **Physique / émissions.** Électromagnétique, acoustique, optique, thermique, vibrations. Traité au module 5.
9. **Sorties légitimes.** Sauvegardes, exports, diagnostics, rapports, journaux envoyés vers l’extérieur. La surface la plus oubliée.

## Trois états par surface

| État | Définition | Exemple |
| --- | --- | --- |
| Fermée | La surface n’existe pas physiquement ou est neutralisée de façon vérifiable | Ports USB obturés et scellés, radio retirée de la carte |
| Contrôlée | La surface existe, un processus documenté et journalisé l’encadre | Sas de transfert avec double contrôle |
| Ouverte | La surface existe et rien ne l’encadre de façon vérifiable | « On fait attention » |

:::note Le mot « vérifiable »
Une surface est fermée ou contrôlée seulement si un auditeur extérieur peut le constater sans vous croire sur parole : un scellé, un journal, un schéma d’équipement. Sinon, elle est ouverte.
:::

## Mise en pratique

Construisez une grille 9 surfaces × N actifs (ou groupes d’actifs). Remplissez chaque case avec F, C ou O. Comptez les O. Chacune est une priorité de remédiation. Les modules 2 et 3 vous donneront les moyens de transformer O en C, et parfois C en F.

## Checklist

- [ ] Les neuf surfaces sont évaluées pour chaque groupe d’actifs
- [ ] Chaque « fermée » ou « contrôlée » s’appuie sur un élément vérifiable
- [ ] Les sorties légitimes (surface 9) sont inventoriées avec la même rigueur que les entrées

```quiz
[
  {"q":"Un port USB « désactivé par stratégie de groupe » est une surface :","choices":["Fermée","Contrôlée","Ouverte","Inexistante"],"answer":2,"explain":"Sans processus journalisé ni preuve physique, une désactivation logicielle réversible ne constitue ni une fermeture ni un contrôle vérifiable."},
  {"q":"Quelle surface est le plus souvent absente des modèles de menace ?","choices":["Le réseau filaire","Les médias amovibles","Les sorties légitimes","Les personnes"],"answer":2,"explain":"Les isolations sont pensées contre les entrées ; sauvegardes, exports et diagnostics sortent sans encadrement."}
]
```
