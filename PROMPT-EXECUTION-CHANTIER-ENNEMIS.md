# Mission

Tu pilotes de manière autonome, traçable et strictement séquentielle le
chantier d’évolution du système d’ennemis de **Dental Defender**.

## Objectif

Implémenter un système d’ennemis configurable combinant catégories, visuels,
PV, progression des statistiques par niveau et vague, composition progressive
des vagues et dégâts explicites, sans introduire de capacités ennemies actives
ni de multiplicateurs de dégâts dans ce chantier.

## Fichiers disponibles et périmètre

Le dépôt contient notamment :

- `game.js` : logique du jeu, ennemis, tirs, vagues, bonus et boss ;
- `index.html` : structure de l’interface et HUD ;
- `styles.css` : styles de l’interface ;
- `README.md` : lancement et commandes ;
- `CADRAGE-ENNEMIS.md` : décisions fonctionnelles ;
- `PLAN-IMPLEMENTATION-ENNEMIS.md` : plan directeur ;
- `SESSIONS-IMPLEMENTATION-ENNEMIS.md` : sessions et critères de sortie.

Respecte les modifications utilisateur déjà présentes. Ne lis jamais
intégralement les fichiers de configuration interdits par les règles du dépôt.
Utilise les fichiers effectivement présents et vérifie leur état avant toute
action.

## Critères de succès

- Les sessions 00 à 07 sont exécutées dans l’ordre et validées.
- Les catégories d’ennemis sont configurables et leurs statistiques sont
  calculées au spawn.
- Les PV et dégâts acceptent des valeurs décimales sans arrondi logique.
- Les compositions sont progressives et le sucre est absent du niveau 1.
- Les fonctionnalités existantes ne régressent pas.
- `CADRAGE-ENNEMIS.md`, `PLAN-IMPLEMENTATION-ENNEMIS.md`,
  `SESSIONS-IMPLEMENTATION-ENNEMIS.md` et la documentation gameplay sont
  cohérents avec le code réellement livré.
- Un commit est créé à la fin de chaque session validée.
- Un seul push est effectué après validation de l’ensemble du chantier.

## Règles impératives

- Commencer par analyser l’existant et l’état Git.
- Lire `CADRAGE-ENNEMIS.md`, `PLAN-IMPLEMENTATION-ENNEMIS.md` et
  `SESSIONS-IMPLEMENTATION-ENNEMIS.md` avant l’exécution.
- Exécuter les sessions strictement dans l’ordre numérique.
- Une seule session est active à la fois.
- Utiliser un unique sous-agent d’implémentation pour une session donnée ; ne
  jamais lancer plusieurs sous-agents en parallèle.
- Réaliser une revue indépendante après chaque session.
- Préserver les changements utilisateur non liés au chantier.
- Ne pas ajouter de capacité ennemie active, de multiplicateur de dégâts ou
  d’augmentation du nombre d’ennemis par vague sans demande explicite.
- Distinguer les contrôles statiques, les simulations locales et les parcours
  réellement exercés dans le navigateur.
- En cas de blocage, documenter les preuves, les options et la décision
  attendue ; ne pas contourner le blocage par une hypothèse risquée.

## Suivi persistant

Créer ou maintenir à la racine `avancement-ennemis.md` avec :

- statut global ;
- état de chaque session (`à faire`, `en cours`, `terminée`, `bloquée`) ;
- fichiers modifiés ;
- validations et résultats ;
- limites et qualifications restantes ;
- commits associés ;
- prochaine action.

## Exécution d’une session

Pour chaque session :

1. Relire son objectif, son périmètre et ses critères dans
   `SESSIONS-IMPLEMENTATION-ENNEMIS.md`.
2. Vérifier l’état Git et préserver les changements hors périmètre.
3. Marquer la session `en cours` dans `avancement-ennemis.md`.
4. Confier la session à l’unique sous-agent avec un mandat précis : fichiers
   autorisés, conventions, validations, exclusions et compte rendu factuel.
5. Attendre sa fin complète.
6. Relire indépendamment les changements : périmètre, qualité, cohérence,
   régressions et conventions.
7. Corriger ou faire corriger les écarts dans le périmètre de la session.
8. Exécuter les validations adaptées et conserver les preuves utiles.
9. Mettre à jour `avancement-ennemis.md`.
10. Marquer la session `terminée` uniquement si ses critères sont atteints.
11. Créer un commit dédié à la session, avec un message explicite, par exemple
    `feat(enemies): implement session 01 enemy archetypes`.
12. Vérifier que le commit contient uniquement les changements attendus.
13. Passer à la session suivante uniquement après cette vérification.

Un échec de test ou une session incomplète interdit le commit de validation de
la session et interdit le passage à la suivante, sauf décision explicitement
documentée.

## Politique Git

- Les commits de session sont obligatoires et doivent rester séparés.
- Ne jamais utiliser de commande destructive telle que `git reset --hard` ou
  `git checkout --`.
- Ne jamais pousser entre deux sessions.
- Après la validation de la session 07 et la revue globale :
  1. vérifier le goal et l’état de toutes les sessions ;
  2. vérifier l’arbre Git et les commits ;
  3. effectuer un unique `git push` vers la branche courante ;
  4. revalider l’état local et signaler le résultat du push.
- Si le push échoue, ne pas réécrire l’historique ni forcer le push ; documenter
  l’erreur et la prochaine action nécessaire.

## Restitution finale

Lorsque le chantier est réellement terminé, fournir :

- les sessions réalisées et leurs commits ;
- les principaux fichiers modifiés ;
- les validations exécutées et leurs résultats ;
- le résultat de l’unique push ;
- les limites, qualifications réelles et actions restantes ;
- les écarts éventuels par rapport au cadrage initial.

Ne pas déclarer le chantier terminé si une session n’est pas validée, si le
push n’a pas été tenté après l’objectif rempli, ou si la documentation ne
correspond pas au comportement livré.
