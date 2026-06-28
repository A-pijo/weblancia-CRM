import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

function readEnv(key: string): string {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}

const adapter = new PrismaMariaDb({
  host: readEnv("HOST") || "localhost",
  user: readEnv("USER") || "root",
  password: readEnv("PASSWORD") || "",
  database: readEnv("NAME") || "weblancia",
  port: Number(readEnv("PORT") || "3306"),
  connectionLimit: 1,
})
const db = new PrismaClient({ adapter })

interface FAQItem { question: string; answer: string }

// ─── Service Content Data ────────────────────────────────────────

const serviceContent: Record<string, {
  fullDescription: string; technologies: string[]; industries: string[];
  benefits: string[]; process: { step: number; title: string; description: string }[];
  faqs: FAQItem[]; startingPrice: number; currency: string;
  ctaText: string; outcome: string; keywords: string[];
  seoTitle: string; seoDescription: string;
  difficulty: string; deliveryDays: number; readingTime: number;
  relatedServices: string[];
}> = {

  // ── WEB DEVELOPMENT ──

  "corporate-websites": {
    fullDescription: "Un site vitrine professionnel est le premier point de contact entre votre entreprise et vos prospects. Chez Weblancia, nous concevons des sites vitrine sur mesure qui allient design haut de gamme, expérience utilisateur fluide et performance technique irréprochable. Chaque projet commence par une phase d'audit approfondie où nous analysons votre marché, vos concurrents et vos objectifs commerciaux. Nous élaborons ensuite une architecture de contenu pensée pour guider le visiteur vers la conversion, avec des parcours utilisateur intuitifs. Le design est créé sur mesure, en cohérence avec votre identité de marque, puis développé avec les technologies les plus récentes (Next.js, Tailwind CSS) pour garantir des vitesses de chargement optimales et un référencement naturel performant.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    industries: ["Services", "Immobilier", "Santé", "Éducation", "Finance", "Professions libérales"],
    benefits: ["Design premium sur mesure", "Performance optimale (Core Web Vitals)", "SEO-friendly dès la conception", "CMS intuitive facile à utiliser", "Responsive mobile/tablette/desktop", "Sécurité renforcée SSL/HTTPS"],
    process: [
      { step: 1, title: "Audit & Stratégie", description: "Analyse de votre marché, de vos concurrents et de vos objectifs pour définir une stratégie digitale cohérente." },
      { step: 2, title: "Architecture & UX", description: "Création de l'arborescence et des parcours utilisateur optimisés pour la conversion." },
      { step: 3, title: "Design & Maquettage", description: "Conception de maquettes haute-fidélité validées avant développement." },
      { step: 4, title: "Développement", description: "Intégration avec Next.js et Tailwind CSS pour des performances optimales." },
      { step: 5, title: "SEO & Optimisation", description: "Optimisation technique, sémantique et performance pour les moteurs de recherche." },
      { step: 6, title: "Lancement & Formation", description: "Mise en production, configuration du CMS et formation de votre équipe." },
    ],
    faqs: [
      { question: "Quel est le délai de création d'un site vitrine ?", answer: "Comptez entre 4 et 8 semaines selon la complexité du projet. Un site simple avec 5-6 pages peut être livré en 4 semaines, tandis qu'un projet plus complexe avec fonctionnalités avancées peut prendre jusqu'à 8 semaines." },
      { question: "Puis-je mettre à jour mon site moi-même ?", answer: "Oui, nous intégrons un CMS intuitif qui vous permet de modifier vos contenus sans aucune compétence technique. Vous pouvez ajouter des pages, modifier des textes, changer des images et publier des articles de blog en toute autonomie." },
      { question: "Mon site sera-t-il optimisé pour le SEO ?", answer: "Absolument. Tous nos sites sont construits avec les meilleures pratiques SEO : balises sémantiques, meta-données, structure d'URL optimisée, temps de chargement rapides, et données structurées JSON-LD." },
      { question: "Proposez-vous des formules d'hébergement ?", answer: "Oui, nous proposons des formules d'hébergement premium avec certificat SSL, sauvegardes automatiques, monitoring 24/7 et support prioritaire." },
      { question: "Le site sera-t-il responsive ?", answer: "Oui, tous nos sites sont conçus mobile-first et testés sur tous les appareils (smartphones, tablettes, desktop) pour garantir une expérience utilisateur optimale." },
      { question: "Quel est le processus de collaboration ?", answer: "Nous suivons une méthodologie agile avec des livraisons itératives. Vous serez impliqué à chaque étape : validation du design, revue du développement, tests et recette finale." },
      { question: "Proposez-vous la maintenance après le lancement ?", answer: "Oui, nous proposons des formules de maintenance mensuelle incluant les mises à jour de sécurité, les sauvegardes et le support technique." },
      { question: "Quels types de sites vitrine créez-vous ?", answer: "Nous créons des sites pour tous les secteurs : professions libérales (avocats, médecins, architectes), entreprises de services, PME, startups, associations, et institutions." },
      { question: "Comment gérez-vous le référencement local ?", answer: "Nous optimisons votre site pour le référencement local : Google My Business, balises locales, citations et annuaires pertinents pour votre zone géographique." },
      { question: "Puis-je avoir un blog sur mon site vitrine ?", answer: "Oui, tous nos sites incluent un module de blog avec catégories, tags, recherche et partage sur les réseaux sociaux pour enrichir votre contenu SEO." },
    ],
    startingPrice: 15000, currency: "MAD", ctaText: "Demander un devis gratuit",
    outcome: "Un site vitrine professionnel qui convertit vos visiteurs en clients",
    keywords: ["site vitrine", "création site web", "site professionnel", "site entreprise", "site internet maroc", "agence web", "design site web"],
    seoTitle: "Création de Sites Vitrine Professionnels | Weblancia - Casablanca",
    seoDescription: "Agence web à Casablanca spécialisée dans la création de sites vitrine professionnels sur mesure. Design premium, SEO optimisé, CMS intuitif. Demandez votre devis gratuit.",
    difficulty: "Intermédiaire", deliveryDays: 30, readingTime: 8,
    relatedServices: ["landing-pages", "ecommerce", "website-maintenance", "hosting"],
  },

  "landing-pages": {
    fullDescription: "Les pages de capture (landing pages) sont l'outil le plus puissant pour convertir votre trafic en prospects qualifiés. Contrairement à un site vitrine généraliste, une landing page est conçue avec un objectif unique : la conversion. Chaque élément est optimisé pour guider le visiteur vers une action spécifique : formulaire de contact, inscription, téléchargement ou achat. Nous appliquons les principes du copywriting persuasif, du design psychologique et des tests A/B pour maximiser votre taux de conversion.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "A/B Testing", "Analytics"],
    industries: ["Marketing", "SaaS", "E-commerce", "Formation", "Événementiel", "Immobilier"],
    benefits: ["Taux de conversion jusqu'à 300% plus élevé", "Design centré sur un objectif unique", "Copywriting persuasif professionnel", "Tests A/B intégrés", "Intégration CRM et email marketing", "Analytics et tracking complets"],
    process: [
      { step: 1, title: "Définition des objectifs", description: "Identification claire de l'action souhaitée et des KPIs de succès." },
      { step: 2, title: "Copywriting & Storytelling", description: "Rédaction persuasive avec accroches, bénéfices et appel à l'action irrésistible." },
      { step: 3, title: "Design & Prototypage", description: "Maquette optimisée pour la conversion avec hiérarchie visuelle stratégique." },
      { step: 4, title: "Développement & Intégration", description: "Page rapide, responsive, avec tracking analytics et pixels." },
      { step: 5, title: "Tests & Optimisation", description: "Tests A/B sur les titres, CTA, couleurs et mise en page." },
      { step: 6, title: "Lancement & Suivi", description: "Mise en ligne et analyse continue des performances pour améliorer le taux de conversion." },
    ],
    faqs: [
      { question: "Qu'est-ce qu'une landing page ?", answer: "Une landing page est une page web autonome conçue spécifiquement pour une campagne marketing ou publicitaire. Contrairement à un site web classique, elle a un objectif unique : convertir le visiteur en lead ou en client." },
      { question: "Quelle est la différence entre un site vitrine et une landing page ?", answer: "Un site vitrine présente l'ensemble de votre activité avec plusieurs pages, tandis qu'une landing page est focalisée sur un seul objectif de conversion avec un message unique et ciblé." },
      { question: "Combien coûte la création d'une landing page ?", answer: "Nos landing pages commencent à partir de 5 000 MAD. Le prix varie selon la complexité du design, les intégrations (CRM, email) et les fonctionnalités avancées." },
      { question: "Quel est le délai de réalisation ?", answer: "Une landing page standard peut être livrée en 1 à 2 semaines, incluant le design, le copywriting et le développement." },
      { question: "Puis faire des tests A/B sur ma landing page ?", answer: "Oui, nous configurons des tests A/B pour optimiser vos taux de conversion en testant différents titres, images, CTA et mises en page." },
      { question: "Comment mesurez-vous le succès d'une landing page ?", answer: "Nous définissons des KPIs clairs : taux de conversion, taux de rebond, temps passé sur la page, et coût par acquisition (CPA)." },
      { question: "Optimisez-vous les landing pages pour le SEO ?", answer: "Les landing pages sont principalement conçues pour les campagnes payantes, mais nous assurons une optimisation SEO de base pour le trafic organique." },
    ],
    startingPrice: 5000, currency: "MAD", ctaText: "Créer ma landing page",
    outcome: "Une page de conversion optimisée qui transforme vos visiteurs en leads qualifiés",
    keywords: ["landing page", "page de capture", "page de conversion", "création landing page", "copywriting", "génération de leads"],
    seoTitle: "Création de Landing Pages Professionnelles | Weblancia",
    seoDescription: "Landing pages haute conversion conçues par Weblancia. Design persuasif, copywriting professionnel et tests A/B pour maximiser votre ROI.",
    difficulty: "Facile", deliveryDays: 10, readingTime: 6,
    relatedServices: ["corporate-websites", "google-ads", "meta-ads", "seo"],
  },

  "ecommerce": {
    fullDescription: "Lancez votre boutique en ligne avec une solution e-commerce complète et performante. Nous créons des sites e-commerce sur mesure qui allient design attractif, expérience d'achat fluide et outils de gestion puissants. De la configuration des produits à l'intégration des moyens de paiement, en passant par la gestion des stocks et des expéditions, nous prenons en charge l'intégralité de votre projet e-commerce.",
    technologies: ["Next.js", "Shopify", "WooCommerce", "Stripe", "PayPal", "CMI"],
    industries: ["Retail", "Mode", "Électronique", "Alimentaire", "Artisanat", "Services"],
    benefits: ["Tunnel de vente optimisé", "Paiements sécurisés multiples", "Gestion des stocks automatisée", "SEO e-commerce avancé", "Dashboard analytics temps réel", "Application mobile incluse"],
    process: [
      { step: 1, title: "Stratégie e-commerce", description: "Analyse de votre marché, de vos produits et de vos objectifs de vente." },
      { step: 2, title: "Catalogue & Architecture", description: "Organisation des produits, catégories et filtres pour une navigation intuitive." },
      { step: 3, title: "Design & UX Shopping", description: "Création d'une expérience d'achat fluide et agréable." },
      { step: 4, title: "Développement & Paiements", description: "Intégration du catalogue, panier, checkout et passerelles de paiement." },
      { step: 5, title: "Tests & Optimisation", description: "Tests de l'ensemble du parcours d'achat et optimisation des performances." },
      { step: 6, title: "Lancement & Support", description: "Mise en production, configuration des outils et formation de votre équipe." },
    ],
    faqs: [
      { question: "Quelle plateforme e-commerce recommandez-vous ?", answer: "Cela dépend de vos besoins. Pour les petites et moyennes boutiques, WooCommerce ou Shopify sont excellents. Pour les projets sur mesure avec des besoins complexes, nous développons des solutions custom avec Next.js." },
      { question: "Combien coûte un site e-commerce ?", answer: "Nos sites e-commerce commencent à partir de 25 000 MAD. Le prix varie selon le nombre de produits, les fonctionnalités et les intégrations nécessaires." },
      { question: "Quels moyens de paiement intégrez-vous ?", answer: "Nous intégrons tous les moyens de paiement populaires au Maroc : CMI, Stripe, PayPal, et virement bancaire. Nous pouvons aussi intégrer des solutions spécifiques." },
    ],
    startingPrice: 25000, currency: "MAD", ctaText: "Lancer ma boutique",
    outcome: "Une boutique en ligne performante qui génère des ventes 24h/24",
    keywords: ["e-commerce", "boutique en ligne", "création site e-commerce", "vente en ligne maroc", "woocommerce", "shopify"],
    seoTitle: "Création de Sites E-commerce Professionnels | Weblancia",
    seoDescription: "Lancez votre boutique en ligne avec Weblancia. Sites e-commerce sur mesure, paiements sécurisés, gestion des stocks et SEO avancé.",
    difficulty: "Avancé", deliveryDays: 45, readingTime: 10,
    relatedServices: ["corporate-websites", "landing-pages", "seo", "google-ads"],
  },

  "web-applications": {
    fullDescription: "Des applications web sur mesure qui automatisent vos processus métier et boostent votre productivité. Nous concevons des applications web robustes et évolutives, adaptées à vos besoins spécifiques. Que ce soit un CRM, un ERP, un portail client ou une plateforme SaaS, notre équipe technique maîtrise les technologies les plus avancées pour livrer des solutions performantes et sécurisées.",
    technologies: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Docker"],
    industries: ["Finance", "Santé", "Logistique", "Éducation", "Immobilier", "SaaS"],
    benefits: ["Application 100% sur mesure", "Architecture scalable et robuste", "API RESTful et GraphQL", "Authentification sécurisée", "Dashboard analytics en temps réel", "Déploiement CI/CD automatisé"],
    process: [
      { step: 1, title: "Analyse des besoins", description: "Compréhension approfondie de vos processus métier et de vos objectifs." },
      { step: 2, title: "Architecture technique", description: "Conception de l'architecture logicielle, base de données et API." },
      { step: 3, title: "Design UX/UI", description: "Création d'une interface utilisateur intuitive et agréable." },
      { step: 4, title: "Développement Agile", description: "Développement itératif avec livraisons régulières et revues de code." },
      { step: 5, title: "Tests & Qualité", description: "Tests unitaires, d'intégration et de performance pour garantir la qualité." },
      { step: 6, title: "Déploiement & Formation", description: "Mise en production, documentation et formation de votre équipe." },
    ],
    faqs: [
      { question: "Qu'est-ce qu'une application web ?", answer: "Une application web est un logiciel accessible via un navigateur internet, sans installation. Elle permet d'effectuer des tâches complexes : gestion de données, automatisation de processus, collaboration d'équipe, etc." },
      { question: "Quelle est la différence entre un site web et une application web ?", answer: "Un site web est principalement informatif (pages statiques/dynamiques), tandis qu'une application web est interactive et permet aux utilisateurs d'effectuer des actions complexes : créer, modifier, supprimer des données, générer des rapports, etc." },
      { question: "Combien coûte le développement d'une application web ?", answer: "Le prix dépend de la complexité et des fonctionnalités. Une application simple commence à partir de 50 000 MAD, tandis qu'une plateforme complexe peut atteindre 200 000 MAD ou plus." },
    ],
    startingPrice: 50000, currency: "MAD", ctaText: "Discuter de mon projet",
    outcome: "Une application web sur mesure qui transforme vos processus métier",
    keywords: ["application web", "développement web", "web app", "saas", "application métier", "plateforme web"],
    seoTitle: "Développement d'Applications Web Sur Mesure | Weblancia",
    seoDescription: "Applications web professionnelles sur mesure par Weblancia. React, Next.js, Node.js. Solutions SaaS, CRM, ERP et portails clients.",
    difficulty: "Avancé", deliveryDays: 60, readingTime: 10,
    relatedServices: ["custom-software", "api-integration", "crm-erp", "workflow-automation"],
  },

  "mobile-apps": {
    fullDescription: "Des applications mobiles natives et cross-platform qui offrent une expérience utilisateur exceptionnelle. Nous développons des applications iOS et Android avec Flutter et React Native, garantissant des performances natives et un time-to-market réduit. De la conception UX à la publication sur les stores, nous accompagnons votre projet de A à Z.",
    technologies: ["Flutter", "React Native", "Dart", "Swift", "Kotlin", "Firebase"],
    industries: ["Services", "E-commerce", "Santé", "Éducation", "Restauration", "Transport"],
    benefits: ["Cross-platform iOS & Android", "Performance native", "UI/UX optimisée mobile", "Push notifications", "Offline mode", "Publication App Store & Google Play"],
    process: [
      { step: 1, title: "Stratégie mobile", description: "Définition des objectifs, fonctionnalités et cibles de l'application." },
      { step: 2, title: "Design UX/UI mobile", description: "Conception d'interfaces tactiles intuitives et agréables." },
      { step: 3, title: "Développement", description: "Développement cross-platform avec Flutter ou React Native." },
      { step: 4, title: "Tests & QA", description: "Tests sur appareils réels et émulateurs pour garantir la qualité." },
      { step: 5, title: "Publication Store", description: "Soumission et suivi sur l'App Store et Google Play." },
      { step: 6, title: "Maintenance & Évolution", description: "Mise à jour régulière, correction de bugs et ajout de fonctionnalités." },
    ],
    faqs: [
      { question: "Quelle technologie utilisez-vous pour les apps mobiles ?", answer: "Nous utilisons Flutter et React Native pour le cross-platform, ce qui permet de développer une seule base de code pour iOS et Android. Pour des besoins spécifiques, nous pouvons aussi développer en natif (Swift, Kotlin)." },
      { question: "Combien coûte le développement d'une application mobile ?", answer: "Les prix commencent à partir de 40 000 MAD pour une application simple et peuvent atteindre 150 000 MAD pour une application complexe avec backend." },
      { question: "Combien de temps faut-il pour développer une app ?", answer: "Comptez 2 à 4 mois selon la complexité. Une application simple peut être prête en 8 semaines." },
    ],
    startingPrice: 40000, currency: "MAD", ctaText: "Créer mon app mobile",
    outcome: "Une application mobile professionnelle qui engage vos utilisateurs",
    keywords: ["application mobile", "développement mobile", "app ios", "app android", "flutter", "react native"],
    seoTitle: "Développement d'Applications Mobiles | Weblancia - Flutter & React Native",
    seoDescription: "Créez votre application mobile avec Weblancia. Développement cross-platform Flutter et React Native pour iOS et Android.",
    difficulty: "Avancé", deliveryDays: 60, readingTime: 9,
    relatedServices: ["web-applications", "api-integration", "ui-ux-design"],
  },

  "custom-software": {
    fullDescription: "Des solutions logicielles sur mesure pour répondre précisément à vos besoins métier. Nous concevons et développons des logiciels personnalisés qui optimisent vos processus, automatisent vos tâches et vous donnent un avantage concurrentiel. De l'analyse des besoins à la maintenance évolutive, nous livrons des solutions robustes et évolutives.",
    technologies: ["Next.js", "Node.js", "Python", "PostgreSQL", "Docker", "AWS"],
    industries: ["Finance", "Logistique", "Santé", "Industrie", "Services", "Éducation"],
    benefits: ["Logiciel 100% adapté à vos besoins", "Processus automatisés et optimisés", "Données centralisées et sécurisées", "Évolutivité et scalabilité", "Support et maintenance inclus", "Formation de vos équipes"],
    process: [
      { step: 1, title: "Cadrage du projet", description: "Définition précise des besoins fonctionnels et techniques." },
      { step: 2, title: "Spécifications détaillées", description: "Rédaction du cahier des charges et des user stories." },
      { step: 3, title: "Développement Agile", description: "Cycles de développement courts avec démos régulières." },
      { step: 4, title: "Tests & Validation", description: "Tests fonctionnels, techniques et recette utilisateur." },
      { step: 5, title: "Déploiement", description: "Mise en production et migration des données." },
      { step: 6, title: "Maintenance évolutive", description: "Suivi continu, corrections et ajout de fonctionnalités." },
    ],
    faqs: [
      { question: "Quand faut-il un logiciel sur mesure ?", answer: "Quand les solutions du marché ne répondent pas à vos besoins spécifiques, quand vous avez besoin d'un avantage concurrentiel, ou quand vous souhaitez automatiser des processus complexes." },
      { question: "Quel est le budget pour un logiciel sur mesure ?", answer: "Le budget varie considérablement selon la complexité. Un logiciel métier simple commence à 80 000 MAD, tandis qu'une plateforme complexe peut nécessiter 300 000 MAD ou plus." },
    ],
    startingPrice: 80000, currency: "MAD", ctaText: "Étudier mon projet",
    outcome: "Un logiciel sur mesure qui optimise vos opérations et vous différencie",
    keywords: ["logiciel sur mesure", "développement logiciel", "software custom", "solution métier", "automatisation"],
    seoTitle: "Développement de Logiciels Sur Mesure | Weblancia",
    seoDescription: "Solutions logicielles sur mesure par Weblancia. Analyse, conception, développement et maintenance de logiciels adaptés à vos besoins métier.",
    difficulty: "Expert", deliveryDays: 90, readingTime: 11,
    relatedServices: ["web-applications", "api-integration", "workflow-automation", "crm-erp"],
  },

  // ── DIGITAL MARKETING ──

  "seo": {
    fullDescription: "Boostez votre visibilité sur Google et attirez un trafic qualifié grâce à notre stratégie SEO complète. Nous optimisons tous les aspects de votre référencement naturel : technique, sémantique et popularité. Notre approche data-driven combine analyse approfondie, optimisation technique pointue et création de contenu stratégique pour propulser votre site en tête des résultats de recherche.",
    technologies: ["Google Search Console", "Google Analytics", "SEMrush", "Ahrefs", "Screaming Frog", "Yoast SEO"],
    industries: ["Tous secteurs", "E-commerce", "Services", "Immobilier", "Santé", "Tourisme"],
    benefits: ["Trafic organique qualifié", "Visibilité accrue sur Google", "Retour sur investissement mesurable", "Stratégie content marketing", "Optimisation technique complète", "Rapports mensuels détaillés"],
    process: [
      { step: 1, title: "Audit SEO complet", description: "Analyse technique, sémantique et concurrentielle de votre site." },
      { step: 2, title: "Stratégie de mots-clés", description: "Recherche et sélection des mots-clés à fort potentiel." },
      { step: 3, title: "Optimisation on-page", description: "Optimisation des balises, contenus et structure du site." },
      { step: 4, title: "SEO technique", description: "Amélioration de la vitesse, du crawling et de l'indexation." },
      { step: 5, title: "Netlinking", description: "Stratégie de création de liens de qualité." },
      { step: 6, title: "Suivi & Reporting", description: "Analyse des performances et ajustement de la stratégie." },
    ],
    faqs: [
      { question: "Combien de temps faut-il pour voir des résultats SEO ?", answer: "Les premiers résultats apparaissent généralement entre 3 et 6 mois. Le SEO est un investissement à long terme qui nécessite de la patience et de la constance." },
      { question: "Quel est le coût d'une prestation SEO ?", answer: "Nos forfaits SEO commencent à partir de 5 000 MAD par mois pour un suivi régulier. Un audit SEO ponctuel est facturé à partir de 3 000 MAD." },
      { question: "Le SEO fonctionne-t-il pour tous les types de sites ?", answer: "Oui, le SEO est bénéfique pour tous les sites web. La stratégie est adaptée selon votre secteur, votre concurrence et vos objectifs." },
    ],
    startingPrice: 5000, currency: "MAD", ctaText: "Améliorer mon SEO",
    outcome: "Une visibilité durable sur Google et un trafic organique en croissance",
    keywords: ["seo", "référencement naturel", "référencement google", "agence seo maroc", "optimisation seo", "référencement site web"],
    seoTitle: "Agence SEO à Casablanca | Référencement Naturel Google | Weblancia",
    seoDescription: "Agence SEO à Casablanca spécialisée en référencement naturel Google. Audit, optimisation technique, content marketing et netlinking. Résultats garantis.",
    difficulty: "Avancé", deliveryDays: 90, readingTime: 12,
    relatedServices: ["local-seo", "technical-seo", "google-ads", "seo-audit"],
  },

  "local-seo": {
    fullDescription: "Attirez plus de clients locaux grâce à une stratégie de référencement local ciblée. Le SEO local est essentiel pour les entreprises qui souhaitent être trouvées par les clients à proximité. Nous optimisons votre présence sur Google My Business, les annuaires locaux et les recherches géolocalisées.",
    technologies: ["Google My Business", "Google Maps", "Google Search Console", "Local SEO Tools"],
    industries: ["Commerce local", "Restauration", "Santé", "Services à la personne", "Immobilier", "Tourisme"],
    benefits: ["Visibilité dans le pack local Google", "Plus de clients de proximité", "Optimisation Google My Business", "Citations et annuaires locaux", "Avis clients et réputation", "Trafic piétonnier accru"],
    process: [
      { step: 1, title: "Audit de présence locale", description: "Analyse de votre visibilité sur les recherches locales et Google Maps." },
      { step: 2, title: "Optimisation GMB", description: "Création et optimisation complète de votre fiche Google My Business." },
      { step: 3, title: "Citations locales", description: "Inscription et optimisation sur les annuaires locaux pertinents." },
      { step: 4, title: "Gestion des avis", description: "Stratégie de collecte et de gestion des avis clients." },
      { step: 5, title: "Contenu local", description: "Création de contenu optimisé pour les recherches locales." },
      { step: 6, title: "Suivi & Reporting", description: "Analyse des performances locales et ajustement de la stratégie." },
    ],
    faqs: [
      { question: "Qu'est-ce que le SEO local ?", answer: "Le SEO local vise à optimiser votre visibilité sur les recherches géolocalisées. Il permet à votre entreprise d'apparaître dans le pack local Google et Google Maps lorsque des clients potentiels recherchent vos services à proximité." },
      { question: "Pourquoi le SEO local est-il important ?", answer: "70% des consommateurs visitent un magasin dans les 24h après une recherche locale. Être visible localement est crucial pour attirer des clients de proximité." },
      { question: "Combien coûte une stratégie de SEO local ?", answer: "Nos forfaits de SEO local commencent à partir de 3 000 MAD par mois." },
    ],
    startingPrice: 3000, currency: "MAD", ctaText: "Booster ma visibilité locale",
    outcome: "Une présence locale renforcée qui attire plus de clients de proximité",
    keywords: ["seo local", "référencement local", "google my business", "google maps", "visibilité locale"],
    seoTitle: "SEO Local Casablanca | Référencement Géolocalisé | Weblancia",
    seoDescription: "Agence SEO local à Casablanca. Optimisation Google My Business, annuaires locaux et recherche géolocalisée pour attirer plus de clients près de chez vous.",
    difficulty: "Intermédiaire", deliveryDays: 60, readingTime: 8,
    relatedServices: ["seo", "technical-seo", "google-ads"],
  },

  "technical-seo": {
    fullDescription: "Optimisez les fondations techniques de votre site pour maximiser votre référencement. Le SEO technique concerne tous les aspects qui impactent la capacité des moteurs de recherche à crawler, indexer et comprendre votre site. Nous améliorons la vitesse de chargement, la structure des données, le maillage interne et la compatibilité mobile.",
    technologies: ["Screaming Frog", "Google Search Console", "Lighthouse", "PageSpeed Insights", "Schema.org", "GTmetrix"],
    industries: ["Tous secteurs", "E-commerce", "Médias", "SaaS", "Grands comptes"],
    benefits: ["Indexation optimale par Google", "Core Web Vitals améliorés", "Données structurées JSON-LD", "Architecture de site optimisée", "Erreurs techniques corrigées", "Performance mobile améliorée"],
    process: [
      { step: 1, title: "Audit technique approfondi", description: "Analyse complète avec outils professionnels (Screaming Frog, Lighthouse)." },
      { step: 2, title: "Correction des erreurs", description: "Résolution des problèmes de crawling, d'indexation et de contenu dupliqué." },
      { step: 3, title: "Optimisation des performances", description: "Amélioration du temps de chargement, Core Web Vitals et optimisation mobile." },
      { step: 4, title: "Données structurées", description: "Implémentation des schémas Schema.org pour les rich snippets." },
      { step: 5, title: "Maillage interne", description: "Optimisation de la structure des liens internes et du siloing." },
      { step: 6, title: "Suivi & Monitoring", description: "Surveillance continue des performances techniques et alertes." },
    ],
    faqs: [
      { question: "Qu'est-ce que le SEO technique ?", answer: "Le SEO technique regroupe tous les aspects techniques qui influencent le référencement : vitesse de chargement, structure du site, données structurées, crawling, indexation, et compatibilité mobile." },
      { question: "Quels sont les Core Web Vitals ?", answer: "Les Core Web Vitals sont des métriques de Google mesurant l'expérience utilisateur : LCP (chargement), FID (interactivité) et CLS (stabilité visuelle)." },
      { question: "À quelle fréquence faire un audit technique ?", answer: "Nous recommandons un audit technique complet tous les 3 à 6 mois, avec un suivi mensuel des métriques principales." },
    ],
    startingPrice: 4000, currency: "MAD", ctaText: "Auditer mon site",
    outcome: "Un site techniquement parfait pour les moteurs de recherche",
    keywords: ["seo technique", "référencement technique", "core web vitals", "données structurées", "optimisation site"],
    seoTitle: "SEO Technique | Optimisation Technique pour Google | Weblancia",
    seoDescription: "Audit et optimisation SEO technique par Weblancia. Core Web Vitals, données structurées, crawling, indexation et performance mobile.",
    difficulty: "Expert", deliveryDays: 30, readingTime: 10,
    relatedServices: ["seo", "local-seo", "website-audit", "performance-audit"],
  },

  "google-ads": {
    fullDescription: "Générez un trafic qualifié et des résultats immédiats avec Google Ads. Nous créons et gérons des campagnes publicitaires performantes sur Google Search, Shopping, Display et YouTube. Notre approche data-driven garantit un retour sur investissement optimal grâce à une gestion rigoureuse des enchères, des tests A/B continus et une optimisation permanente.",
    technologies: ["Google Ads", "Google Analytics", "Google Tag Manager", "Google Shopping", "Keyword Planner"],
    industries: ["E-commerce", "Services", "Immobilier", "Éducation", "Santé", "Tourisme"],
    benefits: ["Résultats immédiats et mesurables", "Ciblage précis (géographique, démographique)", "Budget maîtrisé et optimisé", "Campagnes Search, Shopping, Display, YouTube", "Tests A/B des annonces", "Reporting détaillé en temps réel"],
    process: [
      { step: 1, title: "Analyse & Stratégie", description: "Étude de votre marché et définition de la stratégie d'enchères." },
      { step: 2, title: "Structure des campagnes", description: "Création de campagnes structurées par objectif et par cible." },
      { step: 3, title: "Rédaction des annonces", description: "Création d'annonces persuasives avec extensions." },
      { step: 4, title: "Configuration du tracking", description: "Mise en place des conversions, GA4 et Tag Manager." },
      { step: 5, title: "Optimisation continue", description: "Ajustement des enchères, tests A/B et amélioration du QS." },
      { step: 6, title: "Reporting mensuel", description: "Analyse des performances et recommandations stratégiques." },
    ],
    faqs: [
      { question: "Quel budget minimum pour Google Ads ?", answer: "Nous recommandons un budget minimum de 5 000 MAD par mois pour des campagnes Search efficaces. Pour le Shopping, prévoyez au moins 10 000 MAD par mois." },
      { question: "Quand voir les premiers résultats ?", answer: "Les campagnes Google Ads génèrent du trafic dès leur activation. Cependant, il faut compter 2 à 4 semaines pour optimiser les enchères et atteindre des performances stables." },
      { question: "Quel est le ROI moyen d'une campagne Google Ads ?", answer: "Le ROI varie selon les secteurs, mais nos clients constatent en moyenne un retour de 4 à 8 fois leur investissement publicitaire." },
    ],
    startingPrice: 5000, currency: "MAD", ctaText: "Lancer mes annonces",
    outcome: "Des campagnes Google Ads rentables qui génèrent des leads qualifiés",
    keywords: ["google ads", "publicité google", "campagne search", "google shopping", "sea", "publicité en ligne"],
    seoTitle: "Google Ads Casablanca | Campagnes Publicitaires Performantes | Weblancia",
    seoDescription: "Agence Google Ads à Casablanca. Création et gestion de campagnes Search, Shopping, Display et YouTube. ROI optimisé et reporting transparent.",
    difficulty: "Avancé", deliveryDays: 7, readingTime: 9,
    relatedServices: ["seo", "meta-ads", "landing-pages"],
  },

  "meta-ads": {
    fullDescription: "Exploitez la puissance de Facebook et Instagram pour atteindre votre audience cible avec des campagnes publicitaires ultra-ciblées. Nous créons des stratégies social ads qui génèrent des leads qualifiés, des ventes et une notoriété de marque mesurable.",
    technologies: ["Meta Ads Manager", "Facebook Pixel", "Instagram", "Facebook Analytics", "Creative Hub"],
    industries: ["E-commerce", "Mode", "Services", "Formation", "Événementiel", "Restauration"],
    benefits: ["Ciblage ultra-précis", "Formats créatifs variés", "Retargeting puissant", "Facebook & Instagram", "Stories & Reels ads", "Reporting détaillé"],
    process: [
      { step: 1, title: "Stratégie social ads", description: "Définition des objectifs et de l'audience cible." },
      { step: 2, title: "Création des visuels", description: "Conception de créatives percutantes (images, vidéos, carrousels)." },
      { step: 3, title: "Configuration Pixel", description: "Installation et optimisation du pixel de suivi des conversions." },
      { step: 4, title: "Lancement des campagnes", description: "Mise en place des annonces avec enchères optimisées." },
      { step: 5, title: "Optimisation continue", description: "Tests A/B, ajustement du ciblage et des budgets." },
      { step: 6, title: "Reporting & Analyse", description: "Analyse des performances et recommandations stratégiques." },
    ],
    faqs: [
      { question: "Quel budget pour Meta Ads ?", answer: "Budget minimum recommandé de 3 000 MAD par mois pour obtenir des résultats significatifs." },
      { question: "Quels types d'annonces proposez-vous ?", answer: "Nous créons des annonces image, vidéo, carrousel, stories, reels, et collections selon vos objectifs et votre secteur." },
    ],
    startingPrice: 3000, currency: "MAD", ctaText: "Lancer mes Meta Ads",
    outcome: "Des campagnes social media rentables sur Facebook et Instagram",
    keywords: ["meta ads", "facebook ads", "instagram ads", "publicité facebook", "social ads", "publicité réseaux sociaux"],
    seoTitle: "Meta Ads Casablanca | Publicité Facebook & Instagram | Weblancia",
    seoDescription: "Campagnes Meta Ads performantes par Weblancia. Publicité Facebook et Instagram ciblée, créatives optimisées et ROI mesurable.",
    difficulty: "Intermédiaire", deliveryDays: 5, readingTime: 8,
    relatedServices: ["google-ads", "community-management", "landing-pages"],
  },

  "community-management": {
    fullDescription: "Développez une communauté engagée autour de votre marque sur les réseaux sociaux. Nous gérons votre présence sur Facebook, Instagram, LinkedIn, Twitter et TikTok avec une stratégie de contenu cohérente et des interactions authentiques qui renforcent votre image de marque.",
    technologies: ["Meta Business Suite", "Buffer", "Hootsuite", "Canva", "LinkedIn", "TikTok"],
    industries: ["Services", "E-commerce", "Mode", "Restauration", "Événementiel", "Éducation"],
    benefits: ["Présence active et cohérente", "Contenu engageant et de qualité", " croissance organique de l'audience", "Gestion des interactions et avis", "Community building authentique", "Analyse des performances"],
    process: [
      { step: 1, title: "Audit & Stratégie", description: "Analyse de votre présence actuelle et définition de la stratégie éditoriale." },
      { step: 2, title: "Calendrier éditorial", description: "Planification mensuelle des publications et campagnes." },
      { step: 3, title: "Création de contenu", description: "Production de visuels, vidéos et copywriting engageant." },
      { step: 4, title: "Publication & Animation", description: "Publication quotidienne et animation de la communauté." },
      { step: 5, title: "Modération & Engagement", description: "Réponse aux commentaires et messages, gestion de la e-réputation." },
      { step: 6, title: "Reporting mensuel", description: "Analyse des indicateurs de performance et recommandations." },
    ],
    faqs: [
      { question: "Quels réseaux sociaux gérez-vous ?", answer: "Nous gérons Facebook, Instagram, LinkedIn, Twitter et TikTok. Le choix des plateformes dépend de votre secteur et de votre audience cible." },
      { question: "Combien de publications par semaine ?", answer: "Nous recommandons 3 à 5 publications par semaine par plateforme, avec une stratégie adaptée à chaque réseau social." },
    ],
    startingPrice: 4000, currency: "MAD", ctaText: "Développer ma communauté",
    outcome: "Une communauté engagée qui renforce votre marque et génère des leads",
    keywords: ["community management", "réseaux sociaux", "social media", "gestion communauté", "social media manager"],
    seoTitle: "Community Management Casablanca | Gestion Réseaux Sociaux | Weblancia",
    seoDescription: "Gestion professionnelle de vos réseaux sociaux par Weblancia. Facebook, Instagram, LinkedIn, TikTok. Contenu engageant et croissance d'audience.",
    difficulty: "Intermédiaire", deliveryDays: 1, readingTime: 7,
    relatedServices: ["meta-ads", "brand-identity", "seo"],
  },

  // ── BRANDING & DESIGN ──

  "brand-identity": {
    fullDescription: "Construisez une identité de marque forte et cohérente qui vous différencie de vos concurrents. Nous créons des identités de marque complètes : logo, palette de couleurs, typographie, charte graphique et guidelines. Chaque élément est pensé pour communiquer vos valeurs et créer une connexion émotionnelle avec votre audience.",
    technologies: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "After Effects", "Premiere Pro"],
    industries: ["Tous secteurs", "Startups", "PME", "Grandes entreprises", "Associations"],
    benefits: ["Identité visuelle unique et mémorisable", "Cohérence sur tous les supports", "Différenciation concurrentielle", "Charte graphique complète", "Guide de marque détaillé", "Fichiers sources livrés"],
    process: [
      { step: 1, title: "Brief & Recherche", description: "Compréhension de votre marque, de vos valeurs et de votre marché." },
      { step: 2, title: "Concept & Direction", description: "Proposition de directions créatives et moodboards." },
      { step: 3, title: "Création du logo", description: "Design du logo principal et des variantes." },
      { step: 4, title: "Palette & Typographie", description: "Sélection des couleurs et typographies de marque." },
      { step: 5, title: "Charte graphique", description: "Document complet avec toutes les règles d'utilisation." },
      { step: 6, title: "Livraison des fichiers", description: "Fichiers sources dans tous les formats nécessaires." },
    ],
    faqs: [
      { question: "Combien coûte la création d'une identité de marque ?", answer: "Nos forfaits branding commencent à partir de 15 000 MAD, incluant logo, charte graphique et guide de marque complet." },
      { question: "Combien de temps faut-il ?", answer: "La création d'une identité de marque complète prend entre 3 et 6 semaines." },
    ],
    startingPrice: 15000, currency: "MAD", ctaText: "Créer ma marque",
    outcome: "Une identité de marque forte et cohérente qui marque les esprits",
    keywords: ["identité de marque", "branding", "charte graphique", "logo", "marque", "brand identity"],
    seoTitle: "Création d'Identité de Marque | Branding Casablanca | Weblancia",
    seoDescription: "Agence de branding à Casablanca. Création d'identité de marque complète : logo, charte graphique, guide de marque et stratégie de marque.",
    difficulty: "Intermédiaire", deliveryDays: 30, readingTime: 8,
    relatedServices: ["logo-design", "ui-ux-design", "corporate-websites"],
  },

  "logo-design": {
    fullDescription: "Un logo professionnel est la pierre angulaire de votre identité visuelle. Nous créons des logos uniques et mémorables qui incarnent l'essence de votre marque. Chaque logo est conçu avec une approche stratégique, en tenant compte de votre secteur, de vos valeurs et de votre audience cible.",
    technologies: ["Adobe Illustrator", "Figma", "Adobe Photoshop"],
    industries: ["Tous secteurs", "Startups", "PME", "Commerces", "Professions libérales"],
    benefits: ["Logo unique et professionnel", "Décliné en plusieurs versions", "Adapté à tous les supports", "Fichiers vectoriels livrés", "Droits d'utilisation inclus", "Révisions illimitées"],
    process: [
      { step: 1, title: "Brief créatif", description: "Compréhension de votre activité et de vos préférences." },
      { step: 2, title: "Recherche & Inspiration", description: "Analyse des tendances et création de moodboards." },
      { step: 3, title: "Propositions de concepts", description: "3 à 5 concepts de logo présentés avec justifications." },
      { step: 4, title: "Affinage & Révisions", description: "Amélioration du concept retenu avec révisions." },
      { step: 5, title: "Déclinaisons", description: "Versions couleur, noir & blanc, horizontal, vertical." },
      { step: 6, title: "Livraison finale", description: "Fichiers sources dans tous les formats (AI, EPS, PNG, SVG)." },
    ],
    faqs: [
      { question: "Combien coûte la création d'un logo ?", answer: "Nos logos professionnels commencent à partir de 3 000 MAD. Ce prix inclut la recherche, la création, les révisions et les fichiers sources." },
      { question: "Combien de concepts proposez-vous ?", answer: "Nous proposons 3 à 5 concepts de logo différents, avec 2 à 3 rounds de révisions sur le concept retenu." },
    ],
    startingPrice: 3000, currency: "MAD", ctaText: "Créer mon logo",
    outcome: "Un logo professionnel et unique qui représente votre marque",
    keywords: ["logo", "création logo", "design logo", "logo professionnel", "logo entreprise"],
    seoTitle: "Création de Logo Professionnel | Design Logo Casablanca | Weblancia",
    seoDescription: "Création de logo professionnel par Weblancia. Design unique, fichiers vectoriels, droits d'utilisation inclus. Devis gratuit.",
    difficulty: "Facile", deliveryDays: 14, readingTime: 5,
    relatedServices: ["brand-identity", "ui-ux-design", "corporate-websites"],
  },

  "ui-ux-design": {
    fullDescription: "Des interfaces utilisateur intuitives et des expériences utilisateur exceptionnelles. Nous concevons des designs centrés sur l'utilisateur qui améliorent la satisfaction, l'engagement et la conversion. De la recherche utilisateur aux maquettes interactives, notre processus UX/UI garantit des produits digitaux qui répondent parfaitement aux besoins de vos utilisateurs.",
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Framer", "Hotjar"],
    industries: ["SaaS", "E-commerce", "Applications", "Plateformes", "Médias", "Services"],
    benefits: ["UX Research approfondie", "Wireframes & prototypes interactifs", "Design system complet", "Tests utilisateur", "Accessibilité (WCAG)", "Design handoff clair"],
    process: [
      { step: 1, title: "Recherche utilisateur", description: "Interviews, surveys et analyse des comportements." },
      { step: 2, title: "Architecture de l'information", description: "Structure et organisation du contenu." },
      { step: 3, title: "Wireframes", description: "Maquettes basse-fidélité des écrans clés." },
      { step: 4, title: "Design visuel", description: "Création de l'interface avec la charte graphique." },
      { step: 5, title: "Prototype interactif", description: "Prototype cliquable pour tests utilisateur." },
      { step: 6, title: "Tests & Itérations", description: "Tests utilisateur et améliorations basées sur les retours." },
    ],
    faqs: [
      { question: "Quelle est la différence entre UI et UX ?", answer: "L'UX (User Experience) concerne l'expérience globale et la facilité d'utilisation, tandis que l'UI (User Interface) concerne l'aspect visuel et l'interaction avec l'interface." },
      { question: "Combien coûte une prestation UI/UX ?", answer: "Nos prestations UI/UX commencent à partir de 10 000 MAD pour un projet simple, et peuvent atteindre 50 000 MAD pour un design system complet." },
    ],
    startingPrice: 10000, currency: "MAD", ctaText: "Designer mon interface",
    outcome: "Une interface utilisateur intuitive qui maximise l'engagement et la conversion",
    keywords: ["ui ux design", "design interface", "expérience utilisateur", "ux research", "figma", "prototype"],
    seoTitle: "Design UI/UX Casablanca | Conception d'Interfaces | Weblancia",
    seoDescription: "Agence UI/UX à Casablanca. Design d'interfaces intuitives, recherche utilisateur, prototypage interactif et design system.",
    difficulty: "Avancé", deliveryDays: 30, readingTime: 9,
    relatedServices: ["brand-identity", "web-applications", "mobile-apps"],
  },

  // ── CONSULTING ──

  "startup-consulting": {
    fullDescription: "Accompagnement stratégique pour startups digitales. Nous aidons les fondateurs à valider leur idée, construire leur MVP, définir leur stratégie de croissance et préparer leurs levées de fonds. Notre expertise couvre le product-market fit, la growth strategy et l'optimisation des opérations.",
    technologies: ["Notion", "Jira", "Mixpanel", "Amplitude", "Segment", "Stripe"],
    industries: ["Startups", "Tech", "SaaS", "Marketplace", "Fintech", "Healthtech"],
    benefits: ["Validation du product-market fit", "Stratégie de croissance data-driven", "Optimisation des unit economics", "Accompagnement levée de fonds", "Mise en place des KPIs", "Roadmap produit priorisée"],
    process: [
      { step: 1, title: "Audit & Diagnostic", description: "Analyse de votre positionnement, marché et traction." },
      { step: 2, title: "Stratégie produit", description: "Définition de la vision produit et roadmap priorisée." },
      { step: 3, title: "Growth strategy", description: "Plan de croissance avec canaux d'acquisition et rétention." },
      { step: 4, title: "Optimisation des opérations", description: "Automatisation et optimisation des processus clés." },
      { step: 5, title: "Préparation levée de fonds", description: "Business plan, pitch deck et due diligence." },
      { step: 6, title: "Suivi & Ajustement", description: "Suivi des KPIs et ajustement de la stratégie." },
    ],
    faqs: [
      { question: "À quel stade consulter un startup consultant ?", answer: "Idéalement dès la phase d'idéation pour valider votre concept, ou au moment de la recherche de product-market fit pour accélérer votre croissance." },
      { question: "Combien coûte un accompagnement startup ?", answer: "Nos forfaits de consulting startup commencent à partir de 8 000 MAD par mois pour un accompagnement léger." },
    ],
    startingPrice: 8000, currency: "MAD", ctaText: "Accélérer ma startup",
    outcome: "Une stratégie claire et actionnable pour votre startup",
    keywords: ["startup consulting", "accompagnement startup", "conseil startup", "growth strategy", "product market fit"],
    seoTitle: "Consulting pour Startups | Accompagnement Stratégique | Weblancia",
    seoDescription: "Accompagnement stratégique pour startups digitales. Validation, MVP, growth strategy et préparation levée de fonds par Weblancia.",
    difficulty: "Expert", deliveryDays: 30, readingTime: 10,
    relatedServices: ["business-consulting", "technical-consulting", "strategy-consulting"],
  },

  "business-consulting": {
    fullDescription: "Conseil en stratégie digitale pour transformer votre entreprise. Nous vous aidons à définir votre vision digitale, optimiser vos processus et identifier les opportunités de croissance. Notre approche pragmatique combine analyse de marché, benchmarking et recommandations actionnables.",
    technologies: ["Power BI", "Tableau", "Notion", "Monday.com", "Asana", "Slack"],
    industries: ["Tous secteurs", "PME", "Grandes entreprises", "Services", "Industrie"],
    benefits: ["Diagnostic digital complet", "Feuille de route stratégique", "Optimisation des processus", "Recommandations actionnables", "Accompagnement au changement", "KPIs et tableau de bord"],
    process: [
      { step: 1, title: "Diagnostic digital", description: "Analyse de votre maturité digitale et de vos processus." },
      { step: 2, title: "Benchmark concurrentiel", description: "Analyse des meilleures pratiques de votre secteur." },
      { step: 3, title: "Stratégie digitale", description: "Définition de la feuille de route digitale." },
      { step: 4, title: "Plan d'action", description: "Priorisation des actions et allocation des ressources." },
      { step: 5, title: "Accompagnement", description: "Suivi de la mise en œuvre et ajustements." },
      { step: 6, title: "Mesure des résultats", description: "Analyse des KPIs et optimisation continue." },
    ],
    faqs: [
      { question: "Qu'est-ce que le consulting business digital ?", answer: "C'est un accompagnement stratégique qui aide les entreprises à définir et mettre en œuvre leur transformation digitale pour améliorer leur performance." },
    ],
    startingPrice: 10000, currency: "MAD", ctaText: "Transformer mon entreprise",
    outcome: "Une stratégie digitale claire qui accélère votre croissance",
    keywords: ["business consulting", "conseil entreprise", "stratégie digitale", "transformation digitale"],
    seoTitle: "Conseil en Stratégie Digitale | Business Consulting | Weblancia",
    seoDescription: "Consulting business digital par Weblancia. Diagnostic, stratégie et accompagnement pour la transformation digitale de votre entreprise.",
    difficulty: "Expert", deliveryDays: 45, readingTime: 10,
    relatedServices: ["startup-consulting", "strategy-consulting", "technical-consulting"],
  },

  "technical-consulting": {
    fullDescription: "Conseil technique pour vos projets digitaux. Nous vous aidons à faire les bons choix technologiques, architecturaux et d'infrastructure. Que ce soit pour la création d'un nouveau produit, la migration d'un système existant ou l'optimisation de vos performances techniques.",
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "GraphQL", "microservices"],
    industries: ["Tech", "SaaS", "Fintech", "E-commerce", "Scale-ups", "Enterprise"],
    benefits: ["Architecture optimisée et scalable", "Choix technologiques éclairés", "Réduction des coûts techniques", "Sécurité renforcée", "Performance améliorée", "Documentation technique complète"],
    process: [
      { step: 1, title: "Audit technique", description: "Analyse de votre stack technique et de vos pratiques." },
      { step: 2, title: "Recommandations", description: "Propositions d'améliorations et de choix technologiques." },
      { step: 3, title: "Architecture cible", description: "Conception de l'architecture technique optimale." },
      { step: 4, title: "Plan de migration", description: "Feuille de route pour les changements techniques." },
      { step: 5, title: "Accompagnement", description: "Support technique pendant la mise en œuvre." },
      { step: 6, title: "Revue & Optimisation", description: "Revue de code et optimisation continue." },
    ],
    faqs: [
      { question: "Quand faire appel à un consultant technique ?", answer: "Lorsque vous devez faire des choix technologiques importants, optimiser votre architecture, ou préparer une migration technique complexe." },
    ],
    startingPrice: 12000, currency: "MAD", ctaText: "Consulter un expert",
    outcome: "Une architecture technique robuste et évolutive",
    keywords: ["technical consulting", "conseil technique", "architecture logicielle", "consulting tech"],
    seoTitle: "Consulting Technique | Conseil en Architecture Logicielle | Weblancia",
    seoDescription: "Consulting technique par Weblancia. Architecture, stack technologique, migration et optimisation pour vos projets digitaux.",
    difficulty: "Expert", deliveryDays: 30, readingTime: 9,
    relatedServices: ["startup-consulting", "web-applications", "technical-seo"],
  },

  "strategy-consulting": {
    fullDescription: "Une stratégie digitale gagnante pour votre entreprise. Nous vous accompagnons dans la définition de votre vision, la priorisation de vos initiatives et l'optimisation de votre présence en ligne. Notre approche holistique couvre le marketing, la technologie, les opérations et la croissance.",
    technologies: ["Google Analytics", "SEMrush", "Hotjar", "Notion", "Miro", "Figma"],
    industries: ["Tous secteurs", "PME", "Grandes entreprises", "Startups", "Associations"],
    benefits: ["Vision stratégique claire", "Roadmap priorisée", "Allocation budgétaire optimisée", "KPIs alignés sur les objectifs", "Avantage concurrentiel", "Croissance durable"],
    process: [
      { step: 1, title: "Analyse stratégique", description: "Audit complet de votre présence digitale et de votre marché." },
      { step: 2, title: "Définition de la vision", description: "Objectifs à long terme et positionnement stratégique." },
      { step: 3, title: "Plan stratégique", description: "Feuille de route avec initiatives prioritaires." },
      { step: 4, title: "Budget & Ressources", description: "Allocation des budgets et des ressources." },
      { step: 5, title: "Mise en œuvre", description: "Accompagnement dans l'exécution du plan." },
      { step: 6, title: "Suivi & Ajustement", description: "Monitoring des KPIs et ajustement stratégique." },
    ],
    faqs: [
      { question: "Quelle est la différence entre consulting stratégique et business consulting ?", answer: "Le consulting stratégique se concentre sur la vision et le positionnement à long terme, tandis que le business consulting est plus opérationnel." },
    ],
    startingPrice: 15000, currency: "MAD", ctaText: "Définir ma stratégie",
    outcome: "Une stratégie digitale claire et actionnable pour votre croissance",
    keywords: ["stratégie digitale", "consulting stratégique", "conseil stratégie", "digital strategy"],
    seoTitle: "Consulting Stratégique | Stratégie Digitale | Weblancia",
    seoDescription: "Consulting stratégique digital par Weblancia. Vision, positionnement et feuille de route pour votre transformation digitale.",
    difficulty: "Expert", deliveryDays: 45, readingTime: 10,
    relatedServices: ["business-consulting", "startup-consulting", "seo"],
  },

  // ── TECHNOLOGY ── (services 21-26)

  "laravel": {
    fullDescription: "Développement d'applications web robustes avec Laravel. Nous exploitons la puissance de ce framework PHP moderne pour créer des applications back-end performantes, sécurisées et évolutives. API RESTful, panneaux d'administration, portails clients et applications métier complexes.",
    technologies: ["Laravel", "PHP 8", "MySQL", "Redis", "Livewire", "Alpine.js"],
    industries: ["Services", "Finance", "E-commerce", "Éducation", "SaaS", "PME"],
    benefits: ["Back-end robuste et sécurisé", "API RESTful performantes", "Administration personnalisée", "Base de données optimisée", "Cache et performance", "Documentation complète"],
    process: [
      { step: 1, title: "Analyse des besoins", description: "Compréhension des fonctionnalités et contraintes techniques." },
      { step: 2, title: "Architecture back-end", description: "Conception de la base de données et de l'API." },
      { step: 3, title: "Développement Laravel", description: "Création des modèles, contrôleurs et services." },
      { step: 4, title: "API & Intégrations", description: "Développement des API RESTful." },
      { step: 5, title: "Tests & Sécurité", description: "Tests unitaires et audit de sécurité." },
      { step: 6, title: "Déploiement", description: "Mise en production et documentation." },
    ],
    faqs: [
      { question: "Pourquoi choisir Laravel pour mon projet ?", answer: "Laravel offre une syntaxe élégante, une sécurité intégrée, un ORM puissant (Eloquent) et un écosystème riche (Forge, Vapor, Nova)." },
    ],
    startingPrice: 20000, currency: "MAD", ctaText: "Développer en Laravel",
    outcome: "Une application Laravel robuste, sécurisée et évolutive",
    keywords: ["laravel", "développement laravel", "php laravel", "framework php", "back-end laravel"],
    seoTitle: "Développement Laravel Casablanca | Applications PHP | Weblancia",
    seoDescription: "Développement Laravel par Weblancia. Applications back-end, API RESTful et panneaux d'administration avec Laravel, le framework PHP moderne.",
    difficulty: "Avancé", deliveryDays: 45, readingTime: 8,
    relatedServices: ["react-nextjs", "javascript-typescript", "api-integration"],
  },

  "react-nextjs": {
    fullDescription: "Développement front-end moderne avec React et Next.js. Nous créons des interfaces utilisateur réactives, performantes et optimisées pour le SEO. Next.js apporte le rendu côté serveur, la génération statique et les performances d'une single-page application.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "GraphQL"],
    industries: ["SaaS", "E-commerce", "Médias", "Tech", "Startups", "PME"],
    benefits: ["Performance optimale (SSR/SSG)", "SEO-friendly", "TypeScript pour la fiabilité", "Composants réutilisables", "Hot reload & DX", "Déploiement simplifié"],
    process: [
      { step: 1, title: "Architecture composants", description: "Découpage de l'interface en composants réutilisables." },
      { step: 2, title: "Design system", description: "Mise en place des composants de base et thème." },
      { step: 3, title: "Développement front-end", description: "Création des pages et interactions." },
      { step: 4, title: "Intégration API", description: "Connexion aux API et gestion d'état." },
      { step: 5, title: "Tests & Optimisation", description: "Tests, build et optimisation des performances." },
      { step: 6, title: "Déploiement", description: "Mise en production avec Vercel/Netlify." },
    ],
    faqs: [
      { question: "Quels sont les avantages de Next.js ?", answer: "Next.js offre le rendu côté serveur pour le SEO, la génération statique pour les performances, et une excellente expérience développeur." },
    ],
    startingPrice: 20000, currency: "MAD", ctaText: "Développer en React/Next.js",
    outcome: "Une application React/Next.js moderne, performante et SEO-friendly",
    keywords: ["react", "next.js", "développement react", "développement next.js", "front-end"],
    seoTitle: "Développement React & Next.js Casablanca | Weblancia",
    seoDescription: "Développement React et Next.js par Weblancia. Applications web modernes, SSR, performance optimale et SEO-friendly.",
    difficulty: "Avancé", deliveryDays: 45, readingTime: 8,
    relatedServices: ["laravel", "javascript-typescript", "web-applications"],
  },

  "wordpress": {
    fullDescription: "Sites WordPress professionnels, performants et sécurisés. Nous créons des thèmes sur mesure et des configurations optimisées pour WordPress, le CMS le plus populaire au monde. Sites vitrine, e-commerce (WooCommerce), blogs et portails d'entreprise.",
    technologies: ["WordPress", "WooCommerce", "PHP", "MySQL", "Elementor", "ACF"],
    industries: ["PME", "E-commerce", "Médias", "Blogs", "Associations", "Services"],
    benefits: ["CMS facile à utiliser", "Thème sur mesure", "WooCommerce intégré", "SEO optimisé (Yoast)", "Sécurité renforcée", "Performance optimisée"],
    process: [
      { step: 1, title: "Configuration WordPress", description: "Installation et configuration optimisée." },
      { step: 2, title: "Thème sur mesure", description: "Création d'un thème personnalisé." },
      { step: 3, title: "Fonctionnalités", description: "Développement des fonctionnalités spécifiques." },
      { step: 4, title: "Plugins & Extensions", description: "Configuration des plugins nécessaires." },
      { step: 5, title: "SEO & Performance", description: "Optimisation pour les moteurs de recherche." },
      { step: 6, title: "Sécurité & Sauvegarde", description: "Mise en place des mesures de sécurité." },
    ],
    faqs: [
      { question: "WordPress est-il adapté aux sites professionnels ?", answer: "Absolument. WordPress alimente 40% des sites web mondiaux, incluant de grands sites d'entreprise, e-commerce et médias." },
    ],
    startingPrice: 8000, currency: "MAD", ctaText: "Créer mon site WordPress",
    outcome: "Un site WordPress professionnel, facile à gérer et performant",
    keywords: ["wordpress", "création site wordpress", "woocommerce", "theme wordpress", "cms"],
    seoTitle: "Création de Sites WordPress Professionnels | Weblancia",
    seoDescription: "Sites WordPress sur mesure par Weblancia. Thèmes personnalisés, WooCommerce, SEO optimisé et sécurité renforcée.",
    difficulty: "Intermédiaire", deliveryDays: 20, readingTime: 7,
    relatedServices: ["react-nextjs", "ecommerce", "website-maintenance"],
  },

  "flutter": {
    fullDescription: "Applications mobiles cross-platform avec Flutter. Développez une application unique pour iOS et Android avec des performances natives. Flutter, le framework de Google, offre une expérience utilisateur fluide et un time-to-market réduit.",
    technologies: ["Flutter", "Dart", "Firebase", "REST API", "iOS", "Android"],
    industries: ["Services", "E-commerce", "Santé", "Éducation", "Restauration", "Startups"],
    benefits: ["Cross-platform iOS/Android", "Performance native", "UI cohérente", "Time-to-market réduit", "Code maintenable", "Communauté active"],
    process: [
      { step: 1, title: "Stratégie mobile", description: "Définition des fonctionnalités et de l'architecture." },
      { step: 2, title: "Design UI Flutter", description: "Création des interfaces avec le système de widgets Flutter." },
      { step: 3, title: "Développement", description: "Développement des fonctionnalités et intégrations." },
      { step: 4, title: "Tests multiplateforme", description: "Tests sur iOS et Android." },
      { step: 5, title: "Publication", description: "Soumission sur App Store et Google Play." },
    ],
    faqs: [
      { question: "Flutter vs React Native : lequel choisir ?", answer: "Flutter offre des performances plus proches du natif et une UI plus cohérente. React Native a un écosystème plus large. Le choix dépend de votre projet." },
    ],
    startingPrice: 35000, currency: "MAD", ctaText: "Développer en Flutter",
    outcome: "Une application mobile Flutter performante pour iOS et Android",
    keywords: ["flutter", "développement flutter", "application mobile flutter", "cross-platform", "dart"],
    seoTitle: "Développement Flutter Casablanca | Apps iOS & Android | Weblancia",
    seoDescription: "Applications mobiles Flutter par Weblancia. Développement cross-platform iOS et Android avec des performances natives.",
    difficulty: "Avancé", deliveryDays: 60, readingTime: 8,
    relatedServices: ["react-nextjs", "mobile-apps", "api-integration"],
  },

  "javascript-typescript": {
    fullDescription: "Développement full-stack avec JavaScript et TypeScript. De la création d'API avec Node.js aux interfaces utilisateur avec React, nous maîtrisons l'écosystème JavaScript pour livrer des applications modernes et fiables.",
    technologies: ["JavaScript", "TypeScript", "Node.js", "Express", "React", "PostgreSQL"],
    industries: ["Tech", "SaaS", "Startups", "PME", "E-commerce", "Services"],
    benefits: ["Full-stack JavaScript", "TypeScript pour la sécurité", "API performantes", "Front-end réactif", "Écosystème riche", "Code maintenable"],
    process: [
      { step: 1, title: "Architecture", description: "Structure du projet et choix techniques." },
      { step: 2, title: "Back-end Node.js", description: "Développement de l'API et de la logique métier." },
      { step: 3, title: "Front-end", description: "Création de l'interface utilisateur." },
      { step: 4, title: "Base de données", description: "Modélisation et implémentation." },
      { step: 5, title: "Tests & Déploiement", description: "Tests automatisés et mise en production." },
    ],
    faqs: [
      { question: "Pourquoi utiliser TypeScript plutôt que JavaScript ?", answer: "TypeScript apporte le typage statique qui permet de détecter les erreurs à la compilation, améliorant la fiabilité et la maintenabilité du code." },
    ],
    startingPrice: 18000, currency: "MAD", ctaText: "Développer en JS/TS",
    outcome: "Des applications JavaScript/TypeScript fiables et performantes",
    keywords: ["javascript", "typescript", "développement js", "node.js", "full-stack"],
    seoTitle: "Développement JavaScript & TypeScript | Weblancia",
    seoDescription: "Développement JavaScript et TypeScript par Weblancia. Node.js, React, API et applications full-stack modernes.",
    difficulty: "Avancé", deliveryDays: 45, readingTime: 8,
    relatedServices: ["react-nextjs", "laravel", "web-applications"],
  },

  // ── MAINTENANCE ── (services 27-30)

  "website-maintenance": {
    fullDescription: "Gardez votre site à jour, sécurisé et performant avec notre service de maintenance mensuelle. Nous assurons les mises à jour de sécurité, les sauvegardes, le monitoring et les optimisations continues pour que votre site reste au meilleur de sa forme.",
    technologies: ["WordPress", "Laravel", "Next.js", "cPanel", "Cloudflare", "Uptime Robot"],
    industries: ["Tous secteurs"],
    benefits: ["Sécurité renforcée", "Mises à jour automatiques", "Sauvegardes régulières", "Monitoring 24/7", "Support prioritaire", "Rapports mensuels"],
    process: [
      { step: 1, title: "Audit initial", description: "État des lieux complet de votre site." },
      { step: 2, title: "Plan de maintenance", description: "Définition des tâches récurrentes." },
      { step: 3, title: "Mises à jour régulières", description: "Mise à jour des CMS, plugins et librairies." },
      { step: 4, title: "Sauvegardes", description: "Sauvegardes automatiques quotidiennes." },
      { step: 5, title: "Monitoring", description: "Surveillance de la disponibilité et performance." },
      { step: 6, title: "Rapports mensuels", description: "Rapport détaillé des actions effectuées." },
    ],
    faqs: [
      { question: "Pourquoi la maintenance est-elle importante ?", answer: "Un site non maintenu devient vulnérable aux attaques, peut rencontrer des problèmes de compatibilité et perdre en performance." },
      { question: "Combien coûte la maintenance mensuelle ?", answer: "Nos forfaits de maintenance commencent à partir de 1 000 MAD par mois pour un site vitrine simple." },
    ],
    startingPrice: 1000, currency: "MAD", ctaText: "Maintenir mon site",
    outcome: "Un site toujours à jour, sécurisé et performant",
    keywords: ["maintenance site web", "maintenance wordpress", "maintenance site", "sécurité site web"],
    seoTitle: "Maintenance de Sites Web | Forfaits Mensuels | Weblancia",
    seoDescription: "Maintenance professionnelle de sites web par Weblancia. Mises à jour, sécurité, sauvegardes et monitoring 24/7.",
    difficulty: "Facile", deliveryDays: 1, readingTime: 6,
    relatedServices: ["hosting", "security-audit", "website-migration"],
  },

  "hosting": {
    fullDescription: "Hébergement premium pour vos sites web et applications. Nous proposons des solutions d'hébergement performantes, sécurisées et adaptées à vos besoins. Serveurs optimisés, certificat SSL, sauvegardes automatiques et support technique réactif.",
    technologies: ["VPS", "cPanel", "Cloudflare", "SSL", "LiteSpeed", "Docker"],
    industries: ["Tous secteurs"],
    benefits: ["Performance optimale", "Sécurité renforcée", "Sauvegardes automatiques", "SSL inclus", "Support 24/7", "Monitoring continu"],
    process: [
      { step: 1, title: "Analyse des besoins", description: "Évaluation de vos besoins en ressources et performance." },
      { step: 2, title: "Configuration serveur", description: "Mise en place du serveur optimisé pour votre stack." },
      { step: 3, title: "Sécurité & SSL", description: "Configuration de la sécurité et certificat SSL." },
      { step: 4, title: "Migration des données", description: "Transfert sécurisé de vos fichiers et bases de données." },
      { step: 5, title: "Tests & Optimisation", description: "Tests de performance et optimisation des paramètres." },
      { step: 6, title: "Mise en production", description: "Activation et monitoring continu." },
    ],
    faqs: [
      { question: "Quel type d'hébergement pour mon site ?", answer: "Pour un site vitrine, un hébergement mutualisé premium suffit. Pour une application ou un e-commerce, nous recommandons un VPS." },
      { question: "Proposez-vous un certificat SSL ?", answer: "Oui, tous nos hébergements incluent un certificat SSL Let's Encrypt ou un certificat payant selon vos besoins." },
    ],
    startingPrice: 150, currency: "MAD", ctaText: "Choisir mon hébergement",
    outcome: "Un hébergement performant et sécurisé pour votre site",
    keywords: ["hébergement web", "hosting", "serveur", "vps", "hébergement maroc"],
    seoTitle: "Hébergement Web Premium Casablanca | Weblancia",
    seoDescription: "Hébergement web premium par Weblancia. Performant, sécurisé avec SSL, sauvegardes et support 24/7.",
    difficulty: "Facile", deliveryDays: 1, readingTime: 5,
    relatedServices: ["website-maintenance", "professional-emails", "website-migration"],
  },

  "professional-emails": {
    fullDescription: "Des adresses email professionnelles pour renforcer votre crédibilité et votre image de marque. Configuration d'emails à votre nom de domaine avec Google Workspace ou Microsoft 365, garantissant une livraison optimale et une sécurité maximale.",
    technologies: ["Google Workspace", "Microsoft 365", "MX Records", "SPF", "DKIM", "DMARC"],
    industries: ["Tous secteurs"],
    benefits: ["Crédibilité professionnelle", "Boîtes sécurisées", "Collaboration d'équipe", "Calendriers partagés", "Support technique", "Anti-spam avancé"],
    process: [
      { step: 1, title: "Audit des besoins", description: "Analyse de vos besoins en messagerie et nombre d'utilisateurs." },
      { step: 2, title: "Choix de la solution", description: "Recommandation Google Workspace ou Microsoft 365." },
      { step: 3, title: "Configuration DNS", description: "Mise en place des enregistrements MX, SPF, DKIM et DMARC." },
      { step: 4, title: "Création des comptes", description: "Configuration des boîtes aux lettres et alias." },
      { step: 5, title: "Migration des données", description: "Transfert des emails existants vers la nouvelle solution." },
      { step: 6, title: "Formation & Support", description: "Formation de l'équipe et support après déploiement." },
    ],
    faqs: [
      { question: "Pourquoi des emails professionnels ?", answer: "Les emails à votre nom de domaine (contact@votreentreprise.com) inspirent confiance et renforcent votre professionnalisme." },
      { question: "Quelle solution recommandez-vous ?", answer: "Google Workspace pour sa fiabilité et ses outils collaboratifs, ou Microsoft 365 pour l'intégration avec l'écosystème Microsoft." },
    ],
    startingPrice: 100, currency: "MAD", ctaText: "Configurer mes emails",
    outcome: "Des emails professionnels qui inspirent confiance",
    keywords: ["email professionnel", "google workspace", "microsoft 365", "email entreprise"],
    seoTitle: "Emails Professionnels | Google Workspace & Microsoft 365 | Weblancia",
    seoDescription: "Configuration d'emails professionnels par Weblancia. Google Workspace, Microsoft 365, SPF/DKIM/DMARC.",
    difficulty: "Facile", deliveryDays: 2, readingTime: 4,
    relatedServices: ["hosting", "website-maintenance"],
  },

  "website-migration": {
    fullDescription: "Migration sécurisée de votre site web vers une nouvelle plateforme, un nouvel hébergeur ou une nouvelle technologie. Nous assurons une transition en douceur avec zéro temps d'arrêt et une préservation complète de votre SEO.",
    technologies: ["WordPress", "cPanel", "SSH", "Rsync", "Cloudflare", "DNS"],
    industries: ["Tous secteurs"],
    benefits: ["Migration sans downtime", "SEO préservé", "Données sécurisées", "Tests complets", "Support post-migration", "Documentation"],
    process: [
      { step: 1, title: "Audit pré-migration", description: "Analyse complète de votre site actuel (technologies, base de données, SEO)." },
      { step: 2, title: "Plan de migration", description: "Élaboration du plan détaillé de migration avec timeline." },
      { step: 3, title: "Environnement de test", description: "Création d'un environnement de test pour valider la migration." },
      { step: 4, title: "Migration des données", description: "Transfert sécurisé des fichiers et bases de données." },
      { step: 5, title: "Tests & Validation", description: "Tests complets de fonctionnement et vérification SEO." },
      { step: 6, title: "Basculement & Support", description: "Basculement DNS et support post-migration." },
    ],
    faqs: [
      { question: "Combien de temps prend une migration ?", answer: "Une migration standard prend 1 à 3 jours. Une migration complexe (changement de technologie) peut prendre 1 à 2 semaines." },
      { question: "Mon site sera-t-il indisponible ?", answer: "Non, nous planifions la migration pour garantir zéro temps d'arrêt grâce à des techniques de basculement progressif." },
    ],
    startingPrice: 3000, currency: "MAD", ctaText: "Migrer mon site",
    outcome: "Une migration réussie sans interruption de service",
    keywords: ["migration site web", "transfert site", "migration wordpress", "changement hébergeur"],
    seoTitle: "Migration de Sites Web | Transfert Professionnel | Weblancia",
    seoDescription: "Migration de site web professionnelle par Weblancia. Zéro temps d'arrêt, SEO préservé et support post-migration.",
    difficulty: "Intermédiaire", deliveryDays: 5, readingTime: 6,
    relatedServices: ["hosting", "website-maintenance", "website-audit"],
  },

  // ── AUTOMATION ── (services 31-35)

  "api-integration": {
    fullDescription: "Intégration d'API tierces pour connecter vos outils et automatiser vos flux de données. Nous connectons vos applications entre elles : CRM, ERP, marketing automation, paiement, expédition et plus encore.",
    technologies: ["REST API", "GraphQL", "Webhooks", "Node.js", "Python", "Docker"],
    industries: ["E-commerce", "Services", "Finance", "Logistique", "SaaS"],
    benefits: ["Automatisation des flux", "Données synchronisées", "Gain de temps significatif", "Réduction des erreurs", "Scalabilité", "Monitoring"],
    faqs: [
      { question: "Qu'est-ce qu'une API ?", answer: "Une API (Application Programming Interface) permet à deux applications de communiquer entre elles automatiquement, sans intervention humaine." },
    ],
    startingPrice: 8000, currency: "MAD", ctaText: "Intégrer mes APIs",
    outcome: "Des systèmes connectés qui travaillent ensemble automatiquement",
    keywords: ["api", "intégration api", "api integration", "webhook", "api rest"],
    seoTitle: "Intégration d'API | Automatisation & Connecteurs | Weblancia",
    seoDescription: "Intégration d'API professionnelle par Weblancia. REST, GraphQL, webhooks. Connectez vos outils et automatisez vos flux.",
    difficulty: "Avancé", deliveryDays: 30, readingTime: 8,
    relatedServices: ["workflow-automation", "crm-erp", "data-scraping"],
  },

  "data-scraping": {
    fullDescription: "Extraction automatisée de données depuis le web. Nous développons des scripts de scraping robustes pour collecter les données dont vous avez besoin : prix concurrents, avis clients, annonces, données marché et plus encore.",
    technologies: ["Python", "Scrapy", "Selenium", "BeautifulSoup", "Playwright", "Docker"],
    industries: ["E-commerce", "Marketing", "Finance", "Recherche", "Immobilier"],
    benefits: ["Données collectées automatiquement", "Surveillance concurrentielle", "Mise à jour régulière", "Export structuré", "Scalabilité"],
    process: [
      { step: 1, title: "Analyse des besoins", description: "Identification des sources de données et des informations à extraire." },
      { step: 2, title: "Conception du scraper", description: "Développement du script d'extraction adapté aux sources cibles." },
      { step: 3, title: "Tests & Validation", description: "Tests d'extraction et validation de la qualité des données." },
      { step: 4, title: "Automatisation", description: "Mise en place de l'exécution planifiée et du monitoring." },
      { step: 5, title: "Export des données", description: "Livraison des données dans le format souhaité (CSV, JSON, API)." },
    ],
    faqs: [
      { question: "Le data scraping est-il légal ?", answer: "Oui, tant qu'il respecte les conditions d'utilisation des sites et les lois sur la protection des données. Nous nous assurons que toutes nos solutions sont conformes." },
    ],
    startingPrice: 5000, currency: "MAD", ctaText: "Extraire des données",
    outcome: "Des données structurées collectées automatiquement",
    keywords: ["data scraping", "extraction données", "web scraping", "collecte données"],
    seoTitle: "Data Scraping | Extraction de Données Automatisée | Weblancia",
    seoDescription: "Solutions de data scraping par Weblancia. Extraction automatisée de données web pour votre veille concurrentielle et analyse marché.",
    difficulty: "Avancé", deliveryDays: 15, readingTime: 7,
    relatedServices: ["api-integration", "workflow-automation"],
  },

  "workflow-automation": {
    fullDescription: "Automatisez vos processus métier pour gagner du temps et réduire les erreurs. Nous créons des workflows automatisés qui connectent vos outils, déclenchent des actions et simplifient vos opérations quotidiennes.",
    technologies: ["n8n", "Zapier", "Make", "Node.js", "Python", "Docker"],
    industries: ["Tous secteurs", "PME", "Services", "E-commerce", "Finance"],
    benefits: ["Processus automatisés", "Gain de temps significatif", "Réduction des erreurs", "Traçabilité complète", "Évolutivité", "ROI rapide"],
    faqs: [
      { question: "Quels processus peuvent être automatisés ?", answer: "Presque tous : facturation, emails, gestion des leads, reporting, synchronisation CRM, publication réseaux sociaux, et bien plus." },
    ],
    startingPrice: 5000, currency: "MAD", ctaText: "Automatiser mes processus",
    outcome: "Des processus métier automatisés qui vous font gagner du temps",
    keywords: ["automatisation", "workflow", "automatisation processus", "zapier", "n8n"],
    seoTitle: "Automatisation de Processus | Workflow Automation | Weblancia",
    seoDescription: "Automatisation de processus métier par Weblancia. Workflows, intégrations et optimisation des opérations.",
    difficulty: "Intermédiaire", deliveryDays: 20, readingTime: 8,
    relatedServices: ["api-integration", "crm-erp", "data-scraping"],
  },

  "crm-erp": {
    fullDescription: "CRM et ERP sur mesure pour centraliser et optimiser la gestion de votre entreprise. Nous développons des solutions personnalisées de gestion de la relation client et de planification des ressources d'entreprise, adaptées à vos processus spécifiques.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Docker", "Redis"],
    industries: ["PME", "Services", "E-commerce", "Finance", "Logistique"],
    benefits: ["Gestion centralisée", "Suivi client 360°", "Processus automatisés", "Reporting personnalisé", "Multi-utilisateurs", "Sécurité des données"],
    process: [
      { step: 1, title: "Analyse des processus", description: "Compréhension de vos flux de travail." },
      { step: 2, title: "Modélisation des données", description: "Conception de la structure de données." },
      { step: 3, title: "Développement", description: "Création des modules CRM/ERP." },
      { step: 4, title: "Intégrations", description: "Connexion avec vos outils existants." },
      { step: 5, title: "Tests & Formation", description: "Tests utilisateur et formation." },
      { step: 6, title: "Déploiement & Support", description: "Mise en production et accompagnement." },
    ],
    faqs: [
      { question: "CRM ou ERP : quelle différence ?", answer: "Le CRM gère la relation client (ventes, marketing, support), tandis que l'ERP gère les ressources de l'entreprise (finance, stocks, RH)." },
    ],
    startingPrice: 30000, currency: "MAD", ctaText: "Créer mon CRM/ERP",
    outcome: "Un CRM/ERP sur mesure qui centralise et optimise votre gestion",
    keywords: ["crm", "erp", "logiciel crm", "logiciel erp", "gestion entreprise"],
    seoTitle: "Développement CRM & ERP Sur Mesure | Weblancia",
    seoDescription: "CRM et ERP sur mesure par Weblancia. Solutions personnalisées de gestion client et d'entreprise adaptées à vos besoins.",
    difficulty: "Expert", deliveryDays: 90, readingTime: 11,
    relatedServices: ["api-integration", "workflow-automation", "web-applications"],
  },

  "booking-systems-marketplace": {
    fullDescription: "Systèmes de réservation et plateformes marketplace sur mesure. Nous développons des solutions de booking pour les services, locations et rendez-vous, ainsi que des marketplaces multi-vendeurs complètes.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Stripe", "Docker"],
    industries: ["Services", "Tourisme", "Restauration", "Santé", "Location", "Événementiel"],
    benefits: ["Réservation en ligne 24/7", "Calendrier synchronisé", "Paiements sécurisés", "Notifications automatiques", "Gestion des créneaux", "Dashboard administrateur"],
    process: [
      { step: 1, title: "Analyse fonctionnelle", description: "Définition des règles de réservation." },
      { step: 2, title: "Architecture", description: "Conception du système de réservation." },
      { step: 3, title: "Interface utilisateur", description: "Création de l'interface de réservation." },
      { step: 4, title: "Paiements & Notifications", description: "Intégration des paiements et emails." },
      { step: 5, title: "Dashboard", description: "Panneau d'administration des réservations." },
      { step: 6, title: "Tests & Déploiement", description: "Tests complets et mise en production." },
    ],
    faqs: [
      { question: "Quel type de système de réservation développez-vous ?", answer: "Nous développons tous types de systèmes : réservation de rendez-vous, location de biens, réservation de services, et marketplaces multi-vendeurs." },
    ],
    startingPrice: 25000, currency: "MAD", ctaText: "Créer mon système de réservation",
    outcome: "Un système de réservation en ligne qui simplifie vos opérations",
    keywords: ["système réservation", "booking system", "marketplace", "réservation en ligne", "booking"],
    seoTitle: "Systèmes de Réservation & Marketplace Sur Mesure | Weblancia",
    seoDescription: "Développement de systèmes de réservation et plateformes marketplace par Weblancia. Booking, calendrier, paiements.",
    difficulty: "Expert", deliveryDays: 60, readingTime: 10,
    relatedServices: ["web-applications", "api-integration", "crm-erp"],
  },

  // ── AUDIT ── (services 36-39)

  "website-audit": {
    fullDescription: "Audit complet de votre site web pour identifier les axes d'amélioration. Nous analysons la performance, le SEO, la sécurité, l'accessibilité et l'expérience utilisateur pour vous fournir un rapport détaillé avec des recommandations priorisées.",
    technologies: ["Lighthouse", "PageSpeed Insights", "Screaming Frog", "WAVE", "GTmetrix", "WebPageTest"],
    industries: ["Tous secteurs"],
    benefits: ["Rapport complet et détaillé", "Recommandations priorisées", "Analyse concurrentielle", "Benchmark sectoriel", "Plan d'action clair", "Suivi des corrections"],
    process: [
      { step: 1, title: "Analyse technique", description: "Audit de la structure technique et du code." },
      { step: 2, title: "Performance", description: "Analyse des temps de chargement et Core Web Vitals." },
      { step: 3, title: "SEO & Contenu", description: "Évaluation du référencement et de la qualité du contenu." },
      { step: 4, title: "Sécurité", description: "Vérification des failles et bonnes pratiques." },
      { step: 5, title: "UX & Accessibilité", description: "Analyse de l'expérience utilisateur et accessibilité." },
      { step: 6, title: "Rapport & Recommandations", description: "Rapport détaillé avec plan d'action priorisé." },
    ],
    faqs: [
      { question: "Que contient un audit de site web ?", answer: "Notre audit couvre : performance (Core Web Vitals), SEO (technique et on-page), sécurité, accessibilité, expérience utilisateur et benchmark concurrentiel." },
      { question: "Combien coûte un audit ?", answer: "Un audit standard coûte à partir de 3 000 MAD. Un audit complet avec benchmark concurrentiel est à partir de 5 000 MAD." },
    ],
    startingPrice: 3000, currency: "MAD", ctaText: "Auditer mon site",
    outcome: "Un diagnostic complet avec un plan d'action priorisé",
    keywords: ["audit site web", "audit site internet", "analyse site web", "diagnostic site"],
    seoTitle: "Audit de Site Web Complet | Performance, SEO, Sécurité | Weblancia",
    seoDescription: "Audit de site web professionnel par Weblancia. Performance, SEO, sécurité, accessibilité et UX. Rapport détaillé avec recommandations.",
    difficulty: "Intermédiaire", deliveryDays: 7, readingTime: 8,
    relatedServices: ["seo-audit", "security-audit", "performance-audit", "technical-seo"],
  },

  "seo-audit": {
    fullDescription: "Audit SEO approfondi pour identifier les freins à votre visibilité sur Google. Nous analysons tous les aspects de votre référencement : technique, sémantique, popularité et concurrence. Un rapport complet avec des recommandations actionnables.",
    technologies: ["SEMrush", "Ahrefs", "Screaming Frog", "Google Search Console", "Google Analytics", "Moz"],
    industries: ["Tous secteurs"],
    benefits: ["Analyse complète du SEO", "Mots-clés à fort potentiel", "Analyse concurrentielle", "Problèmes techniques identifiés", "Recommandations priorisées", "Plan d'action SEO"],
    process: [
      { step: 1, title: "Analyse technique SEO", description: "Crawling, indexation et structure du site." },
      { step: 2, title: "Analyse sémantique", description: "Mots-clés, contenu et maillage interne." },
      { step: 3, title: "Analyse concurrentielle", description: "Benchmark SEO de vos concurrents." },
      { step: 4, title: "Analyse des backlinks", description: "Profil de liens et opportunités." },
      { step: 5, title: "Rapport détaillé", description: "Synthèse des problèmes et recommandations." },
      { step: 6, title: "Plan d'action", description: "Priorisation des actions SEO." },
    ],
    faqs: [
      { question: "Quand faire un audit SEO ?", answer: "Avant de lancer une stratégie SEO, après une baisse de trafic, avant une refonte de site, ou régulièrement (tous les 6 mois) pour un suivi optimal." },
    ],
    startingPrice: 4000, currency: "MAD", ctaText: "Auditer mon SEO",
    outcome: "Un diagnostic SEO complet avec les actions prioritaires",
    keywords: ["audit seo", "audit référencement", "analyse seo", "diagnostic seo"],
    seoTitle: "Audit SEO Complet | Diagnostic Référencement Google | Weblancia",
    seoDescription: "Audit SEO professionnel par Weblancia. Analyse technique, sémantique et concurrentielle. Rapport détaillé avec recommandations priorisées.",
    difficulty: "Avancé", deliveryDays: 7, readingTime: 9,
    relatedServices: ["website-audit", "technical-seo", "seo", "performance-audit"],
  },

  "security-audit": {
    fullDescription: "Audit de sécurité complet pour identifier les vulnérabilités de votre site web ou application. Nous testons la robustesse de votre infrastructure, de votre code et de vos configurations pour garantir la protection de vos données et de celles de vos utilisateurs.",
    technologies: ["Nmap", "Burp Suite", "OWASP ZAP", "SSL Labs", "WPScan", "Nessus"],
    industries: ["E-commerce", "Finance", "Santé", "SaaS", "Tous secteurs"],
    benefits: ["Vulnérabilités identifiées", "Tests de pénétration", "Analyse OWASP Top 10", "Rapport de sécurité détaillé", "Recommandations correctives", "Plan de remédiation"],
    process: [
      { step: 1, title: "Reconnaissance", description: "Identification des actifs et de la surface d'attaque." },
      { step: 2, title: "Scan de vulnérabilités", description: "Scan automatisé des failles de sécurité." },
      { step: 3, title: "Tests d'intrusion", description: "Tests manuels de pénétration ciblés." },
      { step: 4, title: "Analyse des risques", description: "Évaluation de la criticité des vulnérabilités." },
      { step: 5, title: "Rapport détaillé", description: "Documentation complète des résultats." },
      { step: 6, title: "Plan de remédiation", description: "Recommandations priorisées par niveau de risque." },
    ],
    faqs: [
      { question: "À quelle fréquence faire un audit de sécurité ?", answer: "Nous recommandons un audit de sécurité complet tous les 6 à 12 mois, et après chaque modification majeure de votre infrastructure." },
      { question: "Que couvre l'audit de sécurité ?", answer: "L'audit couvre : les vulnérabilités OWASP Top 10, la configuration serveur, les certificats SSL/TLS, les injections SQL/XSS, et les tests d'intrusion." },
    ],
    startingPrice: 5000, currency: "MAD", ctaText: "Sécuriser mon site",
    outcome: "Un site web sécurisé et conforme aux meilleures pratiques",
    keywords: ["audit sécurité", "sécurité site web", "test intrusion", "cybersécurité", "vulnérabilités"],
    seoTitle: "Audit de Sécurité Web | Tests d'Intrusion | Weblancia",
    seoDescription: "Audit de sécurité professionnel par Weblancia. Tests d'intrusion, analyse de vulnérabilités et plan de remédiation.",
    difficulty: "Expert", deliveryDays: 10, readingTime: 9,
    relatedServices: ["website-audit", "performance-audit", "website-maintenance"],
  },

  "performance-audit": {
    fullDescription: "Audit de performance pour optimiser la vitesse et l'expérience utilisateur de votre site web. Nous analysons les Core Web Vitals, le temps de chargement, l'optimisation mobile et les goulots d'étranglement de votre infrastructure.",
    technologies: ["Lighthouse", "PageSpeed Insights", "WebPageTest", "GTmetrix", "Chrome DevTools", "K6"],
    industries: ["Tous secteurs"],
    benefits: ["Core Web Vitals optimisés", "Temps de chargement réduit", "Experience mobile améliorée", "Score Lighthouse augmenté", "Recommandations techniques", "Gain de conversion"],
    process: [
      { step: 1, title: "Analyse des performances", description: "Mesure des métriques clés (LCP, FID, CLS)." },
      { step: 2, title: "Audit des ressources", description: "Analyse des images, scripts et styles." },
      { step: 3, title: "Optimisation serveur", description: "Cache, CDN et configuration serveur." },
      { step: 4, title: "Optimisation front-end", description: "Minification, lazy loading et code splitting." },
      { step: 5, title: "Tests & Validation", description: "Tests sur différents appareils et réseaux." },
      { step: 6, title: "Rapport & Suivi", description: "Rapport détaillé et monitoring continu." },
    ],
    faqs: [
      { question: "Pourquoi la performance est-elle importante ?", answer: "Un site lent fait fuir les visiteurs : 53% des mobinautes quittent un site qui met plus de 3 secondes à charger. Google pénalise aussi les sites lents dans son classement." },
      { question: "Quels sont les Core Web Vitals ?", answer: "LCP ( Largest Contentful Paint - chargement), FID (First Input Delay - interactivité), CLS (Cumulative Layout Shift - stabilité visuelle)." },
    ],
    startingPrice: 3000, currency: "MAD", ctaText: "Optimiser ma performance",
    outcome: "Un site rapide qui offre une expérience utilisateur optimale",
    keywords: ["audit performance", "optimisation vitesse", "core web vitals", "page speed", "performance site web"],
    seoTitle: "Audit de Performance Web | Optimisation Vitesse | Weblancia",
    seoDescription: "Audit de performance web par Weblancia. Core Web Vitals, optimisation vitesse, PageSpeed, Lighthouse et expérience mobile.",
    difficulty: "Avancé", deliveryDays: 7, readingTime: 8,
    relatedServices: ["website-audit", "seo-audit", "technical-seo"],
  },
}

