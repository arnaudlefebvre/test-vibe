# Découpage en sessions — Système d’ennemis

Ce document découpe [PLAN-IMPLEMENTATION-ENNEMIS.md](PLAN-IMPLEMENTATION-ENNEMIS.md)
en sessions exécutables strictement dans l’ordre numérique.

Une session ne doit pas commencer tant que la précédente n’est pas vérifiée.
Les sessions sont prévues pour le même dépôt et le même agent d’implémentation.
Chaque session doit préserver les modifications existantes qui ne concernent
pas directement son périmètre.

## Vue d’ensemble

| Session | Sujet | Dépend de |
| --- | --- | --- |
| 00 | État initial et garde-fous | — |
| 01 | Modèle d’archétype et statistiques | 00 |
| 02 | Dégâts explicites et PV | 01 |
| 03 | Composition progressive des vagues | 02 |
| 04 | Spawn et rendu par catégorie | 03 |
| 05 | Non-régression du jeu | 04 |
| 06 | Simulation et équilibrage | 05 |
| 07 | Documentation finale | 06 |

---

## Session 00 — État initial et garde-fous

### Prompt de lancement

> Inspecte l’état actuel du dépôt sans modifier le code. Lis les fichiers utiles
> en respectant les règles du projet. Vérifie le statut Git, identifie la logique
> actuelle de spawn, de dégâts, de vagues, de bonus et de rendu des ennemis.
> Compare tes constats à `CADRAGE-ENNEMIS.md` et
> `PLAN-IMPLEMENTATION-ENNEMIS.md`. Produis un état des lieux court, les risques
> éventuels et les commandes de vérification disponibles. Ne lance aucune session
> suivante et ne change aucun fichier.

### Sortie attendue

- état Git relevé sans écraser les changements existants ;
- points d’insertion identifiés dans `game.js` ;
- écarts entre le plan et le code signalés ;
- stratégie de test proposée.

### Critère de sortie

L’agent confirme que le périmètre d’implémentation est compris et qu’aucun
changement préalable n’est nécessaire.

## Session 01 — Modèle d’archétype et statistiques

### Prompt de lancement

> Implémente uniquement le modèle de données des archétypes ennemis. Enrichis la
> configuration existante avec un identifiant stable, les statistiques de base,
> les progressions par niveau et par vague, les points et un champ `abilities`
> désactivé. Ajoute une fonction pure de calcul des statistiques pour un niveau
> et une vague. Ne change pas encore la sélection aléatoire, les dégâts, les
> collisions ou la composition des vagues. Vérifie la syntaxe et les cas niveaux
> 1, 2, 3, 5 et 12.

### Critère de sortie

Les archétypes portent toutes leurs données de progression et la fonction de
calcul est testée sans modification du comportement de spawn.

## Session 02 — Dégâts explicites et PV

### Prompt de lancement

> Implémente uniquement le système de dégâts explicites. Ajoute `damage: 1` aux
> tirs et utilise cette valeur lors des collisions. Le retrait de PV doit
> accepter les nombres décimaux et détruire l’ennemi uniquement lorsque
> `hp <= 0`. Initialise `hp` et `maxHp` à partir de l’archétype calculé en
> session 01. Ne crée aucun bonus de dégâts et ne modifie pas encore la
> composition des vagues. Vérifie les ennemis à 1 PV, 2 PV et avec un dégât
> décimal.

### Critère de sortie

Un tir standard retire exactement 1 PV, aucun arrondi n’est effectué et les
ennemis résistants nécessitent plusieurs impacts.

## Session 03 — Composition progressive des vagues

### Prompt de lancement

