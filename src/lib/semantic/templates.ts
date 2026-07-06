interface EntityInfo {
  name: string
  description: string
}

interface ServiceInfo {
  name: string
  slug: string
}

const serviceData: Record<string, ServiceInfo> = {
  seo: { name: "SEO", slug: "seo" },
  "web-development": { name: "Développement Web", slug: "web-development" },
  "digital-marketing": { name: "Marketing Digital", slug: "digital-marketing" },
  "branding-design": { name: "Branding & Design", slug: "branding-design" },
}

function getService(slug: string): ServiceInfo {
  return serviceData[slug] ?? { name: slug, slug }
}

export function generateIntro(dimension: string, entity: EntityInfo, serviceSlug: string): string {
  const svc = getService(serviceSlug)
  const intros: Record<string, string[]> = {
    problem: [
      `Vous faites face à un problème de ${entity.name.toLowerCase()} et cherchez une solution ${svc.name} adaptée ? Chez Weblancia, nous accompagnons les entreprises marocaines à résoudre ce défi avec des stratégies digitales sur mesure.`,
      `Le ${entity.name.toLowerCase()} freine la croissance de votre entreprise ? Notre expertise en ${svc.name.toLowerCase()} vous permet de surmonter cet obstacle et d'atteindre vos objectifs digitaux.`,
      `Ne laissez pas le ${entity.name.toLowerCase()} limiter votre potentiel. Notre agence ${svc.name.toLowerCase()} à Fès vous propose des solutions concrètes et mesurables pour transformer ce défi en opportunité.`,
    ],
    technology: [
      `Expert en ${entity.name}, Weblancia maîtrise cette technologie pour vous livrer des projets ${svc.name.toLowerCase()} performants et évolutifs, adaptés aux besoins des entreprises marocaines.`,
      `Vous cherchez une agence ${svc.name.toLowerCase()} spécialisée en ${entity.name} ? Notre équipe technique utilise cette technologie de pointe pour créer des solutions digitales robustes et innovantes.`,
      `La technologie ${entity.name} au service de votre stratégie ${svc.name.toLowerCase()}. Weblancia vous accompagne dans le développement de projets utilisant cette plateforme de référence.`,
    ],
    platform: [
      `Vous utilisez ${entity.name} pour votre activité et souhaitez optimiser votre présence avec des services ${svc.name.toLowerCase()} ? Weblancia est votre partenaire expert au Maroc.`,
      `Tirez le meilleur parti de ${entity.name} grâce à notre expertise en ${svc.name.toLowerCase()}. Nous vous aidons à maximiser le potentiel de cette plateforme pour votre entreprise.`,
      `Spécialiste ${entity.name} et ${svc.name.toLowerCase()}, Weblancia vous accompagne dans l'optimisation et le développement de votre présence sur cette plateforme.`,
    ],
  }
  const pool = intros[dimension] ?? intros.problem
  const idx = (entity.name.length + serviceSlug.length) % pool.length
  return pool[idx]
}

