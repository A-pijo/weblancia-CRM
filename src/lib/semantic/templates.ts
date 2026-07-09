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
    sector: [
      `Vous travaillez dans le secteur ${entity.name} et cherchez des services ${svc.name.toLowerCase()} adaptés ? Weblancia comprend les enjeux spécifiques de votre secteur et propose des solutions digitales sur mesure pour les entreprises marocaines.`,
      `Le secteur ${entity.name} évolue rapidement. Notre expertise en ${svc.name.toLowerCase()} vous aide à rester compétitif avec des stratégies digitales adaptées aux défis de votre industrie.`,
      `Transformez votre présence digitale dans le secteur ${entity.name} avec nos services ${svc.name.toLowerCase()}. Weblancia vous accompagne avec des solutions concrètes et mesurables.`,
    ],
    city: [
      `Vous êtes basé à ${entity.name} et cherchez une agence ${svc.name.toLowerCase()} de confiance ? Weblancia vous propose ses services adaptés aux entreprises de ${entity.name} et de toute la région.`,
      `Besoin de services ${svc.name.toLowerCase()} à ${entity.name} ? Notre équipe intervient dans toute la région pour accompagner les entreprises locales dans leur transformation digitale.`,
      `Weblancia étend son expertise ${svc.name.toLowerCase()} aux entreprises de ${entity.name}. Profitez de solutions digitales professionnelles sans quitter votre ville.`,
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
    sector: [
      [
        `Pourquoi le secteur ${entityLow} a-t-il besoin de services ${svc.name} ?`,
        `Le secteur ${entityLow} fait face à des défis digitaux spécifiques : concurrence accrue, attentes clients élevées et nécessité d'innovation. Notre expertise ${svc.name} vous aide à relever ces défis avec des solutions adaptées à votre secteur.`,
      ],
      [
        `Quels sont les avantages du ${svc.name.toLowerCase()} pour le secteur ${entityLow} ?`,
        `Le ${svc.name.toLowerCase()} permet aux acteurs du secteur ${entityLow} d'optimiser leur visibilité, d'attirer plus de clients et d'améliorer leur efficacité opérationnelle. Nous adaptons chaque stratégie aux spécificités de votre secteur.`,
      ],
      [
        `Combien coûte une stratégie ${svc.name} pour le secteur ${entityLow} ?`,
        `Le coût varie selon la taille de votre entreprise, vos objectifs et la complexité des solutions ${svc.name} à mettre en place. Nous proposons des formules adaptées aux PME comme aux grands groupes du secteur ${entityLow}.`,
      ],
      [
        `Quels résultats attendre d'une stratégie ${svc.name} dans le secteur ${entityLow} ?`,
        `Les résultats varient selon les objectifs : augmentation du trafic, amélioration du taux de conversion, croissance du chiffre d'affaires en ligne ou renforcement de la notoriété. Nous définissons des KPIs précis avec vous.`,
      ],
      [
        `Weblancia a-t-elle de l'expérience dans le secteur ${entityLow} ?`,
        `Oui, notre équipe a accompagné de nombreuses entreprises du secteur ${entityLow} au Maroc. Nous comprenons les enjeux spécifiques, la réglementation et les tendances de votre secteur pour vous offrir des solutions pertinentes.`,
      ],
    ],
    city: [
      [
        `Pourquoi choisir Weblancia pour des services ${svc.name} à ${entityCap} ?`,
        `Weblancia combine expertise technique, connaissance du marché marocain et approche personnalisée. Nous intervenons à ${entityCap} et dans toute la région pour offrir des solutions ${svc.name} de qualité aux entreprises locales.`,
      ],
      [
        `Quels services ${svc.name} proposez-vous à ${entityCap} ?`,
        `Nous proposons une gamme complète de services ${svc.name} à ${entityCap} : audit, stratégie, développement, optimisation et maintenance. Chaque prestation est adaptée aux besoins spécifiques des entreprises de ${entityCap}.`,
      ],
      [
        `Quels sont les délais pour un projet ${svc.name} à ${entityCap} ?`,
        `Les délais dépendent de l'ampleur du projet ${svc.name}. Comptez 2 à 4 semaines pour un audit et des recommandations, et 1 à 3 mois pour un déploiement complet. Nous nous adaptons à votre planning.`,
      ],
      [
        `Les entreprises de ${entityCap} bénéficient-elles d'un avantage concurrentiel avec ${svc.name} ?`,
        `Absolument. Les entreprises de ${entityCap} qui investissent dans une stratégie ${svc.name} se démarquent de leurs concurrents locaux. C'est un investissement rentable pour gagner des parts de marché.`,
      ],
      [
        `Proposez-vous des rendez-vous en présentiel à ${entityCap} ?`,
        `Oui, notre équipe se déplace à ${entityCap} pour des rendez-vous et des ateliers de travail. Nous combinons interventions sur site et suivi à distance pour une flexibilité maximale.`,
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
    sector: [
      {
        headline: `Prêt à développer votre projet dans le secteur ${entityLow} ?`,
        subheadline: `Notre équipe ${svc.name} spécialisée dans le secteur ${entityLow} vous accompagne avec des solutions sur mesure.`,
      },
      {
        headline: `Vous travaillez dans le secteur ${entityLow} ?`,
        subheadline: `Contactez nos experts ${svc.name} pour un diagnostic gratuit de votre présence digitale et des recommandations adaptées à votre secteur.`,
      },
    ],
    city: [
      {
        headline: `Besoin de services ${svc.name} à ${entity.name} ?`,
        subheadline: `Contactez notre équipe pour discuter de votre projet ${svc.name} à ${entity.name}. Nous intervenons dans toute la région.`,
      },
      {
        headline: `Vous êtes à ${entity.name} et cherchez une agence ${svc.name} ?`,
        subheadline: `Discutons de vos besoins et découvrez comment Weblancia peut accompagner votre entreprise à ${entity.name}.`,
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
