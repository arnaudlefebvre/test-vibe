# Gameplay — Ennemis

Dans le thème actif `santeclair`, les libellés affichés sont les suivants
(les identifiants techniques restent `carie`, `tartre` et `sucre`) :

Les vagues conservent leur nombre actuel d’ennemis. Chaque ennemi est choisi
selon une composition pondérée, calculée pour le niveau et la vague au moment
du spawn.

| Catégorie | PV de base | Vitesse de base | Points | Niveau d’introduction |
| --- | ---: | ---: | ---: | ---: |
| Dépassement d’honoraire (ex-Carie) | 1 | 34 | 100 | 1 |
| Reste à Charge (RAC) (ex-Tartre) | 2 | 28 | 200 | 1 |
| Délai d’Attente (ex-Sucre) | 1,5 | 32 | 300 | 2 |

Les PV et la vitesse suivent `base + progressionNiveau × (niveau - 1) +
progressionVague × (vague - 1)`. Une variation de vitesse au spawn conserve le
rendu vivant des ennemis. Les PV et dégâts restent décimaux, sans arrondi.
Un tir standard porte `damage: 1` ; les tirs multiples ou larges changent la
géométrie des tirs, pas leurs dégâts unitaires.

Au niveau 1, la composition est 80 % carie et 20 % tartre : le sucre est
absent. À partir du niveau 2, le sucre est introduit progressivement et les
poids sont plafonnés pour conserver une majorité de caries. Une surcharge
`ennemiCompositionOverrides` est prévue pour une vague spéciale, sans vague
spéciale activée actuellement.

Les capacités ennemies et les multiplicateurs de dégâts sont des extensions
futures ; `abilities` reste vide et aucun multiplicateur n’est appliqué.

## Qualification

Les calculs ont été vérifiés statiquement et par simulation locale sur 20 000
tirages par niveau (1, 2, 3, 5 et 12). Cette documentation ne constitue pas une
qualification navigateur Chrome DevTools ni une qualification de production :
ces validations, ainsi que les parcours tactiles et la campagne complète,
restent à exercer dans l’environnement visé.
