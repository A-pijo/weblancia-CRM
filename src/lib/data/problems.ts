export interface Problem {
  slug: string
  name: string
  nameEn: string
  description: string
  metaDescription: string
}

export const problems: Problem[] = [
  {
    slug: "trafic-insuffisant",
    name: "Trafic Insuffisant",
    nameEn: "Low Traffic",
    description: "Vous ne recevez pas assez de visiteurs sur votre site web",
    metaDescription: "Solutions pour augmenter le trafic de votre site web : SEO, marketing digital et stratégies de contenu pour attirer plus de visiteurs qualifiés.",
  },
  {
    slug: "site-lent",
    name: "Site Lent",
    nameEn: "Slow Website",
    description: "Votre site web est trop lent et fait fuir vos visiteurs",
    metaDescription: "Optimisation de vitesse de site web : accélérez votre site, améliorez les Core Web Vitals et offrez une expérience utilisateur fluide.",
  },
  {
    slug: "faible-conversion",
    name: "Faible Taux de Conversion",
    nameEn: "Low Conversion Rate",
    description: "Vous avez du trafic mais peu de conversions",
    metaDescription: "Améliorez votre taux de conversion avec des landing pages optimisées, un design persuasif et des stratégies CRO éprouvées.",
  },
  {
    slug: "absence-digitale",
    name: "Absence Digitale",
    nameEn: "No Online Presence",
    description: "Votre entreprise n'a pas encore de présence en ligne",
    metaDescription: "Créez votre présence en ligne de A à Z : site web, réseaux sociaux, SEO local et stratégie digitale complète pour les nouveaux entrants.",
  },
  {
    slug: "mauvais-referencement",
    name: "Mauvais Référencement",
    nameEn: "Poor SEO Rankings",
    description: "Votre site n'apparaît pas dans les premiers résultats Google",
    metaDescription: "Améliorez votre classement Google avec une stratégie SEO complète : audit technique, optimisation on-page, netlinking et contenu de qualité.",
  },
  {
    slug: "mauvaise-experience-utilisateur",
    name: "Mauvaise Expérience Utilisateur",
    nameEn: "Bad User Experience",
    description: "Les visiteurs quittent votre site à cause d'une navigation complexe",
    metaDescription: "Refonte UX de votre site web : navigation intuitive, design centré utilisateur, accessibilité et parcours client optimisés.",
  },
  {
    slug: "securite-insuffisante",
    name: "Sécurité Insuffisante",
    nameEn: "Security Vulnerabilities",
    description: "Votre site web présente des failles de sécurité",
    metaDescription: "Audit et renforcement de la sécurité de votre site web : protection contre les cyberattaques, certificats SSL et conformité RGPD.",
  },
  {
    slug: "non-adapte-mobile",
    name: "Non Adapté au Mobile",
    nameEn: "Not Mobile-Friendly",
    description: "Votre site n'est pas optimisé pour les appareils mobiles",
    metaDescription: "Adaptation mobile de votre site web : responsive design, Core Web Vitals mobiles et expérience utilisateur smartphone optimale.",
  },
  {
    slug: "marque-peu-visible",
    name: "Marque Peu Visible",
    nameEn: "Weak Brand Visibility",
    description: "Votre marque manque de reconnaissance et de notoriété",
    metaDescription: "Renforcez la notoriété de votre marque : branding stratégique, identité visuelle, présence sur les réseaux sociaux et marketing de contenu.",
  },
  {
    slug: "processus-manuels",
    name: "Processus Manuels Chronophages",
    nameEn: "Time-Consuming Manual Processes",
    description: "Vous perdez du temps avec des tâches répétitives et manuelles",
    metaDescription: "Automatisez vos processus métier : workflow automation, CRM sur mesure, intégrations API et solutions no-code pour gagner en efficacité.",
  },
]

export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug)
}

export const serviceSlugs = ["seo", "web-development", "digital-marketing", "branding-design"]