// ─── Blog Categories ─────────────────────────────────────────────

const blogCategoryDefs: { slug: string; title: string; description: string }[] = [
  { slug: "web-development", title: "Développement Web", description: "Articles sur le développement de sites web et applications" },
  { slug: "digital-marketing", title: "Marketing Digital", description: "Marketing digital, SEO et publicité en ligne" },
  { slug: "branding-design", title: "Branding & Design", description: "Design graphique, UI/UX et identité de marque" },
  { slug: "consulting", title: "Consulting", description: "Conseil et stratégie digitale" },
  { slug: "technology", title: "Technologie", description: "Technologies web, frameworks et outils" },
  { slug: "maintenance-support", title: "Maintenance & Support", description: "Maintenance, hébergement et sécurité" },
  { slug: "automation", title: "Automatisation", description: "Automatisation, API et intégrations" },
  { slug: "audit", title: "Audit", description: "Audit, performance et sécurité" },
]

// ─── Article Content Generators ──────────────────────────────────

interface ArticleDef {
  title: string; slug: string; excerpt: string; categorySlug: string;
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  keywords: string[]; readingTime: number;
  serviceSlugs: string[];
}

function generateArticles(serviceSlug: string): ArticleDef[] {
  const service = serviceContent[serviceSlug]
  if (!service) return []
  const catSlug = getCategorySlug(serviceSlug)
  const title = service.seoTitle.split("|")[0].trim() || serviceContent[serviceSlug]?.seoTitle?.split("|")[0]?.trim() || ""
  const kw = service.keywords

  const guides: ArticleDef[] = [
    {
      title: `Guide Complet ${title}`,
      slug: `guide-${serviceSlug}`,
      excerpt: `Découvrez tout ce qu'il faut savoir sur ${title.toLowerCase()} : définition, avantages, processus, budget et bonnes pratiques pour réussir votre projet.`,
      categorySlug: catSlug,
      sections: [
        { heading: `Qu'est-ce que ${title} ?`, body: `Le ${title.toLowerCase()} est une solution essentielle pour les entreprises qui souhaitent se développer dans l'écosystème digital. Cette prestation permet aux organisations de bénéficier d'une expertise professionnelle pour atteindre leurs objectifs. Dans un monde où le digital est au cœur des stratégies d'entreprise, comprendre les fondamentaux de cette discipline est crucial pour rester compétitif.\n\nQue vous soyez une PME, une startup ou une grande entreprise, les principes restent les mêmes : qualité, performance et résultats mesurables. Notre équipe chez Weblancia vous accompagne à chaque étape pour garantir le succès de votre projet.` },
        { heading: "Avantages et Bénéfices", body: `Les avantages de ${title.toLowerCase()} sont nombreux et impactent directement la performance de votre entreprise. Voici les principaux bénéfices que vous pouvez attendre :\n\n${service.benefits.map(b => `• ${b}`).join('\n')}\n\nCes bénéfices se traduisent par des résultats concrets : une meilleure visibilité en ligne, un retour sur investissement mesurable, et une satisfaction client accrue.` },
        {         heading: "Comment ça fonctionne ?", body: `Notre processus pour ${title.toLowerCase()} est structuré en plusieurs étapes clés, chacune apportant une valeur ajoutée spécifique à votre projet. Nous suivons une méthodologie éprouvée qui garantit des résultats optimaux.\n\n${(service.process||[]).sort((a, b) => a.step - b.step).map(p => `**Étape ${p.step} : ${p.title}**\n${p.description}\n`).join('\n')}\n\nCette approche méthodique nous permet de livrer des solutions de haute qualité, dans les délais impartis et en respectant votre budget.` },
        { heading: `Budget et Investissement`, body: `L'investissement pour ${title.toLowerCase()} varie selon plusieurs facteurs : la complexité du projet, les fonctionnalités souhaitées, le périmètre des prestations et les délais. Chez Weblancia, nous proposons des solutions adaptées à tous les budgets avec un rapport qualité-prix optimal.\n\nLe prix de départ pour ce service est de ${service.startingPrice} ${service.currency}. Ce tarif inclut les prestations de base et peut évoluer en fonction de vos besoins spécifiques. Nous vous accompagnons dans la définition du périmètre pour optimiser votre budget.` },
        { heading: "Technologies Utilisées", body: `Pour deliver des prestations de qualité, nous utilisons les technologies les plus adaptées à chaque projet :\n\n${service.technologies.map(t => `• ${t}`).join('\n')}\n\nNotre équipe technique maîtrise ces outils et frameworks pour garantir des solutions performantes, sécurisées et évolutives.` },
        { heading: "Pourquoi Choisir Weblancia ?", body: `Weblancia est une agence digitale premium basée à Casablanca, spécialisée dans l'accompagnement des entreprises ambitieuses. Notre expertise couvre l'ensemble du spectre digital, du développement web au marketing en passant par le branding et le conseil.\n\nNous nous distinguons par :\n• Une équipe d'experts passionnés\n• Une méthodologie agile et transparente\n• Un accompagnement personnalisé\n• Des résultats mesurables\n• Un support continu après livraison\n\nFaites confiance à Weblancia pour donner vie à vos projets digitaux.` },
      ],
      faqs: service.faqs.slice(0, 5).map(f => ({ question: f.question, answer: f.answer })),
      keywords: kw, readingTime: service.readingTime, serviceSlugs: [serviceSlug, ...service.relatedServices],
    },
    {
      title: `${title} : Tout ce que vous devez savoir`,
      slug: `tout-savoir-sur-${serviceSlug}`,
      excerpt: `Un guide détaillé pour comprendre les enjeux, les bonnes pratiques et les tendances actuelles du ${title.toLowerCase()}. Idéal pour les décideurs et porteurs de projets.`,
      categorySlug: catSlug,
      sections: [
        { heading: "Introduction", body: `Le ${title.toLowerCase()} est devenu un élément incontournable de la stratégie digitale des entreprises modernes. Dans un environnement concurrentiel de plus en plus exigeant, il est essentiel de maîtriser les codes et les bonnes pratiques pour se démarquer.\n\nCe guide vous apporte toutes les clés pour comprendre, planifier et réussir votre projet. Que vous soyez débutant ou expérimenté, vous trouverez ici des informations précieuses pour avancer.` },
        { heading: "Les Fondamentaux", body: `Avant de se lancer dans un projet de ${title.toLowerCase()}, il est important de maîtriser les fondamentaux. Voici les concepts clés à connaître :\n\n• La définition précise de vos objectifs\n• L'identification de votre audience cible\n• Le choix des bonnes stratégies et outils\n• La mesure des résultats et l'optimisation continue\n\nCes bases vous permettront de construire un projet solide et cohérent avec vos ambitions.` },
        { heading: "Bonnes Pratiques", body: `Pour maximiser vos chances de succès, voici les bonnes pratiques recommandées par nos experts :\n\n• Définir des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis)\n• Investir dans la qualité dès le départ\n• Tester et itérer régulièrement\n• Mesurer les performances avec des KPIs pertinents\n• S'adapter aux évolutions du marché\n\nCes bonnes pratiques sont le fruit de notre expérience auprès de nombreuses entreprises de tous secteurs.` },
        { heading: "Erreurs à Éviter", body: `Dans votre projet de ${title.toLowerCase()}, certaines erreurs peuvent compromettre vos résultats. Voici les pièges les plus courants à éviter :\n\n1. Négliger la phase de planification\n2. Sous-estimer l'importance de la qualité\n3. Ignorer les retours utilisateurs\n4. Choisir les mauvaises technologies\n5. Négliger la maintenance et le suivi\n\nNotre équipe vous aide à éviter ces écueils grâce à son expertise et son accompagnement personnalisé.` },
      ],
      faqs: service.faqs.slice(3, 8).map(f => ({ question: f.question, answer: f.answer })),
      keywords: kw, readingTime: service.readingTime, serviceSlugs: [serviceSlug, ...service.relatedServices],
    },
    {
      title: `Comment choisir son agence de ${title.toLowerCase()} ?`,
      slug: `choisir-agence-${serviceSlug}`,
      excerpt: `Les critères essentiels pour sélectionner la meilleure agence de ${title.toLowerCase()} pour votre projet. Conseils d'expert et questions à poser avant de signer.`,
      categorySlug: catSlug,
      sections: [
        { heading: "Les Critères de Sélection", body: `Choisir la bonne agence pour votre projet de ${title.toLowerCase()} est une décision stratégique. Voici les critères essentiels à évaluer :\n\n1. **L'expertise technique** : L'agence maîtrise-t-elle les technologies et méthodologies adaptées à votre projet ?\n2. **Le portfolio** : A-t-elle déjà réalisé des projets similaires au vôtre ?\n3. **Les références clients** : Que disent ses clients précédents ?\n4. **La méthodologie** : Comment l'agence gère-t-elle ses projets ?\n5. **Le rapport qualité-prix** : Les tarifs sont-ils en adéquation avec les prestations proposées ?\n\nCes critères vous aideront à faire un choix éclairé et à trouver le partenaire idéal pour votre projet.` },
        { heading: "Questions à Poser", body: `Avant de choisir votre agence, posez ces questions essentielles :\n\n• Quelle est votre expérience dans mon secteur d'activité ?\n• Quels sont les délais typiques pour ce type de projet ?\n• Comment gérez-vous les imprévus et les changements ?\n• Proposez-vous un support après la livraison ?\n• Quels sont les indicateurs de succès du projet ?\n\nChez Weblancia, nous répondons à toutes ces questions avec transparence et honnêteté.` },
        { heading: "Pourquoi Weblancia ?", body: `Depuis notre création à Casablanca, Weblancia s'est imposée comme une référence dans le domaine du ${title.toLowerCase()}. Notre approche combine expertise technique, créativité et rigueur méthodologique pour deliver des projets d'exception.\n\nNous accompagnons chaque client avec une équipe dédiée, des processus transparents et un engagement fort sur la qualité et les résultats.` },
      ],
      faqs: service.faqs.slice(5, 10).map(f => ({ question: f.question, answer: f.answer })),
      keywords: kw, readingTime: Math.max(5, service.readingTime - 2), serviceSlugs: [serviceSlug, ...service.relatedServices],
    },
    {
      title: `Guide du Budget pour ${title}`,
      slug: `budget-${serviceSlug}`,
      excerpt: `Combien coûte un projet de ${title.toLowerCase()} ? Découvrez les fourchettes de prix, les facteurs qui influencent le coût et comment optimiser votre budget.`,
      categorySlug: catSlug,
      sections: [
        { heading: "Fourchettes de Prix", body: `Le budget pour un projet de ${title.toLowerCase()} varie considérablement selon plusieurs facteurs. Chez Weblancia, nous proposons des solutions à partir de ${service.startingPrice} ${service.currency}.\n\nLes principaux facteurs qui influencent le prix :\n• La complexité du projet\n• Les fonctionnalités souhaitées\n• Le périmètre des prestations\n• Les délais de réalisation\n• Les technologies utilisées\n\nNous vous accompagnons dans la définition du périmètre optimal pour votre budget.` },
        { heading: "Optimiser son Budget", body: `Pour optimiser votre budget sans compromettre la qualité :\n\n1. Définissez clairement vos priorités\n2. Commencez par un MVP (Minimum Viable Product)\n3. Planifiez des phases d'évolution\n4. Choisissez les bonnes technologies\n5. Investissez dans la qualité dès le départ\n\nNotre équipe vous conseille sur les meilleures options pour maximiser votre retour sur investissement.` },
      ],
      faqs: service.faqs.filter(f => f.question.toLowerCase().includes("prix") || f.question.toLowerCase().includes("coût") || f.question.toLowerCase().includes("budget")).slice(0, 5),
      keywords: kw, readingTime: Math.max(4, service.readingTime - 3), serviceSlugs: [serviceSlug],
    },
    {
      title: `Guide du Processus de ${title}`,
      slug: `processus-${serviceSlug}`,
      excerpt: `Comprenez les étapes clés d'un projet de ${title.toLowerCase()} : de la conception à la livraison, en passant par le développement et les tests.`,
      categorySlug: catSlug,
      sections: [
        { heading: "Les Étapes Clés", body: `Un projet de ${title.toLowerCase()} se déroule en plusieurs étapes structurées :\n\n${(service.process||[]).sort((a, b) => a.step - b.step).map(p => `**${p.title}**\n${p.description}`).join('\n\n')}\n\nCette méthodologie éprouvée garantit la qualité et la réussite de votre projet.` },
        { heading: "Durée du Projet", body: `La durée d'un projet de ${title.toLowerCase()} dépend de sa complexité. En moyenne, comptez ${service.deliveryDays} jours pour un projet standard. Les facteurs qui peuvent influencer la durée :\n\n• Le périmètre fonctionnel\n• Le nombre d'allers-retours de validation\n• Les intégrations tierces\n• La qualité des données initiales\n\nNous vous fournissons un calendrier précis dès la phase de cadrage.` },
      ],
      faqs: service.faqs.filter(f => f.question.toLowerCase().includes("délai") || f.question.toLowerCase().includes("temps") || f.question.toLowerCase().includes("processus") || f.question.toLowerCase().includes("étape")).slice(0, 4),
      keywords: kw, readingTime: Math.max(5, service.readingTime - 2), serviceSlugs: [serviceSlug],
    },
  ]

  // Add industry-specific articles
  const industryArticles: ArticleDef[] = [
    {
      title: `${title} pour les ${service.industries[0] || "Entreprises"}`,
      slug: `${serviceSlug}-${(service.industries[0] || "entreprises").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, "-")}`,
      excerpt: `Découvrez comment le ${title.toLowerCase()} peut bénéficier aux ${service.industries[0]?.toLowerCase() || "entreprises"}. Solutions adaptées, cas concrets et témoignages.`,
      categorySlug: catSlug,
      sections: [
        { heading: `Pourquoi le ${title} est crucial pour les ${service.industries[0] || "Entreprises"}`, body: `Dans le secteur des ${(service.industries[0] || "entreprises").toLowerCase()}, le ${title.toLowerCase()} joue un rôle stratégique. Les entreprises qui investissent dans cette solution constatent des améliorations significatives de leur performance et de leur compétitivité.\n\nLes défis spécifiques à ce secteur nécessitent une approche adaptée et des solutions sur mesure. Chez Weblancia, nous avons accompagné de nombreuses entreprises de ce secteur avec des résultats probants.` },
        { heading: "Cas Concrets", body: `Nous avons réalisé de nombreux projets de ${title.toLowerCase()} pour des entreprises du secteur ${(service.industries[0] || "des entreprises").toLowerCase()}. Ces projets nous ont permis de développer une expertise pointue et de comprendre les enjeux spécifiques de ce marché.\n\nChaque projet est unique, mais certains enseignements sont universels : l'importance de la qualité, la nécessité d'une approche structurée, et la valeur d'un accompagnement expert.` },
      ],
      faqs: service.faqs.slice(0, 3),
      keywords: [...kw, service.industries[0]?.toLowerCase() || ""].filter(Boolean),
      readingTime: Math.max(5, service.readingTime - 1), serviceSlugs: [serviceSlug],
    },
    {
      title: `Tendances et Innovations en ${title}`,
      slug: `tendances-${serviceSlug}`,
      excerpt: `Les dernières tendances et innovations dans le domaine du ${title.toLowerCase()}. Restez à la pointe de votre secteur avec notre veille technologique et stratégique.`,
      categorySlug: catSlug,
      sections: [
        { heading: "Les Tendances Actuelles", body: `Le domaine du ${title.toLowerCase()} évolue constamment. Voici les tendances qui façonnent l'industrie en 2026 :\n\n• L'intelligence artificielle et l'automatisation\n• La personnalisation à grande échelle\n• L'omnicanalité et l'expérience unifiée\n• La durabilité et l'éco-responsabilité\n• La data-driven decision making\n\nCes tendances transforment la façon dont les entreprises abordent leurs projets digitaux.` },
        { heading: "Se Préparer pour Demain", body: `Pour rester compétitif, il est essentiel d'anticiper les évolutions du marché. Nous vous aidons à préparer votre stratégie future en intégrant les innovations pertinentes pour votre activité.` },
      ],
      faqs: service.faqs.slice(4, 7),
      keywords: [...kw, "tendances", "innovations", "2026"],
      readingTime: Math.max(4, service.readingTime - 3), serviceSlugs: [serviceSlug],
    },
  ]

  return [...guides, ...industryArticles]
}

