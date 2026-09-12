const ACTIVE_THEME = 'santeclair';

const themes = {
  dental: {
    id: 'dental',
    assetRoot: null,
    rendering: 'procedural',
    description: 'Rendu procédural historique ; aucun fichier PNG requis.',
    assets: {},
    dimensions: {
      player: { width: 64, height: 64 },
      playerProjectile: { width: 24, height: 24 },
      enemy: { width: 64, height: 64 },
      boss: { width: 112, height: 112 },
      bonus: { width: 40, height: 40 },
      bossProjectile: { width: 24, height: 24 }
    },
    labels: {
      player: 'Joueur',
      playerProjectile: 'Tir',
      enemies: {
        carie: 'Carie vorace',
        tartre: 'Tartre tenace',
        sucre: 'Sucre collant'
      },
      bosses: ['TARTRE BLINDÉ', 'REINE SUCRÉE', 'CARIE VOLANTE', 'MÉGAMOLAIRE'],
      bonuses: {
        speed: { name: 'Vitesse', statusLabel: 'PLUS VITE' },
        wide: { name: 'Tir Large', statusLabel: 'TIR LARGE' },
        double: { name: 'Double Tir', statusLabel: 'DOUBLE TIR' },
        triple: { name: 'Triple Tir', statusLabel: 'TRIPLE TIR' },
        five: { name: 'Cinq Tirs', statusLabel: 'CINQ TIRS' },
        life: { name: '+1 Vie', statusLabel: '+1 VIE' }
      },
      bossProjectiles: {
        generic: 'Projectile Boss Générique',
        scie: 'Projectile Facture Salée (Scie)'
      }
    }
  },
  santeclair: {
    id: 'santeclair',
    assetRoot: 'assets/sprites/',
    rendering: 'sprites',
    assets: {
      player: 'player.png',
      playerProjectile: 'player_projectile.png',
      carie: 'enemy_depassement.png',
      tartre: 'enemy_rac.png',
      sucre: 'enemy_delai.png',
      bossRac: 'boss_rac.png',
      bossDesert: 'boss_desert.png',
      bossFakeDoc: 'boss_fake_doc.png',
      bossFacture: 'boss_facture.png',
      speed: 'bonus_teleconsultation.png',
      wide: 'bonus_analyse_devis.png',
      double: 'bonus_duo_optique_dentaire.png',
      triple: 'bonus_pacte_360.png',
      five: 'bonus_100_sante.png',
      life: 'bonus_coaching_prevention.png',
      bossProjectileGeneric: 'boss_projectile_generic.png',
      bossProjectileScie: 'boss_projectile_scie.png'
    },
    dimensions: {
      player: { width: 64, height: 64 },
      playerProjectile: { width: 24, height: 24 },
      enemy: { width: 64, height: 64 },
      boss: { width: 112, height: 112 },
      bonus: { width: 40, height: 40 },
      bossProjectile: { width: 24, height: 24 }
    },
    labels: {
      player: 'Assuré Santéclair (Joueur)',
      playerProjectile: 'Tiers Payant (Tir)',
      enemies: {
        carie: 'Dépassement d’honoraire (ex-Carie)',
        tartre: 'Reste à Charge (RAC) (ex-Tartre)',
        sucre: 'Délai d’Attente (ex-Sucre)'
      },
      bosses: [
        'Monstre du Rest-à-Charge (ex-Tartre Blindé)',
        'Le Désert Médical (ex-Reine Sucrée)',
        'Le Fake Doc / Charlatan (ex-Carie Volante)',
        'La Facture Salée (ex-Mégamolaire)'
      ],
      bonuses: {
        speed: { name: 'Téléconsultation 24/7 (Vitesse)', statusLabel: 'Vitesse' },
        wide: { name: 'Analyse de Devis (Tir Large)', statusLabel: 'Tir Large' },
        double: { name: 'Duo Optique & Dentaire (Double Tir)', statusLabel: 'Double Tir' },
        triple: { name: 'Pacte 360° (Triple Tir)', statusLabel: 'Triple Tir' },
        five: { name: '100% Santé (RAC Zéro) (Cinq Tirs)', statusLabel: 'Cinq Tirs' },
        life: { name: 'Coaching Prévention (+1 Vie)', statusLabel: '+1 Vie' }
      },
      bossProjectiles: {
        generic: 'Projectile Boss Générique',
        scie: 'Projectile Facture Salée (Scie)'
      }
    }
  }
};
