/**
 * Configuration centrale de L'Air Gap 42.
 * Ce fichier est chargé par le site (navigateur) ET par le build (Node).
 * Ne mettez ici AUCUN secret : tout est public.
 */
export default {
  site: {
    name: "L'Air Gap 42",
    shortName: 'AirGap42',
    tagline: 'Le programme d’élite pour concevoir, opérer et auditer des systèmes réellement isolés.',
    // URL publique. Format GitHub Pages : https://<user>.github.io/<repo>
    url: 'https://redcreator1.github.io/L-Air-Gap-42',
    // Domaine personnalisé (crée un fichier CNAME au build). Ex : 'airgap42.com'
    customDomain: '',
    language: 'fr',
    // Contact affiché sur le site et dans les CGV
    contactEmail: 'contact@airgap42.example',
    // Auteur / formateur
    instructor: {
      name: 'L’équipe Air Gap 42',
      title: 'Architectes sécurité OT/IT, 15+ ans en environnements classifiés',
      bio: 'Nous avons conçu et audité des réseaux isolés pour l’industrie, la défense et la finance. Ce programme condense ce que nous aurions voulu apprendre en 42 jours au lieu de 15 ans.',
    },
  },

  // ---------- Cohorte & urgence (affichés sur la page d’accueil et Tarifs) ----------
  cohort: {
    label: 'Cohorte Automne 2026',
    // Date de clôture des inscriptions (ISO 8601). Le compte à rebours s’arrête tout seul.
    closesAt: '2026-10-15T21:59:59Z',
    seats: 42,
    seatsLeft: 17,
    startsOn: '20 octobre 2026',
  },

  // ---------- Offres ----------
  // provider : 'stripe' (Payment Links) ou 'lemonsqueezy' (checkout overlay, TVA UE gérée)
  checkout: {
    provider: 'stripe',
    currency: 'EUR',
    // Pour Lemon Squeezy : identifiant boutique, ex 'airgap42' → https://airgap42.lemonsqueezy.com
    lemonStore: '',
    tiers: [
      {
        id: 'essentiel',
        name: 'Essentiel',
        price: 490,
        priceBefore: 690,
        pitch: 'Les fondations et l’architecture d’isolation. Pour bâtir un air gap qui tient.',
        // Lien de paiement Stripe (https://buy.stripe.com/...) ou URL checkout Lemon Squeezy
        checkoutUrl: 'https://buy.stripe.com/REMPLACER_ESSENTIEL',
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
        badge: 'Le plus choisi',
        pitch: 'Le parcours complet opérationnel : transferts, détection, canaux cachés. Pour ceux qui ont un air gap à défendre.',
        checkoutUrl: 'https://buy.stripe.com/REMPLACER_PRO',
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
        checkoutUrl: 'https://buy.stripe.com/REMPLACER_ELITE',
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

  // ---------- Activation optionnelle via API (Vercel serverless, dossier api/) ----------
  // Laissez vide pour le mode 100 % statique : la clé de licence déchiffre directement.
  api: {
    activateUrl: '', // ex : 'https://airgap42-api.vercel.app/api/activate'
  },

  // ---------- Communauté ----------
  community: {
    discordInvite: 'https://discord.gg/REMPLACER',
    discordServerId: '', // pour le widget live (Server Settings → Widget → activer)
    githubRepo: 'Redcreator1/L-Air-Gap-42',
    discussionsUrl: 'https://github.com/Redcreator1/L-Air-Gap-42/discussions',
    // giscus (commentaires sous chaque leçon, basés sur GitHub Discussions) : https://giscus.app
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
      // Lien de la visio hebdomadaire (Zoom / Meet / Jitsi). Visible uniquement aux membres connectés.
      url: 'https://meet.jit.si/airgap42-live',
    },
    // Calendrier public (ICS) des lives et ateliers
    calendarIcsUrl: '',
  },

  // ---------- Newsletter ----------
  // provider : 'buttondown' | 'convertkit' | 'formspree' | 'mailto'
  newsletter: {
    provider: 'formspree',
    // Buttondown : votre identifiant ; ConvertKit : URL du formulaire ; Formspree : https://formspree.io/f/xxxx
    endpoint: 'https://formspree.io/f/REMPLACER',
    leadMagnet: 'Recevez le briefing gratuit « Les 7 erreurs qui trouent 90 % des air gaps » + le module 0 en accès libre.',
  },

  // ---------- Analytics (sans cookies) ----------
  analytics: {
    // 'plausible' | 'umami' | ''
    provider: '',
    plausibleDomain: '',
    umamiSrc: '',
    umamiWebsiteId: '',
  },

  // ---------- Preuves sociales ----------
  testimonials: [
    {
      quote: 'On pensait notre réseau de supervision isolé. Le module 3 nous a fait découvrir trois ponts non documentés en une semaine.',
      name: 'Karim B.',
      role: 'Responsable cybersécurité OT, énergie',
    },
    {
      quote: 'Le kit d’audit m’a fait gagner deux mois sur une mission NIS2. Amorti dès le premier client.',
      name: 'Sophie L.',
      role: 'Consultante GRC indépendante',
    },
    {
      quote: 'Enfin une formation qui traite les canaux cachés et la supply chain hors-ligne sérieusement, pas en une slide.',
      name: 'Thomas R.',
      role: 'Architecte sécurité, défense',
    },
  ],
  logos: ['Énergie', 'Défense', 'Santé', 'Finance', 'Industrie 4.0', 'Collectivités'],

  faq: [
    {
      q: 'À qui s’adresse le programme ?',
      a: 'Aux ingénieurs sécurité, administrateurs OT/ICS, RSSI, auditeurs et consultants qui doivent concevoir, exploiter ou évaluer des environnements isolés. Un bagage réseau et système de base est requis ; aucune compétence offensive n’est nécessaire.',
    },
    {
      q: 'Comment se passe l’accès après paiement ?',
      a: 'Vous recevez immédiatement votre clé de licence. Vous l’activez sur la page Accès : le contenu, chiffré sur nos serveurs, est déverrouillé dans votre navigateur. Aucun compte, aucun mot de passe à retenir, et cela fonctionne même hors-ligne une fois chargé.',
    },
    {
      q: 'Est-ce vraiment 42 jours ?',
      a: 'Le rythme conseillé est une leçon par jour (20 à 45 minutes). Mais l’accès est à vie : vous pouvez aller plus vite, ou étaler sur un trimestre. Les lives hebdomadaires suivent le rythme de la cohorte.',
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
