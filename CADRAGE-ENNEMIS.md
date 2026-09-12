# Cadrage — Système d’ennemis de Dental Defender

## Objectif

Rendre la difficulté progressive dès le niveau 1, en combinant :

- une composition de vagues maîtrisée ;
- une progression des statistiques par niveau et par vague ;
- des catégories d’ennemis identifiables par leur visuel et leur rôle ;
- une structure extensible pour de futures capacités ennemies et bonus de dégâts.

Le nombre d’ennemis par vague est conservé dans un premier temps afin de mesurer
l’effet de la composition et des statistiques sans ajouter une troisième source
de difficulté.

## Principes de gameplay

Chaque ennemi est un archétype avec un rôle lisible :

| Catégorie | Rôle initial | Introduction | Résistance de départ |
| --- | --- | --- | --- |
| Carie vorace | Rapide et fragile | Niveau 1 | 1 PV |
| Tartre tenace | Lent et résistant | Niveau 1, minoritaire | 2 PV |
| Sucre collant | Intermédiaire, à préciser | Niveau 2 | À équilibrer |

Les visuels actuels sont conservés, mais leur rendu doit dépendre de la
catégorie plutôt que d’un simple tirage de couleur.

Les capacités ennemies sont prévues dans le modèle, mais aucune capacité active
n’est introduite dans cette évolution.

## Modèle de statistiques

Un tir standard inflige `1` dégât. Les PV et les dégâts peuvent être décimaux ;
aucun arrondi ne doit intervenir dans la logique de jeu.

Pour chaque statistique, la progression suit une formule commune avec des
paramètres propres à l’archétype :

```text
valeur = valeurDeBase
       + progressionParNiveau × (niveau - 1)
       + progressionParVague × (vague - 1)
```

Les futurs bonus de dégâts s’appliquent séparément :

```text
dégâts = dégâtsDeBase + bonusDeDégâts
dégâtsAprèsMultiplicateurs = dégâts × multiplicateur
```

Le multiplicateur est réservé à une évolution ultérieure. Les bonus actuels de
cadence, largeur et multiplicité des tirs restent indépendants des dégâts.

Chaque instance d’ennemi doit recevoir ses valeurs calculées au moment du
spawn, notamment `hp`, `maxHp`, `speed` et `damage` si ce champ devient utile.

## Composition des vagues

La composition est explicite et progressive, avec des pourcentages ou poids
configurés par niveau et éventuellement par vague. Le nombre total d’ennemis
reste issu de la formule actuelle.

Règle de progression retenue :

- niveau 1 : caries majoritaires, tartres minoritaires ;
- niveau 2 : introduction progressive des sucres ;
- niveaux suivants : augmentation contrôlée des ennemis rapides et résistants ;
- exceptions possibles pour créer une vague spéciale testable.

Le tirage d’un ennemi utilise la composition prévue pour la vague. La
composition ne doit pas être uniformément aléatoire lorsque cela contredit la
progression attendue.

## Hors périmètre

- capacités actives des ennemis ;
- augmentation du nombre d’ennemis par vague ;
- nouveau système de boss ;
- refonte graphique complète ;
- bonus de dégâts implémentés immédiatement.

## Critères d’acceptation

- Le niveau 1 reste jouable et introduit distinctement carie et tartre.
- Le sucre n’apparaît pas avant le niveau 2.
- Une attaque standard retire exactement `1` PV.
- Un ennemi est détruit uniquement lorsque ses PV sont inférieurs ou égaux à
  zéro.
- Les PV, vitesses et compositions évoluent selon des paramètres lisibles.
- Les paramètres d’un ennemi sont centralisés et ne sont pas recalculés de
  manière dispersée dans la boucle de jeu.
- Les mécanismes sont documentés et les valeurs peuvent être ajustées sans
  modifier la logique de collision.
