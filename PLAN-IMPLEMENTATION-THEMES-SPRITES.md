# Plan d’implémentation — Système de thèmes des sprites

## Statut et objectif

Statut : cadrage validé, implémentation non commencée.

Ce plan décrit la mise en place d’un mécanisme permettant de changer facilement
les sprites et le vocabulaire du gameplay sans modifier les règles de jeu. Les
sessions doivent être exécutées strictement dans l’ordre numérique. Une session
ne peut être considérée comme terminée qu’après sa validation et sa revue
indépendante.

Le périmètre concerne les sprites du joueur, des projectiles, des ennemis, des
boss et des bonus, ainsi que les noms métier affichés dans le jeu. L’équilibrage,
les probabilités, les vagues, les dégâts et les collisions existantes restent
hors périmètre, à l’exception de l’agrandissement explicitement prévu pour le
bonus « Tir Large ».

## État connu avant implémentation

- Le projet est un site statique composé principalement de `index.html`,
  `game.js` et `styles.css`.
- Les visuels actuels sont dessinés directement avec le canvas ; aucun appel à
  `drawImage` n’est encore présent.
- Les fonctions de rendu actuelles sont `drawDentist()`, `drawEnemy()`,
  `drawBoss()` et le rendu inline des tirs et bonus dans `render()`.
- Les noms et identifiants techniques sont actuellement répartis entre
  `game.js` et `index.html`.
- Les PNG du futur thème sont présents dans `assets/sprites/` et leurs
  dimensions ont été vérifiées.
- Des modifications utilisateur préexistantes sont présentes dans le dépôt.
  Elles doivent être préservées et rester hors périmètre si elles ne sont pas
  nécessaires au système de thèmes.

## Décisions validées

### Architecture

- Créer un fichier dédié `themes.js`, chargé avant `game.js` dans `index.html`.
- Définir un registre `themes` contenant au minimum `dental` et `santeclair`.
- Définir une seule constante `ACTIVE_THEME = 'santeclair'` pour sélectionner
  le thème actif.
- Conserver `dental` comme thème historique alternatif, avec le rendu
  procédural existant et les anciens noms.
- Prévoir un `assetRoot` par thème. Le thème Santéclair conserve les fichiers
  directement dans `assets/sprites/`; de futurs thèmes pourront utiliser
  `assets/sprites/<theme-id>/`.
- Conserver les identifiants techniques actuels (`carie`, `tartre`, `sucre`,
  `speed`, `wide`, `double`, `triple`, `five`, `life`, etc.). Le thème ne fait
  que fournir les sprites et les libellés métier associés.
- Ajouter un ADR décrivant cette architecture, ses conséquences et son
  mécanisme de repli.

### Rendu et chargement

- Le thème `santeclair` est actif par défaut.
- Les PNG sont des sprites statiques uniques, pas des spritesheets animées.
- Les dimensions du tableau sont les dimensions natives d’affichage dans le
  canvas :
  - joueur : `64×64` ;
  - projectile joueur : `24×24` ;
  - ennemi : `64×64` ;
  - boss : `112×112` ;
  - bonus : `40×40` ;
  - projectile de boss : `24×24`.
- Le lissage des images doit être désactivé avec
  `ctx.imageSmoothingEnabled = false` pour préserver le pixel-art.
- Les images doivent être préchargées et mises en cache pour le thème actif.
- Une image manquante ou invalide ne doit pas bloquer le jeu : seul le sprite
  concerné revient au rendu procédural historique, avec un avertissement dans
  la console.
- Les projectiles de boss ne pivotent pas dans cette première version. Le
  comportement de rotation de la scie est explicitement reporté.

### Gameplay et collisions

- Les règles de jeu et les collisions existantes restent inchangées.
- Exception décidée pour `Tir Large` : le projectile joueur normal est affiché
  en `24×24` ; avec le bonus actif, il est affiché en `36×36` (facteur `1,5`)
  sur les deux axes et sa hitbox est agrandie en conséquence.
- Les bonus Double, Triple et Cinq tirs continuent de modifier le nombre ou
  l’angle des projectiles, sans modifier leur dégât.
- Le cycle des quatre mini-boss reste inchangé.

### Textes

- Le thème pilote les noms du joueur, des ennemis, des boss, des bonus et des
  projectiles, ainsi que les textes de gameplay associés.
