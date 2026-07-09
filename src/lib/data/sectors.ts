export interface Sector {
  slug: string
  name: string
  nameEn: string
  description: string
  metaDescription: string
}

export const sectors: Sector[] = [
  {
    slug: "medical",
    name: "Médical",
    nameEn: "Medical",
    description: "Solutions digitales pour le secteur médical et paramédical",
    metaDescription: "Agence digitale pour le secteur médical : sites web pour cliniques, plateformes de téléconsultation et solutions e-santé au Maroc.",
  },
  {
    slug: "dentistes",
    name: "Dentistes",
    nameEn: "Dentists",
    description: "Marketing digital et sites web pour cabinets dentaires",
    metaDescription: "Agence digitale pour dentistes : création de sites web pour cabinets dentaires, SEO local et marketing digital pour attirer plus de patients.",
  },
  {
    slug: "avocats",
    name: "Avocats",
    nameEn: "Lawyers",
    description: "Présence en ligne pour cabinets d'avocats et juristes",
    metaDescription: "Agence digitale pour avocats : sites web professionnels, référencement juridique et stratégie digitale pour cabinets d'avocats au Maroc.",
  },
  {
    slug: "immobilier",
    name: "Immobilier",
    nameEn: "Real Estate",
    description: "Solutions web pour l'immobilier et la promotion",
    metaDescription: "Agence digitale immobilière : sites d'agences, portails immobiliers, visites virtuelles et solutions de gestion locative au Maroc.",
  },
  {
    slug: "restauration",
    name: "Restauration",
    nameEn: "Restaurants",
    description: "Digital pour restaurants, cafés et traiteurs",
    metaDescription: "Agence digitale pour la restauration : sites de restaurants, menus en ligne, systèmes de réservation et marketing digital pour restaurateurs.",
  },
  {
    slug: "hotellerie",
    name: "Hôtellerie",
    nameEn: "Hotels",
    description: "Solutions digitales pour hôtels et hébergements",
    metaDescription: "Agence digitale pour l'hôtellerie : sites d'hôtels, moteurs de réservation, gestion des avis et marketing hôtelier au Maroc.",
  },
  {
    slug: "construction",
    name: "Construction & BTP",
    nameEn: "Construction",
    description: "Transformation digitale pour le secteur du BTP",
    metaDescription: "Agence digitale pour la construction : sites web pour entreprises BTP, portfolios de projets et solutions de gestion de chantier.",
  },
  {
    slug: "education",
    name: "Éducation",
    nameEn: "Education",
    description: "Plateformes éducatives et solutions e-learning",
    metaDescription: "Agence digitale pour l'éducation : plateformes e-learning, LMS, applications éducatives et campus virtuels au Maroc.",
  },
  {
    slug: "centres-langues",
    name: "Centres de Langues",
    nameEn: "Language Centers",
    description: "Marketing digital pour écoles et centres de langues",
    metaDescription: "Agence digitale pour centres de langues : sites web multilingues, inscriptions en ligne, tests de niveau et stratégie d'acquisition d'étudiants.",
  },
  {
    slug: "centres-formation",
    name: "Centres de Formation",
    nameEn: "Training Centers",
    description: "Solutions digitales pour organismes de formation",
    metaDescription: "Agence digitale pour centres de formation : plateformes de formation, LMS, catalogue de cours et solutions de certification en ligne.",
  },
  {
    slug: "automobile",
    name: "Automobile",
    nameEn: "Automotive",
    description: "Digital pour concessions, garages et services auto",
    metaDescription: "Agence digitale pour l'automobile : sites de concessions, catalogues véhicules, prise de rendez-vous en ligne et marketing auto.",
  },
  {
    slug: "location-voitures",
    name: "Location de Voitures",
    nameEn: "Car Rental",
    description: "Solutions web pour agences de location de véhicules",
    metaDescription: "Agence digitale pour la location de voitures : sites de réservation, flotte en ligne, système de gestion et SEO local pour agences de location.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    nameEn: "E-commerce",
    description: "Boutiques en ligne et plateformes de vente",
    metaDescription: "Agence e-commerce au Maroc : création de boutiques en ligne, marketplaces, solutions de paiement et stratégie de vente en ligne.",
  },
  {
    slug: "beaute",
    name: "Beauté & Bien-être",
    nameEn: "Beauty",
    description: "Digital pour salons, spas et centres esthétiques",
    metaDescription: "Agence digitale pour la beauté : sites de salons, réservation en ligne, portfolios de prestations et marketing digital pour centres esthétiques.",
  },
  {
    slug: "fitness",
    name: "Fitness & Sport",
    nameEn: "Fitness",
    description: "Solutions digitales pour salles de sport et coachs",
    metaDescription: "Agence digitale pour le fitness : sites de salles de sport, applications de coaching, gestion d'abonnements et marketing sportif.",
  },
  {
    slug: "comptabilite",
    name: "Comptabilité & Expertise",
    nameEn: "Accounting",
    description: "Présence en ligne pour cabinets comptables",
    metaDescription: "Agence digitale pour comptables : sites professionnels, portails clients sécurisés et solutions de gestion pour cabinets d'expertise comptable.",
  },
  {
    slug: "architecture",
    name: "Architecture & Design",
    nameEn: "Architecture",
    description: "Portfolios et solutions digitales pour architectes",
    metaDescription: "Agence digitale pour architectes : portfolios en ligne, visites 3D, présentations de projets et stratégie digitale pour cabinets d'architecture.",
  },
  {
    slug: "assurance",
    name: "Assurance",
    nameEn: "Insurance",
    description: "Solutions digitales pour agents et courtiers d'assurance",
    metaDescription: "Agence digitale pour l'assurance : sites de courtage, comparateurs en ligne, devis automatiques et gestion de contrats numériques.",
  },
  {
    slug: "ong",
    name: "ONG & Associations",
    nameEn: "NGO",
    description: "Présence digitale pour organisations à but non lucratif",
    metaDescription: "Agence digitale pour ONG : sites de collecte de fonds, plateformes de bénévolat, campagnes de sensibilisation et solutions de gestion associative.",
  },
  {
    slug: "industrie",
    name: "Industrie & Manufacturing",
    nameEn: "Manufacturing",
    description: "Transformation digitale pour l'industrie et la production",
    metaDescription: "Agence digitale pour l'industrie : sites B2B, catalogues produits, solutions IoT et plateformes de gestion industrielle au Maroc.",
  },
]

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug)
}

