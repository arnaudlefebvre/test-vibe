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

1. ouvrez l'onglet **Actions**, puis lancez le workflow si aucun déploiement n'a encore été déclenché ;
2. le workflow active automatiquement GitHub Pages et sélectionne GitHub Actions comme source lors du premier déploiement ;
3. récupérez l'adresse publique affichée dans le résumé du déploiement.

L'activation automatique nécessite que GitHub Pages soit disponible pour le dépôt et que les Actions soient autorisées dans **Settings → Actions → General**. Si l'organisation interdit l'activation de Pages par workflow, activez-la manuellement dans **Settings → Pages → Build and deployment → GitHub Actions**, puis relancez le workflow.

Pour un dépôt nommé `dental-defender`, l'adresse sera généralement :

```text
https://VOTRE-NOM.github.io/dental-defender/
```

## Commandes

- **Flèches gauche/droite** ou **A/D** : déplacer le dentiste
- **Espace** : lancer un jet nettoyant
- Boutons à l'écran pour mettre en pause et activer/désactiver le son
