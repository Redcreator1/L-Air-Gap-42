/**
 * Configuration centrale de L'Air Gap 42.
 * Chargée par le site (navigateur) ET par le build (Node). Aucun secret ici : tout est public.
 *
 * Règle : ce fichier ne contient que des informations vraies. Témoignages, places restantes,
 * expérience du formateur sont des allégations commerciales engageant votre responsabilité
 * (pratiques commerciales trompeuses, art. L121-2 C. conso.). Les champs vides masquent
 * la section correspondante.
 */
export default {
  site: {
    name: "L'Air Gap 42",
    shortName: 'AirGap42',
    tagline: 'Le programme pour concevoir, opérer et auditer des systèmes réellement isolés.',
    // URL publique. Format GitHub Pages : https://<user>.github.io/<repo>
    url: 'https://redcreator1.github.io/L-Air-Gap-42',
    // Domaine personnalisé (génère un fichier CNAME au build). Ex : 'airgap42.com'
    customDomain: '',
    language: 'fr',
    // Contact affiché sur le site et dans les CGV
    contactEmail: 'contact@airgap42.example',
    // Formateur. Laissez `name` vide pour masquer la section tant qu'elle n'est pas renseignée.
    instructor: {
      name: '',
      title: '',
      bio: '',
    },
  },

  // ---------- Cohorte (page d'accueil et Tarifs) ----------
  cohort: {
    label: 'Cohorte 1 · Automne 2026',
    // Clôture des inscriptions (ISO 8601). Passée → le compte à rebours affiche « inscriptions closes ».
    closesAt: '2026-10-04T21:59:59Z',
    // Places réelles. Mettez seatsLeft à jour à chaque vente, ou laissez seats === seatsLeft.
    seats: 42,
    seatsLeft: 42,
    startsOn: '20 septembre 2026',
  },

  // ---------- Offres ----------
  checkout: {
    currency: 'EUR',
    // Mention affichée sous le prix. Vente à des consommateurs en France : les prix doivent être TTC.
    priceNote: 'Paiement unique · accès à vie · facture fournie',

    // PayPal. Deux options, au choix :
    //
    //  A. Boutons PayPal (recommandé) : renseignez `clientId`. Le paiement se fait sur place et,
    //     si `api.activateUrl` est configuré, la clé de licence s'affiche aussitôt après paiement.
    //     L'identifiant client est PUBLIC : https://developer.paypal.com/dashboard/applications
    //     Commencez en bac à sable (`sandbox: true`) avec un compte acheteur de test.
    //
    //  B. Liens de paiement PayPal (sans code) : laissez `clientId` vide et collez l'URL du lien
    //     de chaque palier dans son `checkoutUrl`. Aucune activation automatique : la clé de
    //     licence est transmise par e-mail.
    //
    // Tant que ni l'un ni l'autre n'est configuré, les boutons proposent une liste d'attente.
    paypal: {
      clientId: '',
      sandbox: true,
      // Libellé de la ligne de commande dans PayPal et sur la facture de l'acheteur.
      softDescriptor: 'AIRGAP42',
    },

    tiers: [
      {
        id: 'essentiel',
        name: 'Essentiel',
        price: 490,
        priceBefore: 690,
        pitch: 'Les fondations et l’architecture d’isolation. Pour bâtir un air gap qui tient.',
        // Option B uniquement : URL d'un lien de paiement PayPal (https://www.paypal.com/ncp/payment/…)
        checkoutUrl: '',
        features: [
          'Modules 1 & 2 (14 leçons, 14 jours)',
          'Ateliers guidés + checklists d’architecture',
          'Quiz de validation et certificat de module',
          'Accès à vie aux mises à jour du contenu',
          'Communauté Discord (canaux Essentiel)',
        ],
        cta: 'Rejoindre Essentiel',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 1490,
        priceBefore: 1990,
        highlight: true,
        badge: 'Recommandé',
        pitch: 'Le parcours opérationnel complet : transferts, détection, canaux cachés. Pour ceux qui ont un air gap à défendre.',
        checkoutUrl: '',
        features: [
          'Modules 1 à 5 (35 leçons, 35 jours)',
          'Tout Essentiel inclus',
          'Sessions live hebdomadaires (Q&R + revue d’architecture)',
          'Bibliothèque de templates : politiques, runbooks, matrices de risques',
          'Canaux Discord Pro + revue de vos schémas par les pairs',
          'Certificat de programme',
        ],
        cta: 'Rejoindre Pro',
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 4900,
        priceBefore: 6900,
        pitch: 'Les 42 jours + gouvernance, audit et 3 sessions de coaching individuel. Pour RSSI, auditeurs et consultants.',
        checkoutUrl: '',
        features: [
          'Les 6 modules (42 leçons, 42 jours) + briefing',
          'Tout Pro inclus',
          '3 sessions de coaching 1:1 (60 min)',
          'Kit d’audit air gap complet (IEC 62443 / NIS2 / ISO 27001)',
          'Mastermind Elite (12 personnes max) + accès anticipé aux nouveaux modules',
          'Revue de votre plan 90 jours par un architecte senior',
        ],
        cta: 'Candidater Elite',
      },
    ],
    enterprise: {
      pitch: 'Vous formez une équipe de 5+ personnes ? Licences groupées, session privée, facturation sur devis.',
      mailto: 'mailto:contact@airgap42.example?subject=Formation%20Air%20Gap%2042%20%E2%80%94%20Entreprise',
    },
    guaranteeDays: 14,
  },

  // ---------- Délivrance de la clé par API (optionnel, dossier api/ déployé sur Vercel) ----------
  // Vide = la clé de licence est envoyée par e-mail après vérification manuelle du paiement.
  api: {
    activateUrl: '', // ex : 'https://airgap42-api.vercel.app/api/activate'
  },

  // ---------- Communauté ----------
  community: {
    discordInvite: 'https://discord.gg/REMPLACER',
    discordServerId: '', // widget live : Server Settings → Widget → activer, copier l'ID
    githubRepo: 'Redcreator1/L-Air-Gap-42',
    discussionsUrl: 'https://github.com/Redcreator1/L-Air-Gap-42/discussions',
    // giscus (commentaires sous chaque leçon via GitHub Discussions) : https://giscus.app
    giscus: {
      enabled: false,
      repo: 'Redcreator1/L-Air-Gap-42',
      repoId: '',
      category: 'Leçons',
      categoryId: '',
    },
    liveSessions: {
      day: 'Jeudi',
      time: '19h00 (Paris)',
      // Visio hebdomadaire. Affichée uniquement aux membres Pro et Elite connectés.
      url: 'https://meet.jit.si/airgap42-live',
    },
  },

  // ---------- Newsletter ----------
  // 'formspree' : endpoint = https://formspree.io/f/xxxx
  // 'buttondown' : endpoint = votre identifiant Buttondown
  // 'mailto'     : ouvre le client mail (aucun service)
  newsletter: {
    provider: 'formspree',
    endpoint: 'https://formspree.io/f/REMPLACER',
    leadMagnet: 'Recevez le briefing gratuit « Les 7 erreurs qui trouent 90 % des air gaps » et le module 0 en accès libre.',
  },

  // ---------- Mesure d'audience sans cookies ----------
  // 'plausible' | 'umami' | ''. Pour Umami, ajoutez aussi son domaine à la CSP (docs/SETUP.md).
  analytics: {
    provider: '',
    plausibleDomain: '',
    umamiSrc: '',
    umamiWebsiteId: '',
  },

  // ---------- Preuves sociales ----------
  // Témoignages réels uniquement, avec accord écrit de leur auteur. Vide = section masquée.
  // Format : { quote: '…', name: 'Prénom N.', role: 'Fonction, secteur' }
  testimonials: [],
  // Secteurs visés par le programme (affirmation de conception, pas de clientèle)
  sectors: ['Énergie', 'Défense', 'Santé', 'Finance', 'Industrie 4.0', 'Collectivités'],

  faq: [
    {
      q: 'À qui s’adresse le programme ?',
      a: 'Aux ingénieurs sécurité, administrateurs OT/ICS, RSSI, auditeurs et consultants qui doivent concevoir, exploiter ou évaluer des environnements isolés. Un bagage réseau et système de base est requis ; aucune compétence offensive n’est nécessaire.',
    },
    {
      q: 'Comment se passe l’accès après paiement ?',
      a: 'Vous recevez immédiatement votre clé de licence. Vous l’activez sur la page Accès : le contenu, chiffré sur nos serveurs, est déverrouillé dans votre navigateur. Aucun compte ni mot de passe à retenir, et cela fonctionne hors-ligne une fois chargé.',
    },
    {
      q: 'Est-ce vraiment 42 jours ?',
      a: 'Le rythme conseillé est une leçon par jour (20 à 45 minutes). L’accès est à vie : vous pouvez aller plus vite ou étaler sur un trimestre. Les lives hebdomadaires suivent le rythme de la cohorte.',
    },
    {
      q: 'Y a-t-il une garantie ?',
      a: 'Oui : 14 jours satisfait ou remboursé, sans justification, tant que vous n’avez pas terminé plus de deux modules.',
    },
    {
      q: 'Puis-je faire financer la formation par mon entreprise ?',
      a: 'Oui. Nous fournissons une facture conforme et un programme détaillé. Pour 5 personnes et plus, contactez-nous pour une licence groupée.',
    },
    {
      q: 'Le contenu est-il mis à jour ?',
      a: 'Chaque trimestre : nouvelles menaces, retours d’expérience de la communauté, évolutions réglementaires (NIS2, IEC 62443). Les mises à jour sont incluses à vie.',
    },
  ],
};
