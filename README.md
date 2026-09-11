# Dental Defender

Mini-jeu d'arcade inspiré de Space Invaders : déplacez le dentiste, tirez sur les caries, le tartre et les sucres, puis tentez de compléter la mission du jour.

## Lancer le jeu

```bash
python3 -m http.server 4173
```

Ouvrez ensuite <http://localhost:4173>.

## Publier avec GitHub Pages

Le workflow [Deploy Dental Defender to GitHub Pages](.github/workflows/deploy-pages.yml) publie automatiquement le jeu lors de chaque envoi sur la branche `main`. Il peut aussi être lancé manuellement depuis l'onglet **Actions** de GitHub.

Après avoir envoyé le projet sur GitHub :

1. ouvrez **Settings → Pages** dans le dépôt ;
2. dans **Build and deployment → Source**, sélectionnez **GitHub Actions** ;
3. ouvrez l'onglet **Actions**, puis lancez le workflow si aucun déploiement n'a encore été déclenché ;
4. récupérez l'adresse publique affichée dans le résumé du déploiement.

Pour un dépôt nommé `dental-defender`, l'adresse sera généralement :

```text
https://VOTRE-NOM.github.io/dental-defender/
```

## Commandes

- **Flèches gauche/droite** ou **A/D** : déplacer le dentiste
- **Espace** : lancer un jet nettoyant
- Boutons à l'écran pour mettre en pause et activer/désactiver le son
