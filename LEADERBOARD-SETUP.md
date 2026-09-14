# Classement Supabase

Le jeu reste fonctionnel si Supabase n'est pas configuré. Renseigner uniquement
`supabase-config.js` avec l'URL du projet et la clé `anon` publique.

La table et l'Edge Function sont à déployer dans Supabase. La fonction doit
recalculer/valider les bornes du score côté serveur, filtrer le pseudonyme,
appliquer le meilleur score par pseudonyme (insensible à la casse), puis
retourner le Top 10 trié par score décroissant et date croissante.

Ne jamais publier une clé `service_role` dans GitHub Pages.
