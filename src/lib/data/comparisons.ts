export interface ComparisonRow {
  aspect: string
  aValue: string
  bValue: string
}

export interface ComparisonFaq {
  question: string
  answer: string
}

export interface Comparison {
  slug: string
  itemA: string
  itemB: string
  itemASlug: string
  itemBSlug: string
  title: string
  description: string
  metaDescription: string
  intro: string
  prosA: string[]
  consA: string[]
  prosB: string[]
  consB: string[]
  table: ComparisonRow[]
  faqs: ComparisonFaq[]
}

export const comparisons: Comparison[] = [
  {
    slug: "seo-vs-google-ads",
    itemA: "SEO",
    itemB: "Google Ads",
    itemASlug: "seo",
    itemBSlug: "google-ads",
    title: "SEO vs Google Ads : Quelle stratégie choisir ?",
    description: "Comparatif détaillé entre SEO et Google Ads pour votre stratégie marketing digital au Maroc.",
    metaDescription: "SEO ou Google Ads ? Comparez les avantages, inconvénients et coûts de chaque stratégie pour choisir celle qui correspond à vos objectifs marketing au Maroc.",
    intro: "Le SEO (référencement naturel) et Google Ads (référencement payant) sont deux piliers du marketing digital. Chacun a ses forces, ses faiblesses et ses cas d'usage idéaux. Ce comparatif vous aide à déterminer quelle stratégie — ou quelle combinaison — convient le mieux à votre entreprise.",
    prosA: [
      "Résultats durables dans le temps",
      "Trafic gratuit et continu",
      "Crédibilité et confiance accrues auprès des utilisateurs",
      "ROI supérieur sur le long terme",
      "Effet cumulatif avec le temps",
    ],
    consA: [
      "Résultats lents (3 à 6 mois avant les premiers effets)",
      "Nécessite une expertise technique pointue",
      "Investissement en temps important",
      "Résultats non garantis face aux mises à jour Google",
    ],
    prosB: [
      "Résultats immédiats et visibles",
      "Contrôle total du budget et des enchères",
      "Ciblage précis (localisation, horaires, appareils)",
      "Mesure précise du ROI",
      "Flexibilité et ajustements en temps réel",
    ],
    consB: [
      "Coût récurrent : vous payez par clic",
      "Résultats stoppés dès l'arrêt des campagnes",
      "Concurrence accrue sur les mots-clés populaires",
      "Nécessite une gestion et une optimisation constantes",
    ],
    table: [
      { aspect: "Délai de résultats", aValue: "3 à 6 mois", bValue: "Immédiat" },
      { aspect: "Coût", aValue: "Gratuit (hors prestation)", bValue: "Payant par clic" },
      { aspect: "Durabilité", aValue: "Effets durables", bValue: "Stop dès l'arrêt" },
      { aspect: "Crédibilité perçue", aValue: "Forte (position naturelle)", bValue: "Moyenne (mention 'Annonce')" },
      { aspect: "Ciblage", aValue: "Par mots-clés", bValue: "Très avancé (localisation, centre d'intérêt)" },
      { aspect: "Contrôle du budget", aValue: "Budget fixe", bValue: "Flexible et ajustable" },
      { aspect: "ROI long terme", aValue: "Excellent", bValue: "Moyen à bon" },
      { aspect: "Complexité", aValue: "Élevée", bValue: "Moyenne" },
      { aspect: "Testabilité", aValue: "Lente", bValue: "Rapide (A/B testing)" },
      { aspect: "Trafic", aValue: "Organique (gratuit)", bValue: "Payant" },
    ],
    faqs: [
      { question: "Faut-il choisir le SEO ou Google Ads pour une nouvelle entreprise ?", answer: "Pour une nouvelle entreprise, nous recommandons une approche combinée : commencez par Google Ads pour obtenir des résultats immédiats pendant que vous construisez votre stratégie SEO pour le long terme. Cela vous permet de générer du trafic dès le premier jour tout en préparant une croissance durable." },
      { question: "Quelle stratégie offre le meilleur ROI au Maroc ?", answer: "Le SEO offre généralement un meilleur ROI sur le long terme car le trafic est gratuit une fois les positions acquises. Cependant, Google Ads peut offrir un ROI intéressant pour des campagnes bien ciblées sur des mots-clés commerciaux, surtout dans les secteurs concurrentiels au Maroc." },
      { question: "Peut-on combiner SEO et Google Ads ?", answer: "Absolument, et c'est souvent la meilleure approche. Le SEO construit votre autorité à long terme pendant que Google Ads génère du trafic immédiat sur vos offres clés. Les données des deux canaux s'enrichissent mutuellement." },
      { question: "Quel budget minimum pour Google Ads au Maroc ?", answer: "Une campagne Google Ads au Maroc peut démarrer avec 5 000 à 10 000 MAD par mois pour être efficace. En dessous, le volume de clics est trop faible pour générer des résultats significatifs." },
      { question: "Le SEO est-il toujours pertinent avec Google Ads ?", answer: "Oui, le SEO reste indispensable car il construit votre crédibilité en ligne de manière durable. 70% des clics vont aux résultats organiques, et les utilisateurs font davantage confiance aux sites bien positionnés naturellement." },
    ],
  },
  {
    slug: "website-vs-landing-page",
    itemA: "Site Web Complet",
    itemB: "Landing Page",
    itemASlug: "site-web",
    itemBSlug: "landing-page",
    title: "Site Web vs Landing Page : Que choisir ?",
    description: "Comparatif entre site web complet et landing page pour vos objectifs marketing.",
    metaDescription: "Site web complet ou landing page ? Découvrez les différences, avantages et cas d'usage de chaque solution pour votre stratégie digitale au Maroc.",
    intro: "Site web complet et landing page répondent à des besoins différents. L'un est votre vitrine institutionnelle, l'autre est un outil de conversion ciblé. Ce comparatif vous aide à choisir la meilleure option selon vos objectifs.",
    prosA: [
      "Présentation complète de votre entreprise",
      "Multi-pages pour un contenu riche (blog, services, portfolio)",
      "Meilleur référencement SEO global",
      "Crédibilité et professionnalisme renforcés",
    ],
    consA: [
      "Délai de création plus long (4 à 8 semaines)",
      "Coût plus élevé",
      "Maintenance plus complexe",
      "Taux de conversion parfois inférieur (dispersion)",
    ],
    prosB: [
      "Création rapide (quelques jours)",
      "Coût réduit",
      "Focalisée sur un seul objectif (conversion)",
      "Idéale pour les campagnes publicitaires",
      "Facile à tester et optimiser (A/B testing)",
    ],
    consB: [
      "Informations limitées (une seule page)",
      "SEO limité (peu de contenu à indexer)",
      "Moins professionnelle pour certains secteurs",
      "Difficile de présenter une gamme complète de services",
    ],
    table: [
      { aspect: "Délai de création", aValue: "4 à 8 semaines", bValue: "2 à 5 jours" },
      { aspect: "Coût", aValue: "15 000 à 50 000 MAD", bValue: "3 000 à 8 000 MAD" },
      { aspect: "Pages", aValue: "5 à 50+ pages", bValue: "1 page" },
      { aspect: "SEO", aValue: "Excellent", bValue: "Limité" },
      { aspect: "Taux de conversion", aValue: "1-3% en moyenne", bValue: "5-15% en moyenne" },
      { aspect: "Maintenance", aValue: "Continue", bValue: "Minimale" },
      { aspect: "Objectif principal", aValue: "Présentation globale", bValue: "Conversion ciblée" },
      { aspect: "A/B testing", aValue: "Complexe", bValue: "Simple et rapide" },
    ],
    faqs: [
      { question: "Quand utiliser un site web plutôt qu'une landing page ?", answer: "Utilisez un site web complet quand vous devez présenter plusieurs services, un portfolio, un blog ou des pages institutionnelles. C'est indispensable pour les entreprises qui veulent une présence en ligne complète et un bon référencement SEO." },
      { question: "Quand une landing page est-elle suffisante ?", answer: "Une landing page est idéale pour une campagne publicitaire ciblée, le lancement d'un produit spécifique, une offre promotionnelle ou la collecte de leads sur un sujet unique. Elle concentre l'attention du visiteur sur une seule action." },
      { question: "Peut-on avoir les deux ?", answer: "Oui, c'est même recommandé ! Votre site web sert de vitrine institutionnelle, et vous créez des landing pages spécifiques pour chaque campagne marketing ou offre promotionnelle." },
    ],
  },
  {
    slug: "wordpress-vs-nextjs",
    itemA: "WordPress",
    itemB: "Next.js",
    itemASlug: "wordpress",
    itemBSlug: "nextjs",
    title: "WordPress vs Next.js : Quel CMS choisir ?",
    description: "Comparatif entre WordPress et Next.js pour votre projet web au Maroc.",
    metaDescription: "WordPress ou Next.js ? Comparez les performances, la flexibilité et les cas d'usage de chaque technologie pour choisir la meilleure solution pour votre site web au Maroc.",
    intro: "WordPress domine le marché des CMS depuis 20 ans, tandis que Next.js représente la nouvelle génération du développement web. Ce comparatif vous aide à choisir la technologie adaptée à votre projet.",
    prosA: [
      "Facilité d'utilisation et interface intuitive",
      "Écosystème immense de thèmes et plugins",
      "Communauté large et support abondant",
      "Idéal pour le blogging et les sites de contenu",
      "Maintenance simplifiée pour les non-techniciens",
    ],
    consA: [
      "Performances limitées sans optimisation poussée",
      "Sécurité vulnérable (plugins, mises à jour)",
      "Scalabilité limitée pour les gros volumes",
      "Technologie vieillissante (PHP)",
    ],
    prosB: [
      "Performances exceptionnelles (SSR, SSG)",
      "Sécurité renforcée (surface d'attaque réduite)",
      "Scalabilité parfaite pour tous les volumes",
      "Développement moderne (React, TypeScript)",
      "SEO optimal avec server-side rendering",
    ],
    consB: [
      "Nécessite des compétences techniques avancées",
      "Coût de développement plus élevé",
      "Écosystème plus restreint que WordPress",
      "Maintenance technique requise",
    ],
    table: [
      { aspect: "Facilité d'utilisation", aValue: "Très facile", bValue: "Technique" },
      { aspect: "Performances", aValue: "Moyennes", bValue: "Excellent" },
      { aspect: "Sécurité", aValue: "Moyenne", bValue: "Élevée" },
      { aspect: "SEO", aValue: "Bon", bValue: "Excellent" },
      { aspect: "Scalabilité", aValue: "Limitée", bValue: "Parfaite" },
      { aspect: "Coût développement", aValue: "3 000 à 15 000 MAD", bValue: "15 000 à 60 000 MAD" },
      { aspect: "Maintenance", aValue: "Simple", bValue: "Technique" },
      { aspect: "Personnalisation", aValue: "Via plugins", bValue: "Totale" },
      { aspect: "Blog", aValue: "Excellent", bValue: "Bon" },
      { aspect: "E-commerce", aValue: "Avec WooCommerce", bValue: "Avec headless CMS" },
    ],
    faqs: [
      { question: "WordPress est-il mort face à Next.js ?", answer: "Pas du tout. WordPress reste excellent pour les sites de contenu, les blogs et les petites entreprises qui veulent une solution clé en main facile à gérer sans compétences techniques. Next.js est plus adapté aux projets qui nécessitent des performances élevées et une scalabilité importante." },
      { question: "Quel est le meilleur choix pour le SEO ?", answer: "Next.js offre un avantage SEO significatif grâce à son server-side rendering, ses Core Web Vitals optimisés et sa vitesse d'affichage supérieure. Cependant, un WordPress bien optimisé peut aussi atteindre d'excellents résultats SEO." },
      { question: "Puis-je migrer de WordPress à Next.js ?", answer: "Oui, c'est possible et nous accompagnons les entreprises dans cette migration. Elle permet de passer à une architecture plus performante tout en conservant votre contenu existant." },
    ],
  },
  {
    slug: "shopify-vs-woocommerce",
    itemA: "Shopify",
    itemB: "WooCommerce",
    itemASlug: "shopify",
    itemBSlug: "woocommerce",
    title: "Shopify vs WooCommerce : Quelle plateforme e-commerce ?",
    description: "Comparatif détaillé entre Shopify et WooCommerce pour votre boutique en ligne au Maroc.",
    metaDescription: "Shopify ou WooCommerce ? Comparez les fonctionnalités, coûts et avantages de chaque plateforme e-commerce pour choisir la meilleure solution pour votre boutique en ligne au Maroc.",
    intro: "Shopify et WooCommerce sont les deux solutions e-commerce les plus populaires au monde. Shopify est une plateforme clé en main tandis que WooCommerce est un plugin WordPress open-source. Ce comparatif vous aide à choisir selon vos besoins.",
    prosA: [
      "Solution clé en main, hébergement inclus",
      "Interface intuitive et facile à prendre en main",
      "Support technique 24/7",
      "Applications et intégrations nombreuses",
      "Sécurité et mises à jour automatiques",
    ],
    consA: [
      "Frais mensuels récurrents (29 à 299 $/mois)",
      "Commission sur les ventes (selon plan)",
      "Personnalisation limitée sans développement",
      "Pas de contrôle total sur les données",
    ],
    prosB: [
      "Solution gratuite (plugin WordPress)",
      "Contrôle total sur vos données et votre site",
      "Personnalisation illimitée (code ouvert)",
      "Pas de commission sur les ventes",
      "Écosystème riche d'extensions",
    ],
    consB: [
      "Hébergement et maintenance à votre charge",
      "Courbe d'apprentissage plus élevée",
      "Sécurité à gérer vous-même",
      "Performances dépendantes de votre hébergement",
    ],
    table: [
      { aspect: "Coût mensuel", aValue: "29 à 299 $ + commissions", bValue: "Gratuit (hors hébergement)" },
      { aspect: "Hébergement", aValue: "Inclus", bValue: "À votre charge" },
      { aspect: "Facilité d'installation", aValue: "Immédiate", bValue: "Quelques heures" },
      { aspect: "Personnalisation", aValue: "Limitée", bValue: "Totale" },
      { aspect: "Paiements Maroc", aValue: "Via gateways tierces", bValue: "CMI, PayPal, etc." },
      { aspect: "SEO", aValue: "Bon", bValue: "Excellent (WordPress)" },
      { aspect: "Scalabilité", aValue: "Très bonne", bValue: "Variable (selon hébergement)" },
      { aspect: "Propriété des données", aValue: "Plateforme", bValue: "Vous" },
      { aspect: "Maintenance", aValue: "Automatique", bValue: "Manuelle" },
      { aspect: "Support", aValue: "24/7 inclus", bValue: "Communauté + payant" },
    ],
    faqs: [
      { question: "Quelle plateforme choisir pour une petite boutique au Maroc ?", answer: "Pour une petite boutique avec un budget limité, WooCommerce est souvent plus adapté car il est gratuit et vous permet de contrôler vos coûts. Cependant, Shopify peut être intéressant si vous voulez une solution rapide sans vous soucier de la technique." },
      { question: "Shopify accepte-t-il les paiements marocains ?", answer: "Shopify accepte les paiements via des gateways tierces comme PayPal. Pour intégrer CMI ou d'autres solutions locales, WooCommerce offre plus de flexibilité avec des extensions spécifiques au Maroc." },
      { question: "Puis-je migrer de WooCommerce à Shopify ?", answer: "Oui, la migration est possible mais peut être complexe selon la taille de votre catalogue. Nous proposons des services de migration sécurisée avec zéro perte de données." },
    ],
  },
  {
    slug: "meta-ads-vs-google-ads",
    itemA: "Meta Ads",
    itemB: "Google Ads",
    itemASlug: "meta-ads",
    itemBSlug: "google-ads",
    title: "Meta Ads vs Google Ads : Quelle régie publicitaire ?",
    description: "Comparatif entre Meta Ads (Facebook/Instagram) et Google Ads pour vos campagnes publicitaires au Maroc.",
    metaDescription: "Meta Ads ou Google Ads ? Comparez les avantages, ciblages et coûts des deux plus grandes régies publicitaires pour choisir la meilleure stratégie pour votre entreprise au Maroc.",
    intro: "Meta Ads (Facebook et Instagram) et Google Ads sont les deux plus grandes plateformes publicitaires. L'une excelle dans la notoriété et le ciblage social, l'autre dans l'intention d'achat et la recherche. Ce comparatif vous aide à répartir votre budget publicitaire.",
    prosA: [
      "Ciblage social très précis (centres d'intérêt, comportements)",
      "Idéal pour la notoriété et l'engagement",
      "Formats visuels riches (vidéos, carrousels)",
      "Coût par clic généralement moins élevé",
      "Audience massive au Maroc (Facebook 87% des internautes)",
    ],
    consA: [
      "Intention d'achat plus faible qu Google",
      "Dépendant de l'algorithme Meta",
      "Fatigue publicitaire rapide",
      "Mesure du ROI moins directe",
    ],
    prosB: [
      "Intention d'achat forte (recherche active)",
      "Ciblage par mots-clés précis",
      "ROI mesurable avec précision",
      "Réseau Display étendu (millions de sites)",
      "Shopping Ads pour l'e-commerce",
    ],
    consB: [
      "Coût par clic plus élevé",
      "Concurrence forte sur les mots-clés",
      "Ciblage social limité",
      "Courbe d'apprentissage technique",
    ],
    table: [
      { aspect: "Intention d'achat", aValue: "Faible (découverte)", bValue: "Forte (recherche)" },
      { aspect: "Ciblage", aValue: "Social (centres d'intérêt)", bValue: "Par mots-clés" },
      { aspect: "Format", aValue: "Visuel (image, vidéo)", bValue: "Texte + extensions" },
      { aspect: "CPC moyen au Maroc", aValue: "1-3 MAD", bValue: "3-10 MAD" },
      { aspect: "Notoriété", aValue: "Excellent", bValue: "Bon" },
      { aspect: "Conversion", aValue: "Moyenne", bValue: "Excellente" },
      { aspect: "Audience Maroc", aValue: "23M utilisateurs", bValue: "Recherche quotidienne" },
      { aspect: "ROI mesurable", aValue: "Moyen", bValue: "Élevé" },
      { aspect: "Délai de résultat", aValue: "Quelques jours", bValue: "Immédiat" },
    ],
    faqs: [
      { question: "Faut-il choisir Meta Ads ou Google Ads pour une startup au Maroc ?", answer: "Pour une startup, nous recommandons Google Ads si vous avez une offre avec une demande de recherche existante, et Meta Ads si vous devez créer de la demande et de la notoriété. Idéalement, les deux combinés offrent les meilleurs résultats." },
      { question: "Quelle plateforme est la moins chère au Maroc ?", answer: "Meta Ads offre généralement des CPC plus bas (1-3 MAD) que Google Ads (3-10 MAD) au Maroc. Cependant, le coût par acquisition dépend de votre secteur et de la qualité de vos campagnes." },
      { question: "Peut-on utiliser Meta Ads et Google Ads ensemble ?", answer: "Absolument, et c'est la stratégie recommandée. Utilisez Google Ads pour capturer la demande existante (intention d'achat) et Meta Ads pour créer de la demande et renforcer la notoriété de votre marque." },
    ],
  },
  {
    slug: "seo-vs-social-media",
    itemA: "SEO",
    itemB: "Réseaux Sociaux",
    itemASlug: "seo",
    itemBSlug: "social-media",
    title: "SEO vs Réseaux Sociaux : Quelle priorité ?",
    description: "Comparatif entre SEO et réseaux sociaux pour votre stratégie de visibilité en ligne au Maroc.",
    metaDescription: "SEO ou réseaux sociaux ? Comparez les avantages, le ROI et l'impact de chaque canal pour définir votre priorité marketing digital au Maroc.",
    intro: "SEO et réseaux sociaux sont deux canaux de visibilité complémentaires mais fondamentalement différents. Le SEO attire les visiteurs qui cherchent activement vos services, tandis que les réseaux sociaux vous permettent de créer une communauté et de la notoriété. Voici comment les comparer.",
    prosA: [
      "Trafic gratuit et continu",
      "Visibilité durable dans le temps",
      "Cible les utilisateurs avec intention d'achat",
      "Crédibilité et autorité renforcées",
      "ROI excellent sur le long terme",
    ],
    consA: [
      "Résultats lents (3 à 6 mois)",
      "Dépendant des algorithmes Google",
      "Investissement technique important",
      "Pas de contrôle direct sur le trafic",
    ],
    prosB: [
      "Résultats rapides (publications virales)",
      "Interaction directe avec votre audience",
      "Construction de communauté et fidélisation",
      "Contrôle créatif total",
      "Données démographiques riches sur l'audience",
    ],
    consB: [
      "Portée organique en baisse (algorithmes)",
      "Temps et ressources importants (création de contenu)",
      "ROI difficile à mesurer",
      "Dépendance aux plateformes (changement d'algorithme)",
    ],
    table: [
      { aspect: "Délai de résultats", aValue: "3 à 6 mois", bValue: "Quelques jours" },
      { aspect: "Coût", aValue: "Gratuit (hors prestation)", bValue: "Gratuit ou payant" },
      { aspect: "Durabilité", aValue: "Long terme", bValue: "Court terme (publication)" },
      { aspect: "Intention d'achat", aValue: "Forte", bValue: "Faible à moyenne" },
      { aspect: "Interaction", aValue: "Faible", bValue: "Élevée" },
      { aspect: "Contrôle", aValue: "Faible (Google décide)", bValue: "Élevé (vous publiez)" },
      { aspect: "ROI mesurable", aValue: "Excellent", bValue: "Moyen" },
      { aspect: "Portée au Maroc", aValue: "Tous les internautes", bValue: "23M sur Facebook" },
      { aspect: "Maintenance", aValue: "Continue (technique)", bValue: "Quotidienne (contenu)" },
    ],
    faqs: [
      { question: "Faut-il prioriser le SEO ou les réseaux sociaux au Maroc ?", answer: "Pour une entreprise B2B ou un service avec une demande de recherche établie, priorisez le SEO. Pour une marque grand public ou un produit visuel, les réseaux sociaux peuvent être plus pertinents. Idéalement, les deux travaillent en synergie." },
      { question: "Combien de temps faut-il consacrer aux réseaux sociaux par semaine ?", answer: "Une stratégie sociale efficace nécessite au moins 5 à 10 heures par semaine pour la création de contenu, l'engagement et l'analyse des performances. La régularité est plus importante que la quantité." },
      { question: "Le SEO peut-il booster mes réseaux sociaux ?", answer: "Oui, un bon contenu SEO (articles de blog, guides) peut être partagé sur vos réseaux sociaux pour générer de l'engagement. Inversement, une communauté sociale active peut générer des backlinks naturels vers votre site, améliorant votre SEO." },
    ],
  },
]

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug)
}
