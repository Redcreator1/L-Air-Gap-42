---
minutes: 22
---

Les canaux cachés fascinent : des données qui sortent d’une machine isolée par la lumière d’une LED, le bruit d’un ventilateur, la chaleur d’un processeur. Cette leçon les présente pour ce qu’ils sont : **réels, démontrés, et secondaires**. Vous apprendrez à les situer dans votre modèle sans les surestimer ni les ignorer.

## Objectifs

- Connaître les familles de canaux cachés démontrées en recherche et leurs ordres de grandeur.
- Comprendre le prérequis commun : une compromission préalable de la machine.
- Décider, selon votre modèle de menace, du budget qu’ils méritent.

## Le prérequis que tout le monde oublie

Tous les canaux cachés d’exfiltration démontrés supposent qu’un code malveillant s’exécute **déjà** sur la machine isolée et module intentionnellement une émission physique. Autrement dit : le pont d’entrée a déjà été franchi (module 3), et la détection (module 4) n’a rien vu. Le canal caché est l’étape *après* l’échec de tout le reste.

Conséquence : si vos modules 3 et 4 sont faibles, investir dans les contre-mesures physiques revient à blinder la fenêtre d’une maison dont la porte est ouverte.

## Les familles

| Famille | Support physique | Portée typique | Débit typique | Prérequis côté récepteur |
| --- | --- | --- | --- | --- |
| Électromagnétique | Émissions des bus, écrans, câbles | Mètres à dizaines de mètres | Bits à kbits/s | Récepteur radio à proximité |
| Acoustique | Haut-parleurs, ventilateurs, disques, composants | Mètres | Bits/s | Microphone (un téléphone suffit) |
| Optique | LED d’activité, luminosité d’écran | Ligne de vue, dizaines de mètres | Bits à kbits/s | Caméra en ligne de vue |
| Thermique | Chaleur émise, capteurs de la machine voisine | Centimètres | Bits/heure | Machine adjacente compromise |
| Vibration / alimentation | Vibrations, consommation électrique | Mètres / même circuit | Bits/s | Capteur ou compteur compromis |

Ordres de grandeur à retenir : des débits **faibles** (quelques clés cryptographiques, pas une base de données), des portées **courtes**, un récepteur **physiquement proche** ou une ligne de vue.

## Qui les utilise vraiment

Retour à la matrice adversaire × pont (module 1, leçon 2) : seul l’acteur ciblé et financé les met en œuvre, et seulement pour des actifs dont la valeur justifie une opération longue avec présence physique. Pour la majorité des périmètres, le risque résiduel après modules 3 et 4 est faible et **accepté explicitement** dans le modèle de menace. Pour les périmètres à enjeu stratégique, la leçon suivante détaille les contre-mesures proportionnées.

:::note L’autre sens
Les canaux cachés servent aussi en *entrée* : commander un implant déjà présent via un signal externe (radio, lumière, son). Même prérequis : l’implant est déjà là.
:::

## Mise en pratique

Dans votre modèle de menace, ajoutez une ligne « canaux cachés » avec l’une des deux décisions : « risque résiduel accepté, adversaire ciblé non retenu » ou « contre-mesures proportionnées, voir leçon 30 ». Signez.

## Checklist

- [ ] Compréhension du prérequis (compromission préalable)
- [ ] Familles et ordres de grandeur connus
- [ ] Décision écrite et signée dans le modèle de menace

```quiz
[
  {"q":"Prérequis commun à tous les canaux cachés d’exfiltration ?","choices":["Un réseau Wi-Fi à proximité","Un code malveillant s’exécutant déjà sur la machine isolée","Un initié","Une faille firmware"],"answer":1,"explain":"Le canal caché est l’étape après l’échec du sas et de la détection ; il ne remplace pas une entrée."},
  {"q":"Ordre de grandeur des débits démontrés ?","choices":["Mégabits par seconde","Quelques bits à quelques kilobits par seconde","Gigabits","Illimité en ligne de vue"],"answer":1,"explain":"Assez pour exfiltrer des clés ou des mots de passe, pas des bases de données."}
]
```
