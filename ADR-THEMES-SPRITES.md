# ADR — Registre de thèmes et sprites

- **Statut :** accepté pour la version actuelle
- **Date :** 2026-09-12
- **Portée :** rendu visuel et sélection des libellés du mini-jeu

## Contexte

Le jeu doit pouvoir conserver son rendu historique tout en proposant un thème
visuel Santéclair. Les ressources graphiques doivent rester optionnelles afin
qu’une ressource absente, invalide ou non chargée ne bloque pas la partie.
Cette décision décrit le contrat documentaire observé dans `themes.js` et son
utilisation par `game.js`; elle ne modifie pas les règles de jeu.

## Décision

Le rendu est décrit dans un registre de thèmes :

- le thème actif par défaut est `santeclair` et charge les PNG depuis
  `assets/sprites/`;
- le thème `dental` conserve le rendu procédural historique et ne déclare pas
  de PNG;
- chaque ressource est chargée et suivie individuellement dans un cache. Une
  ressource absente ou invalide déclenche un fallback procédural pour ce sprite
  uniquement, sans remplacer les autres sprites correctement chargés;
- les identifiants stables (`carie`, `tartre`, `sucre`, `wide`, `bossRac`, etc.)
  servent de clés techniques. Les noms affichés et les fichiers PNG sont des
  données du thème et peuvent donc évoluer indépendamment;
- les sprites sont dessinés sans lissage (`imageSmoothingEnabled = false`).
  Les dimensions d’affichage documentées sont de 64×64 pour le joueur et les
  ennemis, 112×112 pour les boss, 40×40 pour les bonus et 24×24 pour les
  projectiles de boss;
- un projectile joueur standard est affiché en 24×24. Le projectile `wide`
  est affiché en 36×36, hitbox comprise dans la géométrie de collision élargie;
- les projectiles de boss sont affichés en 24×24. La scie est référencée comme
  projectile dédié, mais aucune rotation de la scie n’est implémentée dans
  cette version.

## Conséquences

Le thème Santéclair est immédiatement visible lorsque ses assets sont chargés,
tandis qu’un défaut isolé reste récupérable par le rendu procédural. Les
identifiants techniques et les paramètres de gameplay restent découplés des
libellés et des noms de fichiers. Le pixel-art conserve ses contours nets,
mais les dimensions d’affichage ne garantissent pas à elles seules la qualité
artistique de chaque PNG.

## Limites et qualification

Cette ADR a été vérifiée par lecture ciblée de `themes.js`, `game.js`, des noms
et dimensions des PNG, ainsi que par les contrôles statiques du dépôt. Elle ne
constitue pas une validation navigateur Chrome DevTools, une qualification
tactile, ni une qualification de production : aucun de ces parcours n’est
déclaré réalisé par la présente session. La qualification réelle devra couvrir
le chargement partiel des assets, les fallbacks, les collisions et le rendu
dans les environnements cibles.

## Limites de la décision

Cette ADR ne choisit ni ne modifie les statistiques, probabilités, vagues,
dégâts ou collisions du jeu. Toute évolution de ces règles doit être traitée
séparément.
