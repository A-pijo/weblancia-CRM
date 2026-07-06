export interface Platform {
  slug: string
  name: string
  category: string
  description: string
  metaDescription: string
}

export const platforms: Platform[] = [
  {
    slug: "shopify",
    name: "Shopify",
    category: "E-commerce",
    description: "Plateforme e-commerce leader pour les boutiques en ligne",
    metaDescription: "Services Shopify : création boutique, développement thème personnalisé, applications Shopify et migration vers Shopify pour votre e-commerce.",
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    category: "E-commerce",
    description: "Plugin e-commerce pour WordPress",
    metaDescription: "Services WooCommerce : boutique en ligne WordPress, plugins de paiement, extensions et solutions e-commerce personnalisées avec WooCommerce.",
  },
  {
    slug: "prestashop",
    name: "PrestaShop",
    category: "E-commerce",
    description: "Solution e-commerce open-source française",
    metaDescription: "Services PrestaShop : création boutique, modules personnalisés, thèmes et maintenance pour votre site e-commerce PrestaShop au Maroc.",
  },
  {
    slug: "magento",
    name: "Magento (Adobe Commerce)",
    category: "E-commerce",
    description: "Plateforme e-commerce d'entreprise",
    metaDescription: "Services Magento : développement e-commerce enterprise, extensions B2B, intégrations et optimisation performance pour Magento/Adobe Commerce.",
  },
  {
    slug: "webflow",
    name: "Webflow",
    category: "Design",
    description: "Plateforme de design et développement web visuel",
    metaDescription: "Services Webflow : sites web design-driven, CMS visuel, animations et hébergement avec la plateforme Webflow sans code.",
  },
  {
    slug: "drupal",
    name: "Drupal",
    category: "CMS",
    description: "CMS d'entreprise flexible et puissant",
    metaDescription: "Services Drupal : développement de sites d'entreprise, modules personnalisés, architecture de contenu et migration vers Drupal.",
  },
  {
    slug: "strapi",
    name: "Strapi",
    category: "Headless CMS",
    description: "CMS headless open-source basé sur Node.js",
    metaDescription: "Services Strapi : headless CMS personnalisé, API content management, intégrations frontend et solutions de contenu découplé avec Strapi.",
  },
  {
    slug: "squarespace",
    name: "Squarespace",
    category: "Design",
    description: "Plateforme de création de sites web tout-en-un",
    metaDescription: "Services Squarespace : templates personnalisés, intégrations e-commerce et optimisation SEO pour votre site Squarespace professionnel.",
  },
]

export function getPlatformBySlug(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug)
}
