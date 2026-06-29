import { getProvider } from "./providers"

export const aiConfig = {
  provider: (process.env.AI_PROVIDER ?? "gemini").toLowerCase(),
  language: process.env.AI_LANGUAGE ?? "fr",
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
  },
  quality: {
    minWords: 1500,
    minH2: 5,
    minH3: 3,
  },
  defaultCoverImage: "/images/blog/default-cover.jpg",
  ctaVariations: [
    "Vous souhaitez améliorer votre visibilité en ligne ? Contactez Weblancia, votre agence web au Maroc, pour un audit gratuit de votre stratégie digitale.",
    "Besoin d'un site web professionnel ou d'une stratégie SEO performante ? Weblancia vous accompagne de A à Z. Demandez votre devis gratuit dès aujourd'hui.",
    "Prêt à propulser votre entreprise sur le web ? L'équipe Weblancia vous propose des solutions digitales sur mesure. Prenez rendez-vous pour une consultation personnalisée.",
    "Transformez votre présence en ligne avec Weblancia. De la création de site à la stratégie marketing, nous sommes votre partenaire digital au Maroc. Contactez-nous !",
    "Ne laissez pas votre concurrence vous devancer. Weblancia vous aide à conquérir le web avec des stratégies innovantes et un accompagnement expert. Parlez-nous de votre projet.",
  ],
} as const

export function isAiAvailable(): boolean {
  return getProvider() !== null
}
