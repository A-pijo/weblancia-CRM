export interface Technology {
  slug: string
  name: string
  category: string
  description: string
  metaDescription: string
}

export const technologies: Technology[] = [
  {
    slug: "wordpress",
    name: "WordPress",
    category: "CMS",
    description: "Le CMS le plus populaire au monde",
    metaDescription: "Développement WordPress sur mesure : thèmes personnalisés, plugins, optimisation performance et maintenance pour votre site WordPress.",
  },
  {
    slug: "laravel",
    name: "Laravel",
    category: "Backend",
    description: "Framework PHP moderne et élégant",
    metaDescription: "Développement Laravel : applications web robustes, API RESTful, backend sur mesure et solutions d'entreprise avec le framework PHP leader.",
  },
  {
    slug: "react",
    name: "React",
    category: "Frontend",
    description: "Bibliothèque JavaScript pour des interfaces utilisateur réactives",
    metaDescription: "Développement React : applications web modernes, composants réutilisables, single-page applications et interfaces utilisateur dynamiques.",
  },
  {
    slug: "nextjs",
    name: "Next.js",
    category: "Full-Stack",
    description: "Framework React pour la production",
    metaDescription: "Développement Next.js : applications full-stack performantes, SSR, SSG, API routes et SEO optimisé avec le framework React de référence.",
  },
  {
    slug: "shopify",
    name: "Shopify",
    category: "E-commerce",
    description: "Plateforme e-commerce tout-en-un",
    metaDescription: "Développement Shopify : boutiques en ligne, thèmes personnalisés, applications Shopify et solutions e-commerce clés en main.",
  },
  {
    slug: "vuejs",
    name: "Vue.js",
    category: "Frontend",
    description: "Framework JavaScript progressif",
    metaDescription: "Développement Vue.js : applications web progressives, composants réactifs et interfaces utilisateur modernes avec le framework JavaScript Vue.js.",
  },
  {
    slug: "python",
    name: "Python",
    category: "Backend",
    description: "Langage de programmation polyvalent",
    metaDescription: "Développement Python : applications backend, data science, automatisation et intelligence artificielle avec le langage Python et ses frameworks.",
  },
  {
    slug: "flutter",
    name: "Flutter",
    category: "Mobile",
    description: "Kit UI pour applications mobiles cross-platform",
    metaDescription: "Développement Flutter : applications mobiles iOS et Android, interface utilisateur native et performances optimales avec le framework Google.",
  },
]

export function getTechnologyBySlug(slug: string): Technology | undefined {
  return technologies.find((t) => t.slug === slug)
}
