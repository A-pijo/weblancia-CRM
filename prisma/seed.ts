import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import bcrypt from "bcryptjs"

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST ?? "localhost",
  user: process.env.DATABASE_USER ?? "root",
  password: process.env.DATABASE_PASSWORD ?? "",
  database: process.env.DATABASE_NAME ?? "weblancia",
  port: Number(process.env.DATABASE_PORT ?? 3306),
  connectionLimit: 1,
})

const db = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // ── Team Members (always runs) ───────────────────────────

  const existingTeam = await db.teamMember.count()
  if (existingTeam > 0) {
    console.log("Team members already exist, skipping...")
  } else {
    const teamMembers = [
      { name: "Yassine El Khazouni", role: "Fondateur & CEO", bio: "Expert en transformation digitale avec plus de 8 ans d'expérience dans le conseil et le développement web.", image: "/images/team/yassine.jpg", linkedin: "https://linkedin.com", twitter: "https://twitter.com", displayOrder: 1, isActive: true },
      { name: "Sara Benali", role: "Directrice Marketing", bio: "Spécialiste en marketing digital et stratégies de croissance omnicanales.", image: "/images/team/sara.jpg", linkedin: "https://linkedin.com", displayOrder: 2, isActive: true },
      { name: "Omar Tazi", role: "Lead Developer", bio: "Développeur full-stack passionné par les architectures modernes et les performances web.", image: "/images/team/omar.jpg", linkedin: "https://linkedin.com", displayOrder: 3, isActive: true },
      { name: "Leila El Amrani", role: "Design Director", bio: "Designer UI/UX avec une passion pour les interfaces intuitives et les expériences utilisateur mémorables.", image: "/images/team/leila.jpg", displayOrder: 4, isActive: true },
      { name: "Khalid Idrissi", role: "Chef de Projet", bio: "Project manager certifié PMP avec une expertise en méthodologies agiles et delivery.", image: "/images/team/khalid.jpg", linkedin: "https://linkedin.com", displayOrder: 5, isActive: true },
    ]
    for (const m of teamMembers) {
      await db.teamMember.create({ data: m })
    }
    console.log(`Seeded ${teamMembers.length} team members`)
  }

  // ── FAQ (always runs) ──────────────────────────────────────

  const existingFAQ = await db.fAQ.count()
  if (existingFAQ > 0) {
    console.log("FAQs already exist, skipping...")
  } else {
    const faqs = [
      { question: "Quels sont vos tarifs ?", answer: "Nos tarifs varient en fonction de la complexité et de l'ampleur de chaque projet. Nous proposons des devis personnalisés après avoir compris vos besoins. Contactez-nous pour une estimation gratuite.", displayOrder: 1, isActive: true },
      { question: "Quels sont les délais de réalisation ?", answer: "Les délais dépendent du type de projet. Un site vitrine peut être livré en 2 à 4 semaines, tandis qu'un e-commerce ou une application sur mesure peut prendre 2 à 6 mois. Nous établissons un calendrier précis lors de notre première consultation.", displayOrder: 2, isActive: true },
      { question: "Comment se déroule notre collaboration ?", answer: "Notre processus commence par une consultation gratuite pour comprendre vos objectifs. Ensuite, nous élaborons une stratégie, concevons les maquettes, développons la solution, et assurons un suivi après livraison. Vous êtes impliqué à chaque étape.", displayOrder: 3, isActive: true },
      { question: "Proposez-vous un support après la livraison ?", answer: "Oui, nous offrons différentes formules de maintenance et de support pour garantir le bon fonctionnement de votre projet. Nous sommes disponibles pour toute évolution ou correction technique après la mise en ligne.", displayOrder: 4, isActive: true },
    ]
    for (const f of faqs) {
      await db.fAQ.create({ data: f })
    }
    console.log(`Seeded ${faqs.length} FAQs`)
  }

  const existingSuperAdmin = await db.role.findUnique({ where: { name: "SuperAdmin" } })
  if (!existingSuperAdmin) {
    await db.role.createMany({
      data: [
        { name: "SuperAdmin", description: "Full access to all features" },
        { name: "Admin", description: "Can manage all content, cannot manage SuperAdmin accounts" },
        { name: "Editor", description: "Can manage services, blog, portfolio, academy, testimonials, FAQ" },
      ],
    })

    const superAdminRole = await db.role.findUnique({ where: { name: "SuperAdmin" } })
    const password = await bcrypt.hash("ChangeMe123!", 12)
    await db.user.create({
      data: {
        email: "admin@weblancia.com",
        password,
        name: "Super Admin",
        roleId: superAdminRole!.id,
        isActive: true,
      },
    })
    console.log("Admin account created: admin@weblancia.com / ChangeMe123!")
  } else {
    console.log("Roles already exist, skipping...")
  }

  const existingCategories = await db.serviceCategory.findMany()
  if (existingCategories.length > 0) {
    console.log("Service categories already exist, skipping...")
    return
  }

  const categoryData: { slug: string; title: string; description: string; icon: string; services: { slug: string; title: string; description: string; icon: string; deliverables: string[]; outcome: string }[] }[] = [
    { slug: "web-development", title: "Web Development", description: "Sites web et applications sur mesure avec les technologies les plus modernes.", icon: "Code", services: [
      { slug: "corporate-websites", title: "Corporate Websites", description: "Sites vitrine professionnels avec design premium et CMS intuitif.", icon: "Monitor", deliverables: ["Site responsive", "CMS personnalisé", "Formulaire de contact", "Blog intégré", "Analytics", "SSL"], outcome: "Un site vitrine professionnel qui convertit" },
      { slug: "landing-pages", title: "Landing Pages", description: "Pages de conversion optimisées pour le taux de transformation.", icon: "Layout", deliverables: ["Design persuasif", "Copywriting pro", "Tests A/B", "Tracking analytics", "Intégration CRM"], outcome: "Une page optimisée pour la conversion" },
      { slug: "ecommerce", title: "E-commerce", description: "Boutiques en ligne complètes avec paiement sécurisé.", icon: "ShoppingCart", deliverables: ["Catalogue produits", "Panier d'achat", "Paiement sécurisé", "Gestion stocks", "Dashboard ventes"], outcome: "Une boutique en ligne performante" },
      { slug: "web-applications", title: "Web Applications", description: "Applications web sur mesure pour vos processus métier.", icon: "Globe", deliverables: ["App sur mesure", "Base de données", "API RESTful", "Interface admin", "Documentation"], outcome: "Une application web qui optimise vos processus" },
      { slug: "mobile-apps", title: "Mobile Apps", description: "Applications mobiles iOS et Android avec Flutter.", icon: "Smartphone", deliverables: ["App iOS/Android", "UI/UX mobile", "API backend", "Push notifications", "Store deployment"], outcome: "Une application mobile native performante" },
      { slug: "custom-software", title: "Custom Software", description: "Solutions logicielles sur mesure pour votre entreprise.", icon: "Terminal", deliverables: ["Analyse besoins", "Architecture", "Développement agile", "Tests QA", "Maintenance"], outcome: "Un logiciel sur mesure qui répond à vos besoins" },
    ]},
    { slug: "digital-marketing", title: "Digital Marketing", description: "Stratégies marketing digitales pour booster votre visibilité en ligne.", icon: "TrendingUp", services: [
      { slug: "seo", title: "SEO", description: "Optimisation pour les moteurs de recherche et augmentation du trafic organique.", icon: "Search", deliverables: ["Audit SEO complet", "Optimisation on-page", "Stratégie contenu", "Netlinking", "Suivi positions"], outcome: "Un trafic organique en croissance continue" },
      { slug: "local-seo", title: "Local SEO", description: "Référencement local pour attirer des clients dans votre zone géographique.", icon: "MapPin", deliverables: ["Google My Business", "Citations locales", "Avis clients", "Balises locales"], outcome: "Une visibilité locale maximale" },
      { slug: "technical-seo", title: "Technical SEO", description: "Optimisation technique approfondie pour les moteurs de recherche.", icon: "Settings", deliverables: ["Audit technique", "Core Web Vitals", "Données structurées", "Sitemaps/Robots"], outcome: "Un site techniquement irréprochable" },
      { slug: "google-ads", title: "Google Ads", description: "Campagnes publicitaires Google Ads pour un retour sur investissement mesurable.", icon: "Target", deliverables: ["Stratégie mots-clés", "Annonces texte/display", "Landing pages", "Tracking conversions", "Reporting"], outcome: "Des campagnes rentables et mesurables" },
      { slug: "meta-ads", title: "Meta Ads", description: "Publicités Facebook et Instagram ciblées pour votre audience.", icon: "Users", deliverables: ["Audience targeting", "Créatives publicitaires", "A/B testing", "Pixels", "Analytics"], outcome: "Une audience engagée et des conversions" },
      { slug: "community-management", title: "Community Management", description: "Gestion professionnelle de vos réseaux sociaux.", icon: "MessageCircle", deliverables: ["Calendrier éditorial", "Création contenu", "Modération", "Reporting mensuel"], outcome: "Une communauté engagée et fidèle" },
    ]},
    { slug: "branding-design", title: "Branding & Design", description: "Identité de marque forte et design qui marque les esprits.", icon: "Palette", services: [
      { slug: "brand-identity", title: "Brand Identity", description: "Création d'identité de marque complète et cohérente.", icon: "Feather", deliverables: ["Stratégie marque", "Logo", "Charte graphique", "Brand guidelines"], outcome: "Une identité de marque mémorable" },
      { slug: "logo-design", title: "Logo Design", description: "Création de logos uniques et mémorables.", icon: "Image", deliverables: ["Concepts logos", "Déclinaisons", "Version monochrome", "Fichiers sources"], outcome: "Un logo qui vous représente" },
      { slug: "ui-ux", title: "UI/UX Design", description: "Design d'interface et expérience utilisateur optimales.", icon: "Layers", deliverables: ["Wireframes", "Maquettes HD", "Prototype interactif", "Design system"], outcome: "Une expérience utilisateur exceptionnelle" },
    ]},
    { slug: "consulting", title: "Consulting", description: "Conseil stratégique pour accélérer votre transformation digitale.", icon: "Briefcase", services: [
      { slug: "startup-consulting", title: "Startup Consulting", description: "Accompagnement stratégique pour startups innovantes.", icon: "Rocket", deliverables: ["Stratégie produit", "Product-market fit", "Roadmap", "KPIs"], outcome: "Une startup structurée pour la croissance" },
      { slug: "business-consulting", title: "Business Consulting", description: "Conseil en stratégie d'entreprise et transformation digitale.", icon: "BarChart", deliverables: ["Audit stratégique", "Plan d'action", "Accompagnement", "Suivi"], outcome: "Une stratégie digitale claire et actionnable" },
      { slug: "technical-consulting", title: "Technical Consulting", description: "Conseil technique pour vos choix d'architecture et de technologies.", icon: "Cpu", deliverables: ["Audit technique", "Recommandations", "Architecture", "Feuille de route"], outcome: "Des choix techniques éclairés" },
      { slug: "strategy-consulting", title: "Strategy Consulting", description: "Conseil en stratégie digitale globale.", icon: "Compass", deliverables: ["Diagnostic", "Stratégie omnicanale", "Plan déploiement", "ROI"], outcome: "Une stratégie digitale cohérente" },
    ]},
    { slug: "technology", title: "Technology", description: "Expertise technique sur les technologies les plus performantes.", icon: "Cpu", services: [
      { slug: "laravel", title: "Laravel", description: "Développement d'applications robustes avec Laravel.", icon: "Code", deliverables: ["API RESTful", "Backend sur mesure", "Base de données", "Documentation"], outcome: "Un backend robuste et évolutif" },
      { slug: "react", title: "React", description: "Applications frontend modernes et réactives avec React.", icon: "Code", deliverables: ["SPA/SSR", "Composants réutilisables", "State management", "Tests"], outcome: "Une interface utilisateur réactive" },
      { slug: "nextjs", title: "Next.js", description: "Applications full-stack avec Next.js pour des performances optimales.", icon: "Code", deliverables: ["Full-stack app", "SSR/SSG/ISR", "API routes", "SEO intégré"], outcome: "Une application performante et SEO-friendly" },
      { slug: "wordpress", title: "WordPress", description: "Sites WordPress sur mesure avec thèmes et plugins personnalisés.", icon: "Code", deliverables: ["Thème personnalisé", "Plugins", "Optimisation", "Formation"], outcome: "Un site WordPress professionnel" },
      { slug: "flutter", title: "Flutter", description: "Applications mobiles cross-platform avec Flutter.", icon: "Smartphone", deliverables: ["App iOS/Android", "UI native", "Performances", "Store ready"], outcome: "Une app mobile cross-platform" },
      { slug: "php", title: "PHP", description: "Développement backend PHP sur mesure.", icon: "Code", deliverables: ["Backend PHP", "API", "Base de données", "Sécurité"], outcome: "Un backend fiable et sécurisé" },
      { slug: "typescript", title: "TypeScript", description: "Applications typées et maintenables avec TypeScript.", icon: "Code", deliverables: ["Code typé", "API typées", "Documentation", "Tests"], outcome: "Un code fiable et maintenable" },
    ]},
    { slug: "maintenance-support", title: "Maintenance & Support", description: "Maintien et évolution de vos actifs numériques en toute sérénité.", icon: "Tool", services: [
      { slug: "website-maintenance", title: "Website Maintenance", description: "Maintenance et mises à jour régulières de votre site web.", icon: "RefreshCw", deliverables: ["Mises à jour sécurité", "Sauvegardes", "Monitoring", "Support"], outcome: "Un site toujours à jour et sécurisé" },
      { slug: "hosting", title: "Hosting", description: "Hébergement premium avec performances optimales.", icon: "Server", deliverables: ["Hébergement VPS", "SSL", "CDN", "Backups", "Support 24/7"], outcome: "Un hébergement performant et sécurisé" },
      { slug: "professional-emails", title: "Professional Emails", description: "Emails professionnels avec votre domaine.", icon: "Mail", deliverables: ["Configuration MX", "Boîtes mail", "Alias", "Signature"], outcome: "Des emails professionnels" },
      { slug: "website-migration", title: "Website Migration", description: "Migration de site web sans perte de données ni de SEO.", icon: "ArrowRight", deliverables: ["Audit pré-migration", "Migration données", "Redirections", "Tests"], outcome: "Une migration réussie sans interruption" },
    ]},
    { slug: "automation", title: "Automation", description: "Automatisez vos processus pour gagner en efficacité.", icon: "Zap", services: [
      { slug: "api-integration", title: "API Integration", description: "Intégration d'API pour connecter vos outils et services.", icon: "Link", deliverables: ["Conception API", "Documentation", "Tests"], outcome: "Des systèmes connectés et automatisés" },
      { slug: "data-scraping", title: "Data Scraping", description: "Extraction automatisée de données web.", icon: "Database", deliverables: ["Scraper sur mesure", "Nettoyage données", "Export", "Planification"], outcome: "Des données structurées à portée de main" },
      { slug: "workflow-automation", title: "Workflow Automation", description: "Automatisation de vos processus métier.", icon: "GitBranch", deliverables: ["Analyse processus", "Workflows", "Intégrations", "Tableaux de bord"], outcome: "Des processus automatisés et efficaces" },
      { slug: "crm", title: "CRM", description: "Solutions CRM sur mesure pour gérer vos relations clients.", icon: "Users", deliverables: ["CRM personnalisé", "Pipeline ventes", "Automatisation", "Reporting"], outcome: "Une gestion client optimisée" },
      { slug: "erp", title: "ERP", description: "Solutions ERP pour intégrer et optimiser votre gestion d'entreprise.", icon: "Building", deliverables: ["ERP sur mesure", "Modules métier", "Intégrations", "Formation"], outcome: "Une gestion d'entreprise intégrée" },
      { slug: "booking-systems", title: "Booking Systems", description: "Systèmes de réservation et de prise de rendez-vous.", icon: "Calendar", deliverables: ["Système réservation", "Calendrier", "Paiement", "Notifications"], outcome: "Un système de réservation efficace" },
    ]},
    { slug: "audit", title: "Audit", description: "Audits complets pour évaluer et optimiser votre présence digitale.", icon: "Search", services: [
      { slug: "website-audit", title: "Website Audit", description: "Audit complet de votre site web : performance, accessibilité et SEO.", icon: "Monitor", deliverables: ["Rapport détaillé", "Recommandations", "Plan d'action", "Suivi"], outcome: "Une vision claire des améliorations" },
      { slug: "seo-audit", title: "SEO Audit", description: "Audit SEO approfondi pour identifier les opportunités de croissance.", icon: "Search", deliverables: ["Audit technique", "Analyse concurrence", "Mots-clés", "Recommandations"], outcome: "Une stratégie SEO data-driven" },
      { slug: "security-audit", title: "Security Audit", description: "Audit de sécurité pour identifier et corriger les vulnérabilités.", icon: "Shield", deliverables: ["Test pénétration", "Analyse vulnérabilités", "Rapport", "Corrections"], outcome: "Un site sécurisé et conforme" },
      { slug: "performance-audit", title: "Performance Audit", description: "Audit de performance pour optimiser la vitesse et l'expérience utilisateur.", icon: "Zap", deliverables: ["Core Web Vitals", "Recommandations", "Optimisations", "Tests"], outcome: "Des performances optimales" },
    ]},
  ]

  for (let order = 0; order < categoryData.length; order++) {
    const cat = categoryData[order]
    const category = await db.serviceCategory.create({
      data: { slug: cat.slug, title: cat.title, description: cat.description, icon: cat.icon, displayOrder: order },
    })
    for (let i = 0; i < cat.services.length; i++) {
      const svc = cat.services[i]
      await db.service.create({
        data: { slug: svc.slug, title: svc.title, description: svc.description, icon: svc.icon, categoryId: category.id, deliverables: svc.deliverables, outcome: svc.outcome, isActive: true, displayOrder: i },
      })
    }
    console.log(`  Created category "${category.title}" with ${cat.services.length} services`)
  }

  console.log("Service data seeded successfully")

  const existingProjects = await db.project.count()
  if (existingProjects > 0) {
    console.log("Projects already exist, skipping...")
    await db.$disconnect()
    return
  }

  const projects = [
    {
      slug: "luxury-ecommerce",
      title: "E-commerce Luxury Brand",
      description: "Refonte complète d'une boutique e-commerce avec optimisation SEO et UX pour une marque de luxe.",
      client: "Marque de luxe",
      industry: "E-commerce",
      country: "Maroc",
      duration: "4 months",
      isFeatured: true,
      isActive: true,
      displayOrder: 1,
      status: "completed",
      challenge: "La marque faisait face à une baisse de trafic organique et un taux de conversion stagnant. Le site existant était lent, non optimisé mobile, et ne reflétait pas le positionnement premium de la marque.",
      solution: "Nous avons complètement repensé l'architecture du site avec Next.js pour des performances optimales, intégré Shopify pour le panier, et mis en place une stratégie SEO complète incluant le contenu, la technique et les backlinks.",
      technologies: ["Next.js", "Shopify", "Stripe", "SEO"],
      servicesProvided: ["Web Development", "Digital Marketing", "UI/UX Design"],
      results: [{ label: "Trafic organique", value: "+200%" }, { label: "Taux de conversion", value: "+40%" }],
      featuredImage: "",
      clientTestimonial: { quote: "Weblancia a transformé notre présence en ligne. Notre trafic a explosé et les ventes suivent.", author: "Karim El Fassi", role: "CEO" },
    },
    {
      slug: "finance-corporate",
      title: "Site Corporate Finance",
      description: "Site institutionnel pour une société de financement avec une expérience utilisateur premium.",
      client: "Société de financement",
      industry: "Finance",
      country: "Maroc",
      duration: "3 months",
      isFeatured: true,
      isActive: true,
      displayOrder: 2,
      status: "completed",
      challenge: "Le site existant ne communiquait pas efficacement la crédibilité et l'expertise de l'entreprise. Il manquait de contenu institutionnel et n'était pas conforme aux normes de sécurité.",
      solution: "Nous avons conçu un site corporate avec WordPress, en mettant l'accent sur la hiérarchie de l'information, les témoignages clients, et une section ressources pour le leadership éclairé.",
      technologies: ["WordPress", "UI/UX", "Performance"],
      servicesProvided: ["Web Development", "Branding & Design"],
      results: [{ label: "Taux de conversion", value: "+40%" }, { label: "Temps de chargement", value: "-60%" }],
      clientTestimonial: { quote: "Un site professionnel qui reflète parfaitement notre expertise. Les résultats sont au rendez-vous.", author: "Fatima Zahra", role: "Directrice Marketing" },
    },
    {
      slug: "logistics-webapp",
      title: "Application Logistique",
      description: "Application web de gestion logistique pour une startup en croissance.",
      client: "Startup logistique",
      industry: "Logistique",
      country: "Maroc",
      duration: "6 months",
      isFeatured: true,
      isActive: true,
      displayOrder: 3,
      status: "completed",
      challenge: "La startup gérait ses opérations via des tableurs Excel, ce qui devenait ingérable avec la croissance. Ils avaient besoin d'une solution sur-mesure pour la gestion des livraisons, des stocks et des chauffeurs.",
      solution: "Nous avons développé une application web complète avec Laravel et React, incluant un tableau de bord en temps réel, une API pour l'application mobile des chauffeurs, et des rapports automatisés.",
      technologies: ["Laravel", "React", "API", "MySQL"],
      servicesProvided: ["Web Development", "Consulting"],
      results: [{ label: "Efficacité opérationnelle", value: "+60%" }, { label: "Erreurs de livraison", value: "-90%" }],
      clientTestimonial: { quote: "Cette application a changé notre façon de travailler. Nous sommes passés de Excel à une plateforme professionnelle.", author: "Amine Benali", role: "COO" },
    },
    {
      slug: "restaurant-branding",
      title: "Branding & Site Restaurant",
      description: "Identité de marque complète et site vitrine pour un restaurant gastronomique.",
      client: "Restaurant gastronomique",
      industry: "Restaurant",
      country: "Maroc",
      duration: "2 months",
      isFeatured: false,
      isActive: true,
      displayOrder: 4,
      status: "completed",
      challenge: "Le restaurant ouvrait ses portes et avait besoin d'une identité de marque forte ainsi que d'un site vitrine pour attirer une clientèle haut de gamme.",
      solution: "Nous avons créé une identité de marque complète incluant le logo, la palette de couleurs, la typographie, et un site vitrine avec galerie photo, menu interactif et réservation en ligne.",
      technologies: ["Branding", "UI/UX", "WordPress"],
      servicesProvided: ["Branding & Design", "Web Development"],
      results: [{ label: "Réservations en ligne", value: "3x plus" }],
      clientTestimonial: { quote: "Notre marque est exactement ce que nous visions. Le site est magnifique et nos clients adorent.", author: "Sophie Martin", role: "Propriétaire" },
    },
    {
      slug: "saas-landing",
      title: "Landing Page SaaS",
      description: "Landing page optimisée pour un produit SaaS B2B avec un taux de conversion exceptionnel.",
      client: "Éditeur de logiciel",
      industry: "SaaS",
      country: "France",
      duration: "1 month",
      isFeatured: false,
      isActive: true,
      displayOrder: 5,
      status: "completed",
      challenge: "Le produit SaaS avait un excellent taux de rétention mais un taux de conversion d'essai vers abonnement trop faible. La page d'accueil ne communiquait pas efficacement la valeur du produit.",
      solution: "Nous avons conçu et développé une landing page orientée conversion avec des témoignages clients, des études de cas, et un parcours utilisateur optimisé.",
      technologies: ["Next.js", "Conversion", "Design"],
      servicesProvided: ["Web Development", "Digital Marketing"],
      results: [{ label: "Taux de conversion", value: "12%" }, { label: "Lead qualifiés", value: "+80%" }],
    },
    {
      slug: "education-platform",
      title: "Plateforme Éducation",
      description: "Plateforme complète de formation en ligne avec Laravel et Vue.js.",
      client: "Startup EdTech",
      industry: "Education",
      country: "Maroc",
      duration: "8 months",
      isFeatured: false,
      isActive: true,
      displayOrder: 6,
      status: "completed",
      challenge: "La startup avait besoin d'une plateforme de formation en ligne complète avec gestion des cours, des étudiants, des certifications et des paiements.",
      solution: "Nous avons développé une plateforme LMS sur-mesure avec Laravel et Vue.js, intégrant Stripe pour les paiements, une API pour les applications mobiles, et un dashboard analytics.",
      technologies: ["Laravel", "Vue.js", "SaaS", "Stripe"],
      servicesProvided: ["Web Development", "Technology"],
      results: [{ label: "Utilisateurs en 3 mois", value: "5000" }, { label: "Taux de complétion", value: "85%" }],
      clientTestimonial: { quote: "La plateforme est stable, rapide et nos étudiants l'adorent. Merci à toute l'équipe Weblancia.", author: "Dr. Nadia El Amrani", role: "Fondatrice" },
    },
  ]

  for (const data of projects) {
    await db.project.create({ data })
  }
  console.log(`Seeded ${projects.length} portfolio projects`)

  const existingBlogCategories = await db.blogCategory.count()
  if (existingBlogCategories > 0) {
    console.log("Blog categories already exist, skipping...")
    await db.$disconnect()
    return
  }

  const blogCategories = await Promise.all([
    db.blogCategory.create({ data: { slug: "tech", title: "Tech", description: "Développement web et technologies" } }),
    db.blogCategory.create({ data: { slug: "marketing", title: "Marketing", description: "Marketing digital et stratégies" } }),
    db.blogCategory.create({ data: { slug: "seo", title: "SEO", description: "Référencement et visibilité" } }),
    db.blogCategory.create({ data: { slug: "design", title: "Design", description: "UI/UX design et branding" } }),
    db.blogCategory.create({ data: { slug: "conseils", title: "Conseils", description: "Conseils pratiques pour entrepreneurs" } }),
  ])

  const catMap: Record<string, number> = {}
  for (const c of blogCategories) catMap[c.slug] = c.id

  const articles = [
    {
      slug: "tendances-web-2025", title: "Les Tendances Web à Suivre en 2025", excerpt: "Découvrez les tendances qui façonneront le web en 2025 : IA, performance, design minimaliste et expérience utilisateur.",
      category: "tech", author: "Yassine El Khazouni",
      content: "L'année 2025 marque un tournant dans l'industrie du web. Entre l'essor de l'IA générative, les nouvelles exigences de performance et l'évolution des attentes utilisateurs, les entreprises doivent s'adapter pour rester compétitives.\n\n## 1. L'IA au Service du Développement\n\nL'intelligence artificielle transforme la façon dont nous concevons et développons les sites web. Des outils comme GitHub Copilot et Cursor accélèrent le développement tout en maintenant une qualité élevée.\n\n## 2. La Performance comme Priorité Absolue\n\nAvec Core Web Vitals, Google place la performance au cœur du référencement. Les sites doivent charger en moins de 2.5 secondes pour être bien classés.\n\n## 3. Le Design Minimaliste et Authentique\n\nFini les designs surchargés. 2025 marque le retour à l'essentiel avec des interfaces épurées qui mettent le contenu au premier plan.",
      isFeatured: true, isPublished: true, readingTime: 8, tags: ["Web", "IA", "Performance"],
    },
    {
      slug: "augmenter-taux-conversion", title: "10 Stratégies pour Augmenter Votre Taux de Conversion", excerpt: "Des techniques éprouvées pour transformer plus de visiteurs en clients.",
      category: "marketing", author: "Sara Benali",
      content: "Le taux de conversion est l'un des indicateurs les plus importants pour mesurer l'efficacité de votre site web.\n\n## 1. Optimisez vos CTA\n\nLes boutons d'appel à l'action doivent être visibles, clairs et convaincants. Testez différentes couleurs, textes et positions.\n\n## 2. Simplifiez vos formulaires\n\nMoins de champs = plus de conversions. Chaque champ supplémentaire réduit votre taux de conversion.\n\n## 3. Utilisez la Preuve Sociale\n\nTémoignages, avis clients, études de cas : la preuve sociale rassure et convertit.",
      isFeatured: true, isPublished: true, readingTime: 10, tags: ["Conversion", "UX", "Marketing"],
    },
    {
      slug: "seo-local-entreprises", title: "SEO Local : Le Guide Complet pour les Entreprises", excerpt: "Comment apparaître dans les résultats locaux Google et attirer plus de clients.",
      category: "seo", author: "Sara Benali",
      content: "Le SEO local est essentiel pour les entreprises qui souhaitent attirer des clients dans leur zone géographique.\n\n## 1. Google My Business\n\nVotre fiche Google My Business est la clé du SEO local. Optimisez-la avec des photos, des horaires précis et des réponses aux avis.\n\n## 2. Avis Clients\n\nLes avis positifs sont un facteur de classement majeur. Encouragez vos clients satisfaits à laisser des avis.\n\n## 3. Contenu Local\n\nCréez du contenu qui mentionne votre ville, votre quartier et des sujets locaux pertinents.",
      isFeatured: false, isPublished: true, readingTime: 7, tags: ["SEO", "Local", "Google"],
    },
    {
      slug: "guide-ui-ux-2025", title: "Guide Complet UI/UX Design 2025", excerpt: "Les principes essentiels du design d'interface et d'expérience utilisateur pour 2025.",
      category: "design", author: "Yassine El Khazouni",
      content: "Le design UI/UX évolue constamment. Voici les principes clés pour 2025.\n\n## 1. Accessibilité Avant Tout\n\nLe design inclusif n'est plus une option. Assurez-vous que vos interfaces sont utilisables par tous, y compris les personnes en situation de handicap.\n\n## 2. Micro-interactions\n\nLes petites animations et feedbacks visuels améliorent considérablement l'expérience utilisateur.\n\n## 3. Design System\n\nUn design system cohérent accélère le développement et garantit une expérience uniforme sur tous les points de contact.",
      isFeatured: false, isPublished: true, readingTime: 6, tags: ["UI/UX", "Design", "Accessibilité"],
    },
    {
      slug: "choisir-agence-web", title: "Comment Choisir son Agence Web en 2025", excerpt: "Guide pratique pour sélectionner l'agence digitale qui correspond à vos besoins.",
      category: "conseils", author: "Yassine El Khazouni",
      content: "Choisir une agence web est une décision stratégique pour votre entreprise.\n\n## 1. Définissez vos Objectifs\n\nAvant de contacter des agences, clarifiez vos objectifs : visibilité, ventes, notoriété ?\n\n## 2. Évaluez l'Expertise\n\nDemandez des références, des études de cas et vérifiez les compétences techniques de l'équipe.\n\n## 3. La Communication est Clé\n\nUne bonne agence vous écoute, vous conseille et vous tient informé tout au long du projet.",
      isFeatured: false, isPublished: true, readingTime: 5, tags: ["Conseils", "Agence", "Digital"],
    },
    {
      slug: "performance-site-web", title: "Optimiser la Performance de son Site Web", excerpt: "Techniques avancées pour améliorer la vitesse et les Core Web Vitals de votre site.",
      category: "tech", author: "Sara Benali",
      content: "La performance web est cruciale pour le SEO et l'expérience utilisateur.\n\n## 1. Optimisation des Images\n\nUtilisez des formats modernes comme WebP et AVIF, et implémentez le lazy loading.\n\n## 2. Mise en Cache\n\nUne stratégie de cache bien conçue peut réduire les temps de chargement de 80%.\n\n## 3. Code Splitting\n\nChargez uniquement le JavaScript nécessaire pour chaque page avec le code splitting.",
      isFeatured: false, isPublished: true, readingTime: 9, tags: ["Performance", "SEO", "Technique"],
    },
  ]

  for (const article of articles) {
    await db.blogPost.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        categoryId: catMap[article.category],
        author: article.author,
        publishedAt: new Date(),
        isPublished: article.isPublished,
        isFeatured: article.isFeatured,
        readingTime: article.readingTime,
        tags: article.tags,
      },
    })
  }
  console.log(`Seeded ${articles.length} blog articles`)

  // ── Academy Seed ──────────────────────────────────────
  const existingAcademyCategories = await db.academyCategory.count()
  if (existingAcademyCategories > 0) {
    console.log("Academy categories already exist, skipping...")
    return
  }

  const academyCategories = await Promise.all([
    db.academyCategory.create({ data: { slug: "web-development", title: "Web Development", description: "Développement web full-stack", icon: "code", displayOrder: 1 } }),
    db.academyCategory.create({ data: { slug: "marketing-digital", title: "Marketing Digital", description: "Marketing et stratégies digitales", icon: "trending-up", displayOrder: 2 } }),
    db.academyCategory.create({ data: { slug: "design-ui-ux", title: "Design & UI/UX", description: "Design d'interface et expérience utilisateur", icon: "palette", displayOrder: 3 } }),
    db.academyCategory.create({ data: { slug: "data-ai", title: "Data & Intelligence Artificielle", description: "Data science, machine learning et IA", icon: "database", displayOrder: 4 } }),
    db.academyCategory.create({ data: { slug: "cybersecurite", title: "Cybersécurité", description: "Sécurité des systèmes et réseaux", icon: "shield", displayOrder: 5 } }),
  ])

  const acatMap: Record<string, number> = {}
  for (const c of academyCategories) acatMap[c.slug] = c.id

  // Courses
  const courses = [
    {
      slug: "fullstack-web-dev", title: "Full-Stack Web Development",
      shortDescription: "Maîtrisez le développement web de A à Z avec React, Node.js et les bases de données.",
      fullDescription: "Un parcours complet pour devenir développeur full-stack.\n\n## Programme\n\n### Module 1 : Frontend avec React\n- Composants et état\n- Hooks avancés\n- Routing et navigation\n\n### Module 2 : Backend avec Node.js\n- API REST\n- Authentification\n- Bases de données\n\n### Module 3 : DevOps & Déploiement\n- CI/CD\n- Docker\n- Cloud hosting",
      instructor: "Yassine El Khazouni", academyCategoryId: acatMap["web-development"],
      level: "Intermediate", duration: "12 weeks", language: "Français",
      price: 1499, discountPrice: 999, isFeatured: true, isPublished: true,
      curriculum: [{ title: "Introduction au Web", items: ["HTML & CSS avancé", "JavaScript moderne", "Outils de développement"] }, { title: "React Mastery", items: ["Composants et Props", "Hooks et State Management", "Routing avec Next.js"] }, { title: "Backend & API", items: ["Node.js et Express", "API RESTful", "Authentification JWT"] }, { title: "Base de Données", items: ["SQL et Prisma", "MongoDB", "Cache avec Redis"] }],
      requirements: ["Connaissances de base en HTML/CSS", "Logique de programmation", "Un ordinateur avec 8 Go RAM minimum"],
      learningOutcomes: ["Développer une application web complète", "Créer des API RESTful", "Gérer des bases de données relationnelles", "Déployer une application en production"],
      certificateIncluded: true,
    },
    {
      slug: "marketing-strategique", title: "Marketing Digital Stratégique",
      shortDescription: "Élaborez des stratégies marketing performantes pour booster votre visibilité en ligne.",
      fullDescription: "Un programme complet de marketing digital.\n\n## Programme\n\n### Module 1 : Fondamentaux\n- Stratégie digitale\n- Persona et targeting\n- KPI et analytics\n\n### Module 2 : Acquisition\n- SEO avancé\n- SEA / Google Ads\n- Social Media Marketing\n\n### Module 3 : Conversion & Fidélisation\n- Email marketing\n- Marketing automation\n- A/B testing",
      instructor: "Sara Benali", academyCategoryId: acatMap["marketing-digital"],
      level: "Beginner", duration: "8 weeks", language: "Français",
      price: 899, isFeatured: true, isPublished: true,
      curriculum: [{ title: "Fondamentaux du Marketing Digital", items: ["Stratégie digitale", "Analyse de marché", "Persona et parcours client"] }, { title: "Acquisition de Trafic", items: ["SEO avancé", "Google Ads", "Social Ads"] }, { title: "Conversion", items: ["Landing pages", "Email marketing", "Marketing automation"] }],
      requirements: ["Aucun prérequis", "Intérêt pour le marketing"],
      learningOutcomes: ["Créer une stratégie marketing complète", "Gérer des campagnes publicitaires", "Analyser et optimiser les performances"],
      certificateIncluded: true,
    },
    {
      slug: "ui-ux-masterclass", title: "UI/UX Design : De l'Idée à l'Interface",
      shortDescription: "Apprenez à concevoir des interfaces utilisateur intuitives et esthétiques.",
      fullDescription: "Un parcours complet de design UI/UX.\n\n## Programme\n\n### Module 1 : Fondamentaux du Design\n- Théorie des couleurs\n- Typographie\n- Grilles et mise en page\n\n### Module 2 : UX Research\n- Recherche utilisateur\n- Wireframing\n- Prototypage\n\n### Module 3 : UI Design\n- Design Systems\n- Composants et patterns\n- Animation et micro-interactions",
      instructor: "Imane El Alami", academyCategoryId: acatMap["design-ui-ux"],
      level: "Beginner", duration: "10 weeks", language: "Français",
      price: 1199, discountPrice: 799, isFeatured: true, isPublished: true,
      curriculum: [{ title: "Fondamentaux du Design", items: ["Théorie des couleurs", "Typographie", "Grilles et mise en page"] }, { title: "UX Research", items: ["Recherche utilisateur", "Wireframing", "Prototypage"] }, { title: "UI Design", items: ["Design Systems", "Composants et patterns", "Animation"] }],
      requirements: ["Aucun prérequis technique", "Créativité et sens de l'esthétique"],
      learningOutcomes: ["Concevoir des interfaces utilisateur complètes", "Maîtriser Figma et les outils de design", "Réaliser des recherches utilisateur", "Créer un design system"],
      certificateIncluded: true,
    },
    {
      slug: "data-science-foundations", title: "Data Science & Machine Learning",
      shortDescription: "Plongez dans l'univers de la data science et du machine learning avec Python.",
      fullDescription: "Un programme intensif en data science.\n\n## Programme\n\n### Module 1 : Python pour la Data Science\n- Pandas et NumPy\n- Visualisation\n- Statistiques\n\n### Module 2 : Machine Learning\n- Algorithmes supervisés\n- Algorithmes non supervisés\n- Évaluation de modèles\n\n### Module 3 : Deep Learning\n- Réseaux de neurones\n- TensorFlow / PyTorch\n- Computer Vision",
      instructor: "Dr. Mehdi Benjelloun", academyCategoryId: acatMap["data-ai"],
      level: "Advanced", duration: "14 weeks", language: "Français",
      price: 1999, discountPrice: 1499, isFeatured: false, isPublished: true,
      curriculum: [{ title: "Python pour la Data Science", items: ["Pandas et NumPy", "Visualisation", "Statistiques"] }, { title: "Machine Learning", items: ["Algorithmes supervisés", "Algorithmes non supervisés", "Évaluation de modèles"] }, { title: "Deep Learning", items: ["Réseaux de neurones", "TensorFlow / PyTorch", "Computer Vision"] }],
      requirements: ["Connaissances en Python", "Bases en mathématiques et statistiques"],
      learningOutcomes: ["Analyser et visualiser des données complexes", "Construire des modèles de ML", "Déployer des modèles en production"],
      certificateIncluded: true,
    },
    {
      slug: "cybersecurite-essentials", title: "Cybersécurité : Protégez vos Systèmes",
      shortDescription: "Acquérez les compétences essentielles pour sécuriser vos infrastructures IT.",
      fullDescription: "Un programme complet en cybersécurité.\n\n## Programme\n\n### Module 1 : Fondamentaux\n- Concepts de sécurité\n- Cryptographie\n- Sécurité réseau\n\n### Module 2 : Sécurité Offensive\n- Pentesting\n- Analyse de vulnérabilités\n- Social Engineering\n\n### Module 3 : Sécurité Défensive\n- SIEM et monitoring\n- Réponse aux incidents\n- Forensics",
      instructor: "Omar Tazi", academyCategoryId: acatMap["cybersecurite"],
      level: "Intermediate", duration: "12 weeks", language: "Français",
      price: 1699, discountPrice: 1299, isFeatured: false, isPublished: true,
      curriculum: [{ title: "Fondamentaux de la Sécurité", items: ["Concepts de sécurité", "Cryptographie", "Sécurité réseau"] }, { title: "Sécurité Offensive", items: ["Pentesting", "Analyse de vulnérabilités", "Social Engineering"] }, { title: "Sécurité Défensive", items: ["SIEM et monitoring", "Réponse aux incidents", "Forensics"] }],
      requirements: ["Bases en réseaux et systèmes", "Connaissances en Linux"],
      learningOutcomes: ["Identifier et exploiter des vulnérabilités", "Mettre en place des mesures de sécurité", "Répondre aux incidents de sécurité"],
      certificateIncluded: true,
    },
    {
      slug: "react-native-mobile", title: "Développement Mobile avec React Native",
      shortDescription: "Créez des applications mobiles cross-platform avec React Native.",
      fullDescription: "Un parcours complet sur React Native.\n\n## Programme\n\n### Module 1 : Fondamentaux React Native\n- Composants natifs\n- Navigation\n- State management\n\n### Module 2 : Fonctionnalités Avancées\n- Animations\n- Stockage local\n- Notifications push\n\n### Module 3 : Publication\n- App Store & Play Store\n- CI/CD mobile\n- Monitoring",
      instructor: "Yassine El Khazouni", academyCategoryId: acatMap["web-development"],
      level: "Intermediate", duration: "10 weeks", language: "Français",
      price: 1299, discountPrice: 899, isFeatured: false, isPublished: true,
      curriculum: [{ title: "Fondamentaux React Native", items: ["Composants natifs", "Navigation", "State management"] }, { title: "Fonctionnalités Avancées", items: ["Animations", "Stockage local", "Notifications push"] }, { title: "Publication", items: ["App Store & Play Store", "CI/CD mobile", "Monitoring"] }],
      requirements: ["Connaissances en React", "JavaScript moderne"],
      learningOutcomes: ["Développer une app mobile cross-platform", "Publier sur les stores", "Utiliser les APIs natives"],
      certificateIncluded: true,
    },
  ]

  for (const course of courses) {
    await db.course.create({ data: course })
  }
  console.log(`Seeded ${courses.length} courses`)

  // Workshops
  const workshops = [
    {
      slug: "react-workshop", title: "Atelier React Avancé",
      description: "Un atelier intensif pour maîtriser les hooks avancés, le state management et les patterns React modernes.",
      instructor: "Yassine El Khazouni", academyCategoryId: acatMap["web-development"],
      date: new Date("2026-08-15"), time: "09:00", duration: "4 hours", seats: 20,
      location: "Casablanca", type: "Offline", price: 299, status: "Upcoming", isPublished: true,
    },
    {
      slug: "seo-atelier", title: "Atelier SEO Pratique",
      description: "Apprenez les techniques SEO concrètes pour améliorer le classement de vos sites.",
      instructor: "Sara Benali", academyCategoryId: acatMap["marketing-digital"],
      date: new Date("2026-09-01"), time: "14:00", duration: "3 hours", seats: 30,
      location: "En ligne", type: "Online", price: 149, status: "Upcoming", isPublished: true,
    },
    {
      slug: "figma-workshop", title: "Atelier Figma : Design System",
      description: "Créez un design system complet sur Figma : composants, variantes, auto-layout et prototypes.",
      instructor: "Imane El Alami", academyCategoryId: acatMap["design-ui-ux"],
      date: new Date("2026-09-20"), time: "10:00", duration: "5 hours", seats: 15,
      location: "Rabat", type: "Offline", price: 349, status: "Upcoming", isPublished: true,
    },
    {
      slug: "python-data-workshop", title: "Atelier Python pour la Data Science",
      description: "Un atelier pratique pour apprendre à manipuler et visualiser des données avec Python.",
      instructor: "Dr. Mehdi Benjelloun", academyCategoryId: acatMap["data-ai"],
      date: new Date("2026-10-05"), time: "09:30", duration: "6 hours", seats: 25,
      location: "En ligne", type: "Online", price: 199, status: "Upcoming", isPublished: true,
    },
  ]

  for (const w of workshops) {
    await db.workshop.create({ data: w })
  }
  console.log(`Seeded ${workshops.length} workshops`)

  // Resources
  const resources = [
    {
      slug: "guide-react-2026", title: "Guide Complet React 2026",
      description: "Un guide détaillé pour maîtriser React avec les dernières fonctionnalités.",
      type: "PDF", file: "/uploads/academy/guide-react-2026.pdf",
      thumbnail: "/uploads/academy/guide-react-thumb.jpg", isFree: true, isPublished: true,
      academyCategoryId: acatMap["web-development"],
    },
    {
      slug: "template-seo-audit", title: "Template d'Audit SEO",
      description: "Un template Excel pour réaliser vos audits SEO.",
      type: "XLSX", file: "/uploads/academy/template-seo-audit.xlsx",
      thumbnail: null, isFree: true, isPublished: true,
      academyCategoryId: acatMap["marketing-digital"],
    },
    {
      slug: "kit-ux-design", title: "Kit UI/UX Design System",
      description: "Un design system complet avec composants, icônes et templates Figma.",
      type: "ZIP", file: "/uploads/academy/kit-ux-design.zip",
      thumbnail: "/uploads/academy/kit-ux-thumb.jpg", isFree: false, isPublished: true,
      academyCategoryId: acatMap["design-ui-ux"],
    },
    {
      slug: "cheatsheet-python-data", title: "Aide-mémoire Python Data Science",
      description: "Un mémo des fonctions essentielles Pandas, NumPy et Scikit-learn.",
      type: "PDF", file: "/uploads/academy/cheatsheet-python-data.pdf",
      thumbnail: null, isFree: true, isPublished: true,
      academyCategoryId: acatMap["data-ai"],
    },
  ]

  for (const r of resources) {
    await db.resource.create({ data: r })
  }
  console.log(`Seeded ${resources.length} resources`)

  // Certificates
  const certificates = [
    {
      slug: "fullstack-dev-cert", title: "Certificat Développeur Full-Stack",
      description: "Validez vos compétences en développement web full-stack avec cette certification reconnue.",
      requirements: ["Réussir le cours Full-Stack Web Development", "Compléter le projet final", "Obtenir 70% minimum"],
      badge: "/uploads/academy/badge-fullstack.png", duration: "12 weeks", level: "Intermediate",
      isPublished: true, academyCategoryId: acatMap["web-development"],
    },
    {
      slug: "marketing-digital-cert", title: "Certificat Marketing Digital",
      description: "Certifiez vos compétences en marketing digital et stratégie en ligne.",
      requirements: ["Réussir le cours Marketing Digital Stratégique", "Compléter les 3 études de cas", "Obtenir 70% minimum"],
      badge: "/uploads/academy/badge-marketing.png", duration: "8 weeks", level: "Beginner",
      isPublished: true, academyCategoryId: acatMap["marketing-digital"],
    },
    {
      slug: "ui-ux-cert", title: "Certificat UI/UX Design",
      description: "Certifiez votre maîtrise du design d'interface et de l'expérience utilisateur.",
      requirements: ["Réussir le cours UI/UX Design", "Présenter un portfolio de 3 projets", "Obtenir 70% minimum"],
      badge: "/uploads/academy/badge-uiux.png", duration: "10 weeks", level: "Beginner",
      isPublished: true, academyCategoryId: acatMap["design-ui-ux"],
    },
  ]

  for (const c of certificates) {
    await db.certificate.create({ data: c })
  }
  console.log(`Seeded ${certificates.length} certificates`)
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
