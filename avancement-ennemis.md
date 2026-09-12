# Avancement — Système d’ennemis

Statut global : en cours — sessions 00 à 06 validées, documentation finale en cours.

| Session | État | Résultat |
|---|---|---|
| 00 | terminée | État Git et points d’insertion relevés. |
| 01 | terminée | Archétypes configurables et calcul pur des statistiques. |
| 02 | terminée | Dégâts explicites (`damage: 1`), PV décimaux et destruction à `hp <= 0`. |
| 03 | terminée | Composition pondérée, sucre absent au niveau 1. |
| 04 | terminée | Spawn avec statistiques calculées ; rendu existant conservé par catégorie. |
| 05 | terminée | Chrome DevTools local : démarrage, pause/reprise, son et spawn vérifiés ; aucune erreur console relevée. |
| 06 | terminée | Simulation locale de 20 000 tirages par niveau ; proportions et statistiques vérifiées, valeurs conservatrices retenues. |
| 07 | en cours | `GAMEPLAY.md` créé, cadrage et README à aligner puis revue finale. |

Fichiers modifiés : `game.js`, `README.md`, `GAMEPLAY.md`, `CADRAGE-ENNEMIS.md`, `avancement-ennemis.md`.

Validations : `node --check game.js` réussi ; simulation locale 20 000 tirages/niveau réussie ; Chrome DevTools local exercé pour démarrage, pause/reprise, son et spawn.

Limites : aucune capacité active, aucun multiplicateur de dégâts et aucun changement du nombre d’ennemis par vague introduits. Aucun push effectué.

Limite : le parcours tactile complet, la campagne complète et la production ne sont pas qualifiés.

Prochaine action : terminer l’alignement documentaire, revoir le diff, puis créer les commits dédiés et effectuer l’unique push.