function generateFaq(
  dimension: string,
  entity: EntityInfo,
  serviceSlug: string,
  idx: number,
): { question: string; answer: string } {
  const svc = getService(serviceSlug)
  const entityLow = entity.name.toLowerCase()
  const entityCap = entity.name

  const allFaqs: Record<string, [string, string][]> = {
    problem: [
      [
        `Combien de temps faut-il pour résoudre un problème de ${entityLow} avec une stratégie ${svc.name} ?`,
        `La durée varie selon la complexité du ${entityLow} et des solutions ${svc.name} à mettre en place. En général, les premiers résultats visibles apparaissent sous 1 à 3 mois, avec une amélioration continue sur le long terme.`,
      ],
      [
        `Quel est le budget nécessaire pour traiter le ${entityLow} avec ${svc.name} ?`,
        `Le budget dépend de l'ampleur du ${entityLow} et des objectifs visés. Nous proposons des formules adaptées aux PME comme aux grandes entreprises. Contactez-nous pour un devis personnalisé gratuit.`,
      ],
      [
        `Comment mesure-t-on le succès d'une stratégie ${svc.name} face au ${entityLow} ?`,
        `Nous suivons des KPIs précis adaptés à votre situation : trafic qualifié, taux de conversion, positionnement Google, engagement utilisateur et ROI. Chaque stratégie est mesurable et optimisée en continu.`,
      ],
      [
        `Quelles sont les causes principales du ${entityLow} dans les entreprises marocaines ?`,
        `Les causes varient : manque d'expertise digitale interne, absence de stratégie structurée, outils inadaptés ou concurrence accrue. Notre audit ${svc.name} identifie les causes racines et propose un plan d'action ciblé.`,
      ],
      [
        `Faut-il traiter le ${entityLow} en priorité avant d'autres actions digitales ?`,
        `Oui, le ${entityLow} est souvent un frein majeur à la croissance digitale. Notre approche ${svc.name} priorise les actions à fort impact pour résoudre ce problème rapidement avant de déployer une stratégie plus large.`,
      ],
    ],
    technology: [
      [
        `Pourquoi choisir ${entityCap} pour un projet ${svc.name} ?`,
        `${entityCap} offre des performances, une flexibilité et une scalabilité idéales pour les projets ${svc.name}. Sa large communauté et son écosystème riche en font un choix fiable et pérenne pour les entreprises marocaines.`,
      ],
      [
        `Quels types de projets ${svc.name} peut-on réaliser avec ${entityCap} ?`,
        `${entityCap} permet de réaliser une grande variété de projets ${svc.name} : des sites vitrine aux applications complexes, en passant par les APIs, les dashboards et les plateformes e-commerce.`,
      ],
      [
        `Combien coûte un projet ${svc.name} avec ${entityCap} ?`,
        `Le coût dépend de la complexité du projet ${svc.name} et des fonctionnalités ${entityCap} nécessaires. Nous établissons un devis transparent après analyse de vos besoins spécifiques.`,
      ],
      [
        `Quelle est l'expertise de Weblancia sur ${entityCap} ?`,
        `Notre équipe maîtrise ${entityCap} depuis plusieurs années et a livré de nombreux projets ${svc.name} utilisant cette technologie. Nous suivons les meilleures pratiques et les dernières évolutions de l'écosystème.`,
      ],
      [
        `${entityCap} est-il adapté aux entreprises marocaines ?`,
        `Absolument. ${entityCap} est utilisé par des entreprises de toutes tailles au Maroc. Sa flexibilité permet de s'adapter aux besoins locaux tout en respectant les standards internationaux.`,
      ],
    ],
    platform: [
      [
        `Comment optimiser ma présence sur ${entityCap} avec ${svc.name} ?`,
        `Nous analysons votre utilisation actuelle de ${entityCap} et déployons une stratégie ${svc.name} adaptée : optimisation du contenu, amélioration de l'expérience utilisateur et déploiement de fonctionnalités avancées.`,
      ],
      [
        `Quels sont les avantages de ${entityCap} pour une stratégie ${svc.name} ?`,
        `${entityCap} offre des outils puissants pour le ${svc.name.toLowerCase()} : analytics intégrés, SEO-friendly, templates responsives et un écosystème d'applications et d'intégrations riche.`,
      ],
      [
        `Puis-je migrer vers ${entityCap} pour améliorer mon ${svc.name} ?`,
        `Oui, nous accompagnons les entreprises dans leur migration vers ${entityCap}. Notre processus de migration sécurisé garantit zéro perte de données et une continuité de votre stratégie ${svc.name}.`,
      ],
      [
        `Quel budget prévoir pour un projet ${entityCap} avec ${svc.name} ?`,
        `Le budget varie selon la taille du projet ${entityCap} et les objectifs ${svc.name}. Nous proposons des solutions adaptées à chaque budget, de l'optimisation ponctuelle au déploiement complet.`,
      ],
      [
        `${entityCap} est-il adapté aux entreprises marocaines ?`,
        `${entityCap} convient parfaitement aux entreprises marocaines. La plateforme supporte le multilinguisme (français, anglais, arabe), les devises locales et s'intègre avec les solutions de paiement populaires au Maroc.`,
      ],
    ],
  }

  const pool = allFaqs[dimension] ?? allFaqs.problem
  return { question: pool[idx % pool.length][0], answer: pool[idx % pool.length][1] }
}

export function generateFaqs(
  dimension: string,
  entity: EntityInfo,
  serviceSlug: string,
  count: number = 3,
): { question: string; answer: string }[] {
  return Array.from({ length: count }, (_, i) => generateFaq(dimension, entity, serviceSlug, i))
}

export function generateCta(
  dimension: string,
  entity: EntityInfo,
  serviceSlug: string,
): { headline: string; subheadline: string; label: string; href: string } {
  const svc = getService(serviceSlug)
  const entityLow = entity.name.toLowerCase()

  const ctas: Record<string, { headline: string; subheadline: string }[]> = {
    problem: [
      {
        headline: `Prêt à résoudre votre problème de ${entityLow} ?`,
        subheadline: `Notre équipe ${svc.name} est prête à vous accompagner. Discutons de votre situation et trouvons la meilleure solution pour votre entreprise.`,
      },
      {
        headline: `Ne laissez plus le ${entityLow} freiner votre croissance`,
        subheadline: `Contactez nos experts ${svc.name} dès aujourd'hui pour un diagnostic gratuit et des recommandations personnalisées.`,
      },
    ],
    technology: [
      {
        headline: `Prêt à démarrer votre projet ${entity.name} ?`,
        subheadline: `Notre équipe d'experts ${svc.name} spécialisée ${entity.name} vous accompagne de la conception à la mise en production.`,
      },
      {
        headline: `Vous avez un projet ${svc.name} avec ${entity.name} ?`,
        subheadline: `Discutons de vos besoins et découvrez comment notre expertise ${entity.name} peut transformer votre vision en réalité.`,
      },
    ],
    platform: [
      {
        headline: `Optimisez votre présence sur ${entity.name} dès maintenant`,
        subheadline: `Notre équipe ${svc.name} experte ${entity.name} vous aide à tirer le meilleur parti de cette plateforme.`,
      },
      {
        headline: `Vous utilisez ${entity.name} ? Nous pouvons vous aider`,
        subheadline: `Contactez nos experts ${svc.name} pour un audit gratuit de votre présence sur ${entity.name} et des recommandations personnalisées.`,
      },
    ],
  }

  const pool = ctas[dimension] ?? ctas.problem
  const idx = entity.name.length % pool.length
  const selected = pool[idx]
  return { ...selected, label: "Nous contacter", href: "/contact" }
}

export function generateServiceDescription(entity: EntityInfo, serviceSlug: string): string {
  const svc = getService(serviceSlug)
  return `Notre service ${svc.name} chez Weblancia est conçu pour répondre spécifiquement aux besoins liés à ${entity.name.toLowerCase()}. Nous combinons expertise technique, approche stratégique et connaissance du marché marocain pour vous offrir des solutions digitales performantes et adaptées à votre contexte.`
}
