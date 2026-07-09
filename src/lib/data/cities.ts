export interface City {
  slug: string
  name: string
  nameEn: string
  region: string
  latitude: number
  longitude: number
  description: string
  metaDescription: string
}

export const cities: City[] = [
  {
    slug: "casablanca",
    name: "Casablanca",
    nameEn: "Casablanca",
    region: "Grand Casablanca",
    latitude: 33.5731,
    longitude: -7.5898,
    description: "Capitale économique du Maroc",
    metaDescription: "Agence digitale à Casablanca : développement web, SEO et marketing digital pour les entreprises casablancaises.",
  },
  {
    slug: "rabat",
    name: "Rabat",
    nameEn: "Rabat",
    region: "Rabat-Salé-Kénitra",
    latitude: 34.0209,
    longitude: -6.8416,
    description: "Capitale administrative du Maroc",
    metaDescription: "Agence digitale à Rabat : développement web, SEO et marketing digital pour les entreprises de la capitale.",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    nameEn: "Marrakech",
    region: "Marrakech-Safi",
    latitude: 31.6295,
    longitude: -7.9811,
    description: "Ville impériale et pôle touristique",
    metaDescription: "Agence digitale à Marrakech : développement web, SEO et marketing digital pour les entreprises marrakchies.",
  },
  {
    slug: "fes",
    name: "Fès",
    nameEn: "Fes",
    region: "Fès-Meknès",
    latitude: 34.020882,
    longitude: -5.018105,
    description: "Capitale spirituelle et culturelle du Maroc",
    metaDescription: "Agence digitale à Fès : développement web, SEO et marketing digital pour les entreprises fassies.",
  },
  {
    slug: "tanger",
    name: "Tanger",
    nameEn: "Tangier",
    region: "Tanger-Tétouan-Al Hoceïma",
    latitude: 35.7673,
    longitude: -5.7998,
    description: "Ville du détroit et hub international",
    metaDescription: "Agence digitale à Tanger : développement web, SEO et marketing digital pour les entreprises tangéroises.",
  },
  {
    slug: "agadir",
    name: "Agadir",
    nameEn: "Agadir",
    region: "Souss-Massa",
    latitude: 30.4278,
    longitude: -9.5981,
    description: "Station balnéaire et pôle touristique",
    metaDescription: "Agence digitale à Agadir : développement web, SEO et marketing digital pour les entreprises de la région Souss.",
  },
  {
    slug: "meknes",
    name: "Meknès",
    nameEn: "Meknes",
    region: "Fès-Meknès",
    latitude: 33.8815,
    longitude: -5.5739,
    description: "Ville impériale et patrimoine historique",
    metaDescription: "Agence digitale à Meknès : développement web, SEO et marketing digital pour les entreprises meknassies.",
  },
  {
    slug: "oujda",
    name: "Oujda",
    nameEn: "Oujda",
    region: "Oriental",
    latitude: 34.6814,
    longitude: -1.9106,
    description: "Capitale de l'Oriental",
    metaDescription: "Agence digitale à Oujda : développement web, SEO et marketing digital pour les entreprises de la région orientale.",
  },
  {
    slug: "kenitra",
    name: "Kénitra",
    nameEn: "Kenitra",
    region: "Rabat-Salé-Kénitra",
    latitude: 34.261,
    longitude: -6.5802,
    description: "Pôle industriel et portuaire",
    metaDescription: "Agence digitale à Kénitra : développement web, SEO et marketing digital pour les entreprises de la région du Gharb.",
  },
  {
    slug: "tetouan",
    name: "Tétouan",
    nameEn: "Tetouan",
    region: "Tanger-Tétouan-Al Hoceïma",
    latitude: 35.5734,
    longitude: -5.3737,
    description: "Ville andalouse et culturelle",
    metaDescription: "Agence digitale à Tétouan : développement web, SEO et marketing digital pour les entreprises tétonnaises.",
  },
  {
    slug: "el-jadida",
    name: "El Jadida",
    nameEn: "El Jadida",
    region: "Casablanca-Settat",
    latitude: 33.2351,
    longitude: -8.5017,
    description: "Ville côtière et portuaire",
    metaDescription: "Agence digitale à El Jadida : développement web, SEO et marketing digital pour les entreprises de la région Doukkala.",
  },
  {
    slug: "nador",
    name: "Nador",
    nameEn: "Nador",
    region: "Oriental",
    latitude: 35.1688,
    longitude: -2.9335,
    description: "Pôle économique du Rif oriental",
    metaDescription: "Agence digitale à Nador : développement web, SEO et marketing digital pour les entreprises de la région du Rif.",
  },
  {
    slug: "safi",
    name: "Safi",
    nameEn: "Safi",
    region: "Marrakech-Safi",
    latitude: 32.2994,
    longitude: -9.2372,
    description: "Capitale de l'industrie chimique",
    metaDescription: "Agence digitale à Safi : développement web, SEO et marketing digital pour les entreprises safiotes.",
  },
  {
    slug: "beni-mellal",
    name: "Béni Mellal",
    nameEn: "Beni Mellal",
    region: "Béni Mellal-Khénifra",
    latitude: 32.335,
    longitude: -6.3609,
    description: "Capitale du Tadla",
    metaDescription: "Agence digitale à Béni Mellal : développement web, SEO et marketing digital pour les entreprises de la région Tadla.",
  },
  {
    slug: "mohammedia",
    name: "Mohammedia",
    nameEn: "Mohammedia",
    region: "Grand Casablanca",
    latitude: 33.6862,
    longitude: -7.3829,
    description: "Ville industrielle et portuaire",
    metaDescription: "Agence digitale à Mohammedia : développement web, SEO et marketing digital pour les entreprises mohammadiennes.",
  },
  {
    slug: "temara",
    name: "Témara",
    nameEn: "Temara",
    region: "Rabat-Salé-Kénitra",
    latitude: 33.9267,
    longitude: -6.9128,
    description: "Ville résidentielle et côtière",
    metaDescription: "Agence digitale à Témara : développement web, SEO et marketing digital pour les entreprises de la région de Rabat.",
  },
  {
    slug: "khouribga",
    name: "Khouribga",
    nameEn: "Khouribga",
    region: "Béni Mellal-Khénifra",
    latitude: 32.8811,
    longitude: -6.9063,
    description: "Capitale mondiale des phosphates",
    metaDescription: "Agence digitale à Khouribga : développement web, SEO et marketing digital pour les entreprises de la région des phosphates.",
  },
  {
    slug: "errachidia",
    name: "Errachidia",
    nameEn: "Errachidia",
    region: "Drâa-Tafilalet",
    latitude: 31.9317,
    longitude: -4.4244,
    description: "Porte du désert et du Tafilalet",
    metaDescription: "Agence digitale à Errachidia : développement web, SEO et marketing digital pour les entreprises de la région du Tafilalet.",
  },
  {
    slug: "larache",
    name: "Larache",
    nameEn: "Larache",
    region: "Tanger-Tétouan-Al Hoceïma",
    latitude: 35.1889,
    longitude: -6.1456,
    description: "Ville côtière et historique",
    metaDescription: "Agence digitale à Larache : développement web, SEO et marketing digital pour les entreprises de la région du Loukkos.",
  },
  {
    slug: "khemisset",
    name: "Khémisset",
    nameEn: "Khemisset",
    region: "Rabat-Salé-Kénitra",
    latitude: 33.8107,
    longitude: -6.0697,
    description: "Ville agricole et industrielle",
    metaDescription: "Agence digitale à Khémisset : développement web, SEO et marketing digital pour les entreprises de la région de Khémisset.",
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

export const cityServiceMapping: { serviceSlug: string; title: string; description: string }[] = [
  {
    serviceSlug: "seo",
    title: "Services SEO pour {city} — Référencement Naturel",
    description: "Expert en référencement naturel pour les entreprises de {city}. Notre agence basée à Fès optimise votre visibilité sur Google grâce à une stratégie SEO complète : audit technique, netlinking, contenu optimisé et SEO local. Attirez plus de clients dans la région {region}.",
  },
  {
    serviceSlug: "web-development",
    title: "Services Web pour {city} — Création de Sites Internet",
    description: "Services de développement web pour les entreprises de {city}. Notre équipe basée à Fès crée des sites internet performants, des applications web sur mesure et des plateformes e-commerce adaptés aux besoins de {city} et sa région.",
  },
  {
    serviceSlug: "digital-marketing",
    title: "Services Marketing Digital pour {city} — Stratégie Digitale",
    description: "Services de marketing digital pour les entreprises de {city}. Depuis Fès, nous déployons des stratégies digitales complètes : SEO, SEA, réseaux sociaux, content marketing et emailing pour développer votre présence en ligne dans la région {region}.",
  },
  {
    serviceSlug: "branding-design",
    title: "Services Branding & Design pour {city} — Identité Visuelle",
    description: "Services de branding et design pour les entreprises de {city}. Depuis notre agence à Fès, nous créons des identités visuelles marquantes, des logos professionnels et des chartes graphiques qui démarquent votre entreprise.",
  },
]

export function getLocalServiceMapping(serviceSlug: string) {
  return cityServiceMapping.find((m) => m.serviceSlug === serviceSlug)
}