> Implémente uniquement la composition pondérée des vagues. Conserve le nombre
> total d’ennemis calculé actuellement. Configure les poids par niveau et, si
> utile, par vague : caries majoritaires et tartres minoritaires au niveau 1,
> sucres introduits à partir du niveau 2, puis progression contrôlée. Prévois
> une surcharge pour une vague spéciale sans l’utiliser pour l’instant. Remplace
> le tirage uniformément aléatoire par une sélection pondérée. Ajoute une
> simulation suffisante pour vérifier les proportions aux niveaux 1, 2, 3, 5 et
> 12. Ne change pas le rendu.

### Critère de sortie

La composition respecte les règles documentées et le sucre est absent du niveau
1 dans toutes les simulations.

## Session 04 — Spawn et rendu par catégorie

### Prompt de lancement

> Adapte uniquement le spawn et le rendu aux archétypes. Chaque instance doit
> recevoir ses statistiques calculées, sa vitesse effective et son identifiant
> de catégorie. Fais dépendre `drawEnemy()` de la catégorie tout en conservant
> les visuels actuels. N’ajoute aucune capacité active ni affichage de PV si sa
> lisibilité n’est pas démontrée. Vérifie que les trois catégories restent
> visuellement distinguables et que les projectiles de boss ne sont pas traités
> comme des ennemis normaux.

### Critère de sortie

Les instances utilisent leur configuration d’archétype et les trois rendus
existants restent fonctionnels.

## Session 05 — Vérifications de non-régression

### Prompt de lancement

> Vérifie le jeu complet après les sessions 01 à 04. Teste démarrage,
> déplacement clavier/souris/tactile, tir, pause, son, bonus existants,
> progression des vagues, mini-boss, perte de vies, fin de partie et
> redémarrage. Utilise les contrôles disponibles et des vérifications ciblées
> du code. Corrige uniquement les régressions directement causées par le
> système d’ennemis. Ne rééquilibre pas encore les valeurs.

### Critère de sortie

Les fonctionnalités existantes passent et aucune régression bloquante n’est
identifiée.

## Session 06 — Simulation et équilibrage

### Prompt de lancement

> Mesure puis ajuste l’équilibrage du système d’ennemis. Simule les niveaux 1,
> 2, 3, 5 et 12 avec suffisamment de tirages pour repérer les extrêmes. Analyse
> durée de vague, tirs nécessaires par catégorie, proportions, vies perdues et
> difficulté du passage au niveau 3. Modifie d’abord les PV, puis les vitesses,
> puis les compositions ; une seule famille de paramètres à la fois. Conserve le
> nombre d’ennemis par vague et documente chaque valeur retenue. Ne crée pas de
> capacité active ni de bonus multiplicateur.

### Critère de sortie

Les valeurs sont justifiées par des mesures et la difficulté augmente sans
produire de vague manifestement injuste.

## Session 07 — Documentation finale

### Prompt de lancement

> Finalise la documentation sans modifier la logique de jeu. Mets à jour
> `CADRAGE-ENNEMIS.md` avec les valeurs confirmées, complète ou crée
> `GAMEPLAY.md` avec les règles réellement implémentées et conserve
> `PLAN-IMPLEMENTATION-ENNEMIS.md` comme référence du chantier. Ajoute un lien
> depuis le README si nécessaire, sans recopier la documentation détaillée.
> Vérifie les liens Markdown, les exemples et la cohérence entre documentation
> et code. Ne prétends pas qu’un test visuel ou statistique a été réalisé s’il ne
> l’a pas été.

### Critère de sortie

La documentation décrit le comportement réellement livré, les extensions
futures sont clairement séparées et les liens fonctionnent.

## Règles communes d’exécution

- Ne pas lancer plusieurs sessions en parallèle.
- Relire le résultat et vérifier le dépôt avant chaque session suivante.
- Ne pas supprimer, réinitialiser ou écraser les modifications utilisateur.
- Ne pas ajouter de capacités ennemies avant une demande explicite.
- Distinguer les contrôles statiques, les simulations locales et les tests
  réellement exercés dans le navigateur.
- Mettre à jour les documents uniquement lorsque l’implémentation ou les
  mesures justifient le changement.
