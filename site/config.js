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
    // L'auteur. Section masquée tant que `name` est vide.
    // Ne revendiquez ici que ce que vous pouvez montrer : un titre, une certification ou
    // des années d'expérience affichés sur une page de vente sont des allégations
    // vérifiables, pas une formule de style.
    instructor: {
      name: 'Redcreator1',
      title: 'Auteur et développeur du parcours',
      bio: 'Je construis des outils, et j’écris ce que j’aurais voulu trouver. L’Air Gap 42 est parti d’un constat simple : on répète partout qu’un système déconnecté est sûr, et presque nulle part comment le prouver. J’ai préféré en faire quelque chose qui s’exécute plutôt qu’un cours de plus. Un parcours qui tient dans un terminal, qui fonctionne débranché, et dont vous pouvez lire le code avant de le lancer.',
      link: 'https://github.com/Redcreator1',
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

  // ---------- Engagements ----------
  // CHAQUE service listé ici est une promesse commerciale que VOUS devrez tenir, et qui
  // vous engage juridiquement une fois affichée (art. L111-1 C. conso. : information
  // précontractuelle ; art. L121-2 : pratiques commerciales trompeuses).
  //
  // Tout est à `false` par défaut. Passez une ligne à `true` seulement quand le service
  // existe vraiment et que vous pouvez le tenir dans la durée. Les fonctionnalités et les
  // questions fréquentes qui en dépendent disparaissent du site tant qu'il est à `false`.
  engagements: {
    lives: false, // sessions live hebdomadaires et enregistrements
    replays: false, // mise à disposition des enregistrements
    coaching: false, // séances individuelles
    mastermind: false, // groupe restreint Elite
    revuePairs: false, // relecture par les pairs sous 72 h
    revueSenior: false, // revue du plan 90 jours par un architecte senior
    templates: false, // bibliothèque de modèles de documents
    kitAudit: false, // kit d'audit Elite
    misesAJour: false, // mises à jour trimestrielles du contenu
    facture: false, // facture émise automatiquement (dépend de votre configuration PayPal)
  },

  // ---------- Offres ----------
  checkout: {
    currency: 'EUR',
    // Mention affichée sous le prix. Vente à des consommateurs en France : les prix doivent être TTC.
    priceNote: 'Paiement unique · archive à vous, définitivement',

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
        price: 390,
        // Prix barré : laissez-le vide. Annoncer une réduction oblige à afficher le prix
        // le plus bas réellement pratiqué dans les 30 jours précédents (directive Omnibus,
        // art. L112-1-1 C. conso.). Un prix barré jamais pratiqué est une réduction fictive.
        priceBefore: null,
        pitch: 'Les fondations et l’architecture d’isolation. Pour bâtir un air gap qui tient.',
        // Option B uniquement : URL d'un lien de paiement PayPal (https://www.paypal.com/ncp/payment/…)
        checkoutUrl: '',
        features: [
          'Niveaux 4 à 17 : fondations, modèle de menace, architecture d’isolation',
          'Ateliers guidés et checklists à appliquer sur votre environnement',
          'Questions de contrôle à chaque niveau',
          'Parcours hors-ligne, sans compte ni installation',
          { t: 'Mises à jour du contenu incluses', e: 'misesAJour' },
        ],
        cta: 'Rejoindre Essentiel',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 1190,
        priceBefore: null,
        highlight: true,
        badge: 'Recommandé',
        pitch: 'Le parcours opérationnel complet : transferts, détection, canaux cachés. Pour ceux qui ont un air gap à défendre.',
        checkoutUrl: '',
        features: [
          'Niveaux 4 à 38 : transferts, supply chain, détection, canaux cachés',
          'Tout Essentiel inclus',
          'Certificat de parcours délivré par le lanceur',
          { t: 'Sessions live hebdomadaires (questions-réponses et revue d’architecture)', e: 'lives' },
          { t: 'Bibliothèque de modèles : politiques, runbooks, matrices de risques', e: 'templates' },
          { t: 'Revue de vos schémas par les pairs', e: 'revuePairs' },
        ],
        cta: 'Rejoindre Pro',
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 1900,
        priceBefore: null,
        pitch: 'Le parcours entier, gouvernance et audit compris. Pour RSSI, auditeurs et consultants.',
        checkoutUrl: '',
        features: [
          'Les 45 niveaux, briefing et module gouvernance compris',
          'Tout Pro inclus',
          { t: '3 séances individuelles de 60 minutes', e: 'coaching' },
          { t: 'Kit d’audit air gap (IEC 62443 / NIS2 / ISO 27001)', e: 'kitAudit' },
          { t: 'Groupe restreint Elite, douze personnes au plus', e: 'mastermind' },
          { t: 'Revue de votre plan 90 jours par un architecte senior', e: 'revueSenior' },
        ],
        cta: 'Candidater Elite',
      },
    ],
    enterprise: {
      pitch: 'Vous formez une équipe de 5 personnes ou plus ? Écrivez-nous pour une licence groupée et un devis.',
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
    leadMagnet: 'Recevez le briefing gratuit « Les sept erreurs qui trouent un air gap » et les trois premiers niveaux en accès libre.',
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
      a: 'Vous recevez votre clé de licence. Vous téléchargez l’archive des niveaux depuis la page Jouer, vous vérifiez son empreinte, et vous enregistrez votre clé dans le lanceur : « ./airgap42 licence VOTRE-CLÉ ». Aucun compte, aucun mot de passe, et tout fonctionne hors-ligne.',
    },
    {
      q: 'Est-ce vraiment 42 jours ?',
      a: 'Le rythme conseillé est un niveau par jour, de 20 à 45 minutes. Rien ne vous y oblige : l’archive est à vous, vous avancez à votre rythme.',
    },
    {
      q: 'Y a-t-il une garantie ?',
      a: 'Oui : 14 jours satisfait ou remboursé, sans justification, tant que vous n’avez pas terminé plus de deux modules.',
    },
    {
      q: 'Puis-je faire financer la formation par mon entreprise ?',
      a: 'Oui. Le programme détaillé est public sur la page Programme, et une facture vous est fournie. Pour 5 personnes et plus, écrivez-nous pour une licence groupée.',
    },
    {
      q: 'Le contenu est-il mis à jour ?',
      a: 'Oui, et les mises à jour sont incluses : vous retéléchargez l’archive, votre clé continue de fonctionner.',
      e: 'misesAJour',
    },
  ],
};
