export interface Industry {
  slug: string
  name: string
  nameEn: string
  description: string
  metaDescription: string
}

export const industries: Industry[] = [
  {
    slug: "sante",
    name: "Santé",
    nameEn: "Healthcare",
    description: "Solutions digitales pour le secteur de la santé",
    metaDescription: "Agence digitale spécialisée dans la santé : sites web pour cliniques, applications médicales et solutions e-santé.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    nameEn: "E-commerce",
    description: "Plateformes e-commerce et solutions de vente en ligne",
    metaDescription: "Agence e-commerce : création de boutiques en ligne, marketplace et solutions de paiement pour e-commerçants.",
  },
  {
    slug: "education",
    name: "Éducation",
    nameEn: "Education",
    description: "Plateformes éducatives et solutions e-learning",
    metaDescription: "Agence digitale pour l'éducation : plateformes e-learning, LMS, applications éducatives et campus virtuels.",
  },
  {
    slug: "immobilier",
    name: "Immobilier",
    nameEn: "Real Estate",
    description: "Solutions web pour l'immobilier et la promotion",
    metaDescription: "Agence digitale immobilière : sites d'agences, portails immobiliers et solutions de visite virtuelle.",
  },
  {
    slug: "finance",
    name: "Finance",
    nameEn: "Finance",
    description: "Services financiers et fintech",
    metaDescription: "Agence digitale pour la finance : applications fintech, tableaux de bord et solutions de conformité numérique.",
  },
  {
    slug: "tourisme",
    name: "Tourisme & Hôtellerie",
    nameEn: "Tourism & Hospitality",
    description: "Solutions digitales pour le tourisme et l'hôtellerie",
    metaDescription: "Agence digitale touristique : sites d'hôtels, systèmes de réservation et expériences interactives.",
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}

export const industryServiceMapping: { serviceSlug: string; title: string; description: string }[] = [
  {
    serviceSlug: "web-development",
    title: "Développement Web pour le Secteur {industry}",
    description: "Nous créons des sites web et applications sur mesure adaptés aux besoins spécifiques du secteur {industry}. De la conception à la maintenance, notre équipe vous accompagne pour développer votre présence en ligne avec des solutions performantes et sécurisées.",
  },
  {
    serviceSlug: "seo",
    title: "Référencement SEO pour le Secteur {industry}",
    description: "Optimisez votre visibilité dans le secteur {industry} grâce à notre stratégie SEO spécialisée. Audit technique, optimisation du contenu, netlinking et SEO local pour attirer plus de clients qualifiés.",
  },
  {
    serviceSlug: "digital-marketing",
    title: "Marketing Digital pour le Secteur {industry}",
    description: "Développez votre activité dans le secteur {industry} avec nos stratégies marketing digital sur mesure : campagnes publicitaires, contenu ciblé, réseaux sociaux et email marketing.",
  },
  {
    serviceSlug: "branding-design",
    title: "Branding & Design pour le Secteur {industry}",
    description: "Créez une identité visuelle forte dans le secteur {industry}. Logo, charte graphique, site web et supports de communication conçus pour marquer les esprits et inspirer confiance.",
  },
]

export function getIndustryServiceMapping(serviceSlug: string) {
  return industryServiceMapping.find((m) => m.serviceSlug === serviceSlug)
}