- Les noms de boss restent affichés uniquement dans la transition
  `MINI-BOSS — Nom`.
- Les libellés de bonus comportent un nom complet (`name`) et un libellé court
  (`statusLabel`) pour le HUD.
- L’identité produit reste fixe : `Dental Defender`, le titre du site, le
  pied de page et l’habillage général ne sont pas thématisés.

## Correspondance du thème Santéclair

| Identifiant technique | Nom affiché | Fichier | Taille |
| --- | --- | --- | --- |
| `player` | Assuré Santéclair (Joueur) | `player.png` | 64×64 |
| `playerProjectile` | Tiers Payant (Tir) | `player_projectile.png` | 24×24 |
| `carie` | Dépassement d’honoraire (ex-Carie) | `enemy_depassement.png` | 64×64 |
| `tartre` | Reste à Charge (RAC) (ex-Tartre) | `enemy_rac.png` | 64×64 |
| `sucre` | Délai d’Attente (ex-Sucre) | `enemy_delai.png` | 64×64 |
| boss 1 | Monstre du Rest-à-Charge (ex-Tartre Blindé) | `boss_rac.png` | 112×112 |
| boss 2 | Le Désert Médical (ex-Reine Sucrée) | `boss_desert.png` | 112×112 |
| boss 3 | Le Fake Doc / Charlatan (ex-Carie Volante) | `boss_fake_doc.png` | 112×112 |
| boss 4 | La Facture Salée (ex-Mégamolaire) | `boss_facture.png` | 112×112 |
| `speed` | Téléconsultation 24/7 (Vitesse) | `bonus_teleconsultation.png` | 40×40 |
| `wide` | Analyse de Devis (Tir Large) | `bonus_analyse_devis.png` | 40×40 |
| `double` | Duo Optique & Dentaire (Double Tir) | `bonus_duo_optique_dentaire.png` | 40×40 |
| `triple` | Pacte 360° (Triple Tir) | `bonus_pacte_360.png` | 40×40 |
| `five` | 100% Santé (RAC Zéro) (Cinq Tirs) | `bonus_100_sante.png` | 40×40 |
| `life` | Coaching Prévention (+1 Vie) | `bonus_coaching_prevention.png` | 40×40 |
| projectile boss générique | Projectile Boss Générique | `boss_projectile_generic.png` | 24×24 |
| projectile boss de la Facture | Projectile Facture Salée (Scie) | `boss_projectile_scie.png` | 24×24 |

Correspondance des projectiles de boss : le projectile générique est utilisé
pour les trois premiers boss ; le projectile scie est utilisé uniquement par
La Facture Salée.

## Sessions d’implémentation

### Session 00 — État initial, assets et garde-fous

#### Objectif

Vérifier l’état du dépôt et préparer la session sans modifier le code de jeu.

#### Prompt de lancement

> Inspecte l’état Git et le code utile du dépôt sans modifier les fichiers.
> Respecte l’interdiction de lecture intégrale des fichiers de configuration
> concernés par les règles du dépôt. Vérifie la présence des 17 PNG dans
> `assets/sprites/`, leurs dimensions et leurs en-têtes PNG. Repère les points
> d’insertion dans `index.html`, `game.js` et `styles.css` pour le registre de
> thèmes, le chargement d’images, le rendu du joueur, des projectiles, des
> ennemis, des boss et des bonus. Préserve toutes les modifications utilisateur
> existantes. Ne lance aucune session suivante et ne change aucun fichier.

#### Validations

- `git status --short` relevé et changements préexistants identifiés ;
- 17 fichiers présents avec les noms attendus ;
- dimensions contrôlées : `64×64`, `24×24`, `112×112` et `40×40` selon le tableau ;
- aucun changement Git produit.

#### Critère de sortie

Les points d’insertion et les garde-fous sont confirmés ; aucune modification
n’est nécessaire avant la session 01.

### Session 01 — Contrat et registre des thèmes

#### Objectif

Créer le modèle de données dans `themes.js` et rendre le thème actif accessible
à `game.js`, sans remplacer encore les fonctions de rendu.

#### Prompt de lancement

