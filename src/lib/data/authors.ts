export interface AuthorProfile {
  name: string
  slug: string
  jobTitle: string
  bio: string
  shortBio: string
  image?: string
  linkedin?: string
  twitter?: string
  github?: string
}

export const authors: AuthorProfile[] = [
  {
    name: "Yassine El Khazouni",
    slug: "yassine-el-khazouni",
    jobTitle: "Co-fondateur & Lead Developer",
    bio: "Co-fondateur de Weblancia, Yassine est un développeur full-stack passionné par les technologies web modernes. Spécialiste de Next.js, React et Laravel, il conçoit des architectures performantes et scalables. Il partage son expertise à travers des articles techniques approfondis et forme la prochaine génération de développeurs via Weblancia Academy.",
    shortBio: "Co-fondateur & Lead Developer — Expert Next.js, React et Laravel",
    image: "/images/team/yassine.jpg",
    linkedin: "https://linkedin.com/in/yassine-el-khazouni",
    twitter: "https://twitter.com/yassineelk",
    github: "https://github.com/yassineelk",
  },
  {
    name: "Sara Benali",
    slug: "sara-benali",
    jobTitle: "Responsable Marketing Digital",
    bio: "Responsable Marketing Digital chez Weblancia, Sara est une experte en SEO, marketing de contenu et stratégies digitales. Elle accompagne les clients dans l'élaboration de stratégies de visibilité performantes et partage les dernières tendances du marketing digital à travers des articles et des ateliers.",
    shortBio: "Responsable Marketing Digital — Experte SEO & Stratégie de contenu",
    image: "/images/team/sara.jpg",
    linkedin: "https://linkedin.com/in/sara-benali",
    twitter: "https://twitter.com/sarabn",
  },
  {
    name: "Weblancia",
    slug: "weblancia",
    jobTitle: "Équipe Weblancia",
    bio: "L'équipe Weblancia regroupe des experts passionnés par le digital : développement web, design, marketing et SEO. Ensemble, nous partageons nos connaissances et les meilleures pratiques pour aider les entreprises à réussir leur transformation numérique.",
    shortBio: "L'équipe d'experts digitaux de Weblancia",
    image: "/images/og/og.svg",
    linkedin: "https://linkedin.com/company/weblancia",
  },
]

export function getAuthorByName(name: string): AuthorProfile | undefined {
  return authors.find((a) => a.name === name)
}

export function getAuthorBySlug(slug: string): AuthorProfile | undefined {
  return authors.find((a) => a.slug === slug)
}

export function getAuthorSlug(name: string): string {
  const author = getAuthorByName(name)
  return author?.slug ?? "weblancia"
}

export function getAuthorPageUrl(name: string): string {
  const slug = getAuthorSlug(name)
  return `/author/${slug}`
}
