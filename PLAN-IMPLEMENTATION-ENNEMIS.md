# Plan d’implémentation — Système d’ennemis

## 1. Stabiliser le modèle de données

- Transformer `enemyTypes` en définition complète d’archétypes.
- Ajouter un identifiant stable, le rendu, les points, les statistiques de base
  et leurs progressions.
- Ajouter `abilities` avec des capacités désactivées par défaut.
- Ajouter une fonction de calcul des statistiques pour un niveau et une vague.

## 2. Introduire les dégâts explicites

- Ajouter `damage: 1` aux tirs créés par `shoot()`.
- Remplacer le décrément implicite des PV par `e.hp -= shot.damage`.
- Préserver les tirs larges, doubles et multiples sans leur attribuer
  automatiquement un dégât supplémentaire.
- Ne pas arrondir les PV ou les dégâts.

## 3. Configurer la composition

- Définir les poids ou pourcentages disponibles par niveau et par vague.
- Ajouter une sélection pondérée d’un archétype.
- Garantir l’absence de sucre au niveau 1.
- Prévoir une surcharge de configuration pour une vague spéciale.
- Conserver la formule actuelle du nombre total d’ennemis.

## 4. Adapter le spawn et le rendu

- Calculer les statistiques au moment du spawn.
- Conserver les coordonnées, la phase d’animation et la vitesse effective de
  chaque instance.
- Faire reposer `drawEnemy()` sur l’archétype et non uniquement sur sa couleur.
- Ajouter l’affichage des PV uniquement si cela améliore la lisibilité sans
  surcharger l’écran.

## 5. Vérifier les interactions existantes

- Vérifier les collisions tir/ennemi avec plusieurs tirs nécessaires.
- Vérifier la progression `destroyed`, des vagues et des mini-boss.
- Vérifier que les ennemis qui atteignent le bas retirent toujours une vie.
- Vérifier que les bonus de cadence, largeur et multiplicité fonctionnent
  toujours comme avant.
- Vérifier le redémarrage et la remise à zéro des instances.

## 6. Équilibrer par étapes

Tester au minimum les niveaux 1, 2, 3, 5 et 12 :

- durée moyenne d’une vague ;
- nombre de tirs nécessaires par catégorie ;
- fréquence de chaque catégorie ;
- nombre de vies perdues ;
- difficulté perçue au passage du niveau 2 au niveau 3.

Commencer avec une difficulté conservatrice. Modifier une famille de paramètres
à la fois : d’abord les PV, puis les vitesses, puis les compositions.

## 7. Documenter et finaliser

- Maintenir ce plan jusqu’à la fin de l’évolution.
- Mettre à jour `CADRAGE-ENNEMIS.md` lorsque les valeurs initiales sont
  confirmées par les tests.
- Ajouter dans `GAMEPLAY.md` les valeurs finales si ce fichier est créé lors de
  l’implémentation.
- Mettre à jour le README uniquement pour pointer vers la documentation de
  gameplay, sans y recopier les règles détaillées.

## Ordre recommandé des changements

1. Modèle d’archétype et calcul des statistiques.
2. Dégâts explicites sur les tirs.
3. Composition pondérée des vagues.
4. Adaptation du spawn et du rendu.
5. Tests de non-régression.
6. Simulation et équilibrage.
7. Documentation des valeurs finales.

Chaque étape doit être vérifiée avant de passer à la suivante. Les capacités
ennemies et les multiplicateurs de dégâts restent des extensions ultérieures.