> Implémente uniquement le contrat de données des thèmes dans un nouveau fichier
> `themes.js`, puis charge-le avant `game.js`. Ajoute `ACTIVE_THEME =
> 'santeclair'`, les thèmes `santeclair` et `dental`, le champ `assetRoot`, les
> références aux 17 sprites, les dimensions natives et les libellés métier
> exacts du tableau. Conserve les identifiants techniques du jeu. Ajoute les
> noms complets et les `statusLabel` des bonus. Le thème `dental` doit décrire
> le rendu procédural historique sans nécessiter de PNG. Ne modifie pas encore
> le rendu, les collisions, les probabilités ou les règles de jeu.

#### Fichiers autorisés

- `themes.js` ;
- `index.html` uniquement pour l’ordre des balises `<script>` ;
- tests ou script de vérification local si nécessaire.

#### Validations

- `node --check themes.js` et `node --check game.js` ;
- vérification du registre, des clés et des chemins par un script local ;
- contrôle que les clés techniques utilisées par les vagues et bonus sont
  inchangées.

#### Critère de sortie

Le registre contient les deux thèmes et toutes les métadonnées nécessaires,
mais le comportement visuel du jeu n’a pas encore changé.

### Session 02 — Préchargement, cache et fallback

#### Objectif

Ajouter le chargement robuste des images du thème actif, sans modifier encore
les appels de rendu métier.

#### Prompt de lancement

> Implémente uniquement le préchargement et le cache des sprites du thème actif.
> Prévois un état par asset : chargé, absent ou invalide. Une erreur sur une
> image ne doit pas bloquer le démarrage ni les autres sprites ; le rendu devra
> pouvoir demander le fallback procédural historique. Ajoute
> `ctx.imageSmoothingEnabled = false` après chaque redimensionnement pertinent
> du canvas. Ne modifie pas les collisions, les statistiques, les vagues, les
> probabilités ni les règles de bonus.

#### Validations

- chargement local des 17 assets sans erreur ;
- simulation d’un chemin invalide pour un seul asset et vérification que les
  autres restent disponibles ;
- `node --check` et `git diff --check` ;
- aucune image cassée ni blocage de la page dans le parcours navigateur.

#### Critère de sortie

Le chargeur est isolé, observable et tolérant aux assets manquants.

### Session 03 — Joueur et projectiles joueur

#### Objectif

Remplacer le rendu procédural du joueur et du projectile joueur par les assets
du thème, avec le comportement spécifique du bonus `wide`.

#### Prompt de lancement

> Adapte uniquement le rendu du joueur et des projectiles joueur au thème actif.
> Utilise `player.png` en `64×64` et `player_projectile.png` en `24×24` pour le
> thème Santéclair. Le thème `dental` doit conserver `drawDentist()` et le
> projectile procédural. Avec `wide`, affiche le projectile en `36×36` en
> multipliant les deux axes par `1,5` et utilise une hitbox correspondante. Les
> bonus Double, Triple et Cinq tirs gardent leur logique actuelle. Ne modifie
> pas les dégâts, la cadence, les angles, la vitesse ou les collisions des
> ennemis et des boss.

#### Validations

- joueur visible au centre et à la bonne taille ;
- projectile normal en `24×24` ;
- projectile `wide` en `36×36` et hitbox agrandie ;
- tirs Double, Triple et Cinq toujours fonctionnels ;
- rendu `dental` toujours disponible.

#### Critère de sortie

Le joueur et ses tirs utilisent le thème actif sans régression de tir.

### Session 04 — Ennemis et liste latérale

#### Objectif

Utiliser les trois sprites d’ennemis et rendre leurs noms métier dépendants du
thème, y compris dans la liste HTML.

#### Prompt de lancement

> Adapte uniquement les ennemis classiques et la liste latérale. Mappe les
> identifiants techniques `carie`, `tartre` et `sucre` vers les trois sprites et
> noms du thème Santéclair. Affiche chaque image en `64×64`. Remplace les noms
> codés en dur de la liste des ennemis par des éléments alimentés par le thème,
> sans modifier les points, les statistiques, la composition, les poids ou la
> progression. Le thème `dental` doit continuer à afficher les anciens noms et
> le rendu procédural. Ne traite pas les projectiles de boss comme des ennemis
> classiques.

#### Validations