export const sectorServiceMapping: { serviceSlug: string; title: string; description: string }[] = [
  {
    serviceSlug: "web-development",
    title: "Développement Web pour le Secteur {sector}",
    description: "Nous créons des sites web et applications sur mesure adaptés aux besoins spécifiques du secteur {sector}. De la conception à la maintenance, notre équipe vous accompagne pour développer votre présence en ligne avec des solutions performantes et sécurisées.",
  },
  {
    serviceSlug: "seo",
    title: "Référencement SEO pour le Secteur {sector}",
    description: "Optimisez votre visibilité dans le secteur {sector} grâce à notre stratégie SEO spécialisée. Audit technique, optimisation du contenu, netlinking et SEO local pour attirer plus de clients qualifiés dans votre secteur.",
  },
  {
    serviceSlug: "digital-marketing",
    title: "Marketing Digital pour le Secteur {sector}",
    description: "Développez votre activité dans le secteur {sector} avec nos stratégies marketing digital sur mesure : campagnes publicitaires, contenu ciblé, réseaux sociaux et email marketing adaptés à votre secteur d'activité.",
  },
  {
    serviceSlug: "branding-design",
    title: "Branding & Design pour le Secteur {sector}",
    description: "Créez une identité visuelle forte dans le secteur {sector}. Logo, charte graphique, site web et supports de communication conçus pour marquer les esprits et inspirer confiance dans votre secteur.",
  },
]

export function getSectorServiceMapping(serviceSlug: string) {
  return sectorServiceMapping.find((m) => m.serviceSlug === serviceSlug)
}