function getCategorySlug(serviceSlug: string): string {
  const catMap: Record<string, string> = {
    "corporate-websites": "web-development",
    "landing-pages": "web-development",
    "ecommerce": "web-development",
    "web-applications": "web-development",
    "mobile-apps": "web-development",
    "custom-software": "web-development",
    "seo": "digital-marketing",
    "local-seo": "digital-marketing",
    "technical-seo": "digital-marketing",
    "google-ads": "digital-marketing",
    "meta-ads": "digital-marketing",
    "community-management": "digital-marketing",
    "brand-identity": "branding-design",
    "logo-design": "branding-design",
    "ui-ux-design": "branding-design",
    "startup-consulting": "consulting",
    "business-consulting": "consulting",
    "technical-consulting": "consulting",
    "strategy-consulting": "consulting",
    "laravel": "technology",
    "react-nextjs": "technology",
    "wordpress": "technology",
    "flutter": "technology",
    "javascript-typescript": "technology",
    "website-maintenance": "maintenance-support",
    "hosting": "maintenance-support",
    "professional-emails": "maintenance-support",
    "website-migration": "maintenance-support",
    "api-integration": "automation",
    "data-scraping": "automation",
    "workflow-automation": "automation",
    "crm-erp": "automation",
    "booking-systems-marketplace": "automation",
    "website-audit": "audit",
    "seo-audit": "audit",
    "security-audit": "audit",
    "performance-audit": "audit",
  }
  return catMap[serviceSlug] || "web-development"
}