- les trois catégories sont visuellement distinguables ;
- les noms et points de la liste correspondent au thème actif ;
- le sucre reste absent du niveau 1 ;
- les proportions, PV, vitesses et scores sont inchangés ;
- le fallback d’un seul ennemi n’impacte pas les deux autres.

#### Critère de sortie

Les ennemis et leur présentation HTML sont entièrement pilotés par le thème,
sans changement des règles de jeu.

### Session 05 — Boss, noms et projectiles de boss

#### Objectif

Adapter les quatre mini-boss, l’affichage de leur nom et leurs deux types de
projectiles.

#### Prompt de lancement

> Adapte uniquement le rendu et les données visuelles des mini-boss. Conserve
> l’ordre et le cycle actuels : RAC, Désert Médical, Fake Doc / Charlatan,
> Facture Salée. Affiche les boss en `112×112` avec les assets du thème actif.
> Alimente la transition `MINI-BOSS — Nom` depuis le thème ; le nom ne doit
> rester visible que pendant cette transition. Utilise le projectile générique
> pour les trois premiers boss et le projectile scie uniquement pour La Facture
> Salée. Affiche les projectiles en `24×24`, sans rotation. Conserve les PV, la
> barre de vie, les phases, la vitesse, les dégâts, les collisions et le cycle
> de combat existants.

#### Validations

- les quatre boss apparaissent avec le bon sprite et le bon nom ;
- le cycle est confirmé aux niveaux concernés ;
- le projectile de La Facture Salée est bien la scie ;
- les trois autres boss utilisent le projectile générique ;
- aucun gel lors de la défaite du boss et aucune modification des PV ou phases.

#### Critère de sortie

Les boss et leurs noms sont thématisés, avec la correspondance de projectiles
validée.

### Session 06 — Bonus et libellés d’état

#### Objectif

Remplacer le rendu des six bonus et alimenter le HUD avec des libellés adaptés
aux noms longs.

#### Prompt de lancement

> Adapte uniquement les six bonus au thème actif. Affiche chaque PNG en
> `40×40`, mappe `speed`, `wide`, `double`, `triple`, `five` et `life` vers les
> noms exacts du thème, puis utilise `statusLabel` dans `#bonusStatus` afin de
> conserver un HUD lisible. Ne change pas les effets, la durée de 10 secondes,
> les probabilités, les bonus garantis, les vies ou la logique de collecte.
> Conserve un fallback procédural par bonus et vérifie le thème `dental`.

#### Validations

- les six images sont visibles et associées au bon effet ;
- la collecte et l’expiration de chaque bonus restent fonctionnelles ;
- le HUD affiche les libellés courts sans débordement ;
- les noms complets sont disponibles pour la présentation et l’accessibilité ;
- aucune modification du taux de bonus n’est introduite.

#### Critère de sortie

Les bonus sont visuellement et éditorialement pilotés par le thème.

### Session 07 — Intégration du changement de thème et fallback historique

#### Objectif

Vérifier que le changement d’une seule constante suffit et que le thème
historique reste utilisable.

#### Prompt de lancement

> Vérifie l’intégration complète du registre. Change localement `ACTIVE_THEME`
> de `santeclair` à `dental`, puis inverse la valeur, sans ajouter de sélecteur
> dans l’interface. Vérifie que tous les éléments visuels et libellés suivent
> le thème choisi, que les assets Santéclair sont utilisés quand le thème est
> actif et que le rendu procédural historique est restauré pour `dental`.
> Corrige uniquement les défauts d’intégration du système de thèmes. Ne change
> aucune règle de jeu ni aucun texte de marque.

#### Validations

- un seul changement de `ACTIVE_THEME` suffit ;
- parcours de démarrage, tir, pause, bonus, vagues et boss dans les deux
  thèmes ;
- absence d’erreur console ;
- vérification que les textes `Dental Defender` et le pied de page restent
  fixes ;
- `node --check` et `git diff --check`.

#### Critère de sortie

Les deux thèmes sont sélectionnables de manière déterministe et réversible.

### Session 08 — Non-régression fonctionnelle et qualification navigateur

#### Objectif

Exercer le jeu réel après intégration, en distinguant les contrôles statiques,
les tests locaux et le parcours navigateur.

#### Prompt de lancement

> Vérifie le jeu complet dans Chrome DevTools, sans utiliser de navigateur
> intégré différent. Exerce le thème Santéclair actif par défaut et vérifie le
> chargement visuel réel des 17 assets. Teste démarrage, déplacement clavier,
> souris et tactile, tir normal et `Tir Large`, Double/Triple/Cinq tirs, pause,
> son, collecte de bonus, progression des vagues, apparition des quatre
> mini-boss, noms de boss, projectiles génériques et scie, perte de vies, fin de
> partie et redémarrage. Vérifie aussi le chemin `dental` en changeant la
> constante localement. Corrige uniquement les régressions directement liées
> au système de thèmes.

#### Validations

- console sans erreur pendant le parcours ;
- sprites visibles à leur taille et avec leur netteté attendues ;
- fallback exercé sur au moins un asset absent ou invalide ;
- gameplay et collisions inchangés, hors agrandissement explicitement prévu du
  projectile `wide` ;
- limites de qualification documentées : campagne complète et production ne
  sont pas prétendues validées si elles ne l’ont pas été.

#### Critère de sortie

Le parcours navigateur confirme le comportement réellement observable, avec une
séparation explicite entre validation statique, locale et navigateur.

### Session 09 — Documentation, ADR et clôture

#### Objectif

Documenter le mécanisme réellement livré et vérifier la cohérence finale.

#### Prompt de lancement

> Finalise la documentation sans modifier la logique de jeu. Crée un ADR avec
> statut, contexte, décision, conséquences et limites pour le registre de
> thèmes, le thème Santéclair par défaut, le thème `dental`, le fallback, les
> identifiants stables, le pixel-art sans lissage et l’agrandissement du
> projectile `wide`. Mets à jour la documentation gameplay seulement si elle
> contient des noms désormais inexacts. Ajoute dans le README un lien utile vers
> la documentation du thème si nécessaire, sans recopier toute la configuration.
> Vérifie les liens, les noms de fichiers, les dimensions et la cohérence avec
> le code réellement livré. Ne prétends pas qu’un parcours navigateur ou un
> test statistique a été réalisé s’il ne l’a pas été.

#### Validations

- ADR présent et compréhensible sans lire tout le code ;
- documentation cohérente avec `themes.js`, `game.js` et les PNG ;
- liens Markdown vérifiés ;
- `node --check`, `git diff --check` et revue du diff ;
- aucune modification des documents utilisateur hors périmètre sans raison
  documentée.

#### Critère de sortie

La documentation décrit le comportement réellement livré et les extensions
reportées, notamment la rotation future de la scie.

## Règles d’exécution des sessions

- Exécuter les sessions `00` à `09` strictement dans l’ordre.
- Une seule session active à la fois.
- Pour chaque session, relire le périmètre, vérifier Git, implémenter uniquement
  les fichiers autorisés, puis réaliser une revue indépendante.
- Ne jamais écraser les modifications utilisateur existantes.
- Ne pas modifier les paramètres d’équilibrage ou les probabilités dans ce
  chantier.
- Distinguer les contrôles statiques, les simulations locales et les parcours
  réellement exercés dans le navigateur.
- Créer un commit dédié uniquement après validation de chaque session si le
  workflow du dépôt l’exige ; ne pousser qu’après validation de l’ensemble du
  chantier.
- En cas d’échec, documenter la preuve, corriger dans le périmètre de la
  session, puis rejouer la validation avant de passer à la suivante.

## Critères d’acceptation finaux

- [ ] `santeclair` est le thème actif par défaut.
- [ ] `dental` permet de retrouver le rendu et les noms historiques.
- [ ] Les 17 PNG sont référencés par configuration et chargés sans erreur.
- [ ] Les dimensions natives sont respectées.
- [ ] Le pixel-art reste net, sans lissage.
- [ ] Un asset manquant déclenche uniquement son fallback procédural.
- [ ] Les noms des boss sont modifiables dans le thème et apparaissent dans la
      transition mini-boss.
- [ ] La correspondance des quatre boss et des deux projectiles de boss est
      respectée.
- [ ] Le projectile `Tir Large` passe de `24×24` à `36×36`, hitbox comprise.
- [ ] Les identifiants techniques, les règles, les statistiques, les vagues,
      les probabilités et les collisions non concernées restent inchangés.
- [ ] Le produit conserve son identité `Dental Defender`.
- [ ] La validation navigateur et ses limites sont documentées.