function articleBody(sections: { heading: string; body: string }[]): string {
  return sections.map(s => `## ${s.heading}\n\n${s.body}`).join("\n\n")
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("=== Content Population Script ===\n")

  // 1. Load existing data
  const services = await db.service.findMany({ include: { category: true } })
  const serviceIndex: Record<string, typeof services[0]> = {}
  for (const s of services) serviceIndex[s.slug] = s

  console.log(`Found ${services.length} existing services`)

  // 2. Create blog categories for service categories
  console.log("\n--- Creating Blog Categories ---")
  const blogCatMap: Record<string, number> = {}
  for (const cat of blogCategoryDefs) {
    let existing = await db.blogCategory.findUnique({ where: { slug: cat.slug } })
    if (!existing) {
      existing = await db.blogCategory.create({ data: cat })
      console.log(`  Created blog category: "${cat.title}"`)
    } else {
      console.log(`  Blog category exists: "${cat.title}"`)
    }
    blogCatMap[cat.slug] = existing.id
  }

  // 3. Update ALL services with comprehensive content
  console.log("\n--- Updating Services with Full Content ---")

  // First, delete existing FAQ entries (we'll recreate them)
  await db.fAQ.deleteMany({})
  console.log("  Cleared existing FAQ entries")

  for (const service of services) {
    const content = serviceContent[service.slug]
    if (!content) {
      console.log(`  SKIP (no content def): ${service.slug}`)
      continue
    }

    try {
      await db.service.update({
        where: { id: service.id },
        data: {
          fullDescription: content.fullDescription,
          benefits: content.benefits,
          deliverables: service.deliverables,
          process: content.process,
          faqs: content.faqs,
          technologies: content.technologies,
          startingPrice: content.startingPrice,
          currency: content.currency,
          ctaText: content.ctaText,
          outcome: content.outcome,
          relatedServices: content.relatedServices,
          isActive: true,
          isFeatured: false,
        },
      })
      console.log(`  UPDATED: ${service.title} (${service.slug})`)
    } catch (err) {
      console.error(`  FAILED: ${service.slug} - ${err}`)
    }
  }

  // 4. Create standalone FAQs
  console.log("\n--- Creating Standalone FAQs ---")

  let totalFaqs = 0
  for (const service of services) {
    const content = serviceContent[service.slug]
    if (!content || !content.faqs) continue

    const catSlug = getCategorySlug(service.slug)
    for (let i = 0; i < content.faqs.length; i++) {
      const f = content.faqs[i]
      try {
        await db.fAQ.create({
          data: {
            question: f.question,
            answer: f.answer,
            category: catSlug,
            displayOrder: i,
            isActive: true,
          },
        })
        totalFaqs++
      } catch (err) {
        // Skip duplicates or errors
      }
    }
  }
  console.log(`  Created ${totalFaqs} FAQs`)

  // 5. Create articles
  console.log("\n--- Creating Articles ---")

  let totalArticles = 0
  const existingPosts = await db.blogPost.findMany({ select: { slug: true } })
  const existingSlugs = new Set(existingPosts.map(p => p.slug))

  for (const service of services) {
    const articles = generateArticles(service.slug)
    const content = serviceContent[service.slug]
    if (!content) continue

    for (const article of articles) {
      if (existingSlugs.has(article.slug)) {
        console.log(`  SKIP (exists): ${article.slug}`)
        continue
      }

      const catId = blogCatMap[article.categorySlug]
      if (!catId) {
        console.log(`  SKIP (no category): ${article.slug}`)
        continue
      }

      try {
        const now = new Date()
        const pastDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)

        await db.blogPost.create({
          data: {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: articleBody(article.sections),
            categoryId: catId,
            author: "Weblancia",
            publishedAt: pastDate,
            isPublished: true,
            isFeatured: false,
            readingTime: article.readingTime,
            tags: article.keywords,
            focusKeyword: article.keywords[0] || "",
            canonicalUrl: `https://weblancia.ma/insights/${article.slug}`,
            ogTitle: article.title,
            ogDescription: article.excerpt,
            twitterCard: "summary_large_image",
          },
        })
        totalArticles++
        existingSlugs.add(article.slug)
        console.log(`  CREATED: ${article.title}`)
      } catch (err) {
        console.error(`  FAILED: ${article.slug} - ${err}`)
      }
    }
  }
  console.log(`\n  Created ${totalArticles} new articles`)

  // 6. Summary
  const finalServiceCount = await db.service.count({ where: { isActive: true } })
  const finalFaqCount = await db.fAQ.count({ where: { isActive: true } })
  const finalArticleCount = await db.blogPost.count({ where: { isPublished: true } })
  const finalCatCount = await db.serviceCategory.count()

  console.log("\n=== Content Population Complete ===")
  console.log(`Service Categories: ${finalCatCount}`)
  console.log(`Active Services: ${finalServiceCount}`)
  console.log(`Published Articles: ${finalArticleCount}`)
  console.log(`Active FAQs: ${finalFaqCount}`)
}

main()
  .catch((e) => {
    console.error("Content seed failed:", e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
