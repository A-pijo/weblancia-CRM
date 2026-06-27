import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { ArrowRight, CheckCircle } from "@/components/icons"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ServiceJsonLd } from "@/components/shared/json-ld"
import { ServiceCards } from "./service-cards"
import { getServiceCategoryBySlug, getServiceBySlug, getServiceById } from "@/lib/services/queries"
import { siteConfig } from "@/lib/constants/site"

type Props = { params: Promise<{ slug: string[] }> }

export const dynamic = "force-dynamic"

const SLUG_ALIASES: Record<string, string> = {
  "ui-ux": "ui-ux-design",
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [first, second] = slug

  if (second) {
    const svc = await getServiceBySlug(second)
    if (svc) {
      return {
        title: `${svc.title} | Weblancia`,
        description: svc.description ?? "",
        alternates: { canonical: `${siteConfig.url}/services/${second}` },
        openGraph: { title: `${svc.title} | Weblancia`, description: svc.description ?? "", url: `${siteConfig.url}/services/${second}` },
        twitter: { card: "summary_large_image", title: `${svc.title} | Weblancia`, description: svc.description ?? "" },
      }
    }
    return { title: "Service non trouvé | Weblancia" }
  }

  const cat = await getServiceCategoryBySlug(first)
  if (cat) {
    return {
      title: `${cat.title} | Weblancia`,
      description: cat.description ?? "",
      alternates: { canonical: `${siteConfig.url}/services/${first}` },
      openGraph: { title: `${cat.title} | Weblancia`, description: cat.description ?? "", url: `${siteConfig.url}/services/${first}` },
      twitter: { card: "summary_large_image", title: `${cat.title} | Weblancia`, description: cat.description ?? "" },
    }
  }

  const resolvedSlug = SLUG_ALIASES[first] ?? first
  const svcData = await getServiceBySlug(resolvedSlug)
  if (svcData) {
    return {
      title: `${svcData.title} | Weblancia`,
      description: svcData.description ?? "",
      alternates: { canonical: `${siteConfig.url}/services/${first}` },
      openGraph: { title: `${svcData.title} | Weblancia`, description: svcData.description ?? "", url: `${siteConfig.url}/services/${first}` },
      twitter: { card: "summary_large_image", title: `${svcData.title} | Weblancia`, description: svcData.description ?? "" },
    }
  }

  return { title: "Service non trouvé | Weblancia" }
}

export default async function ServicesSlugPage({ params }: Props) {
  const { slug } = await params
  const [first, second] = slug

  if (second) {
    const svc = await getServiceBySlug(second)
    const category = await getServiceCategoryBySlug(first)
    if (!svc || !category) notFound()

    const deliverables = (svc.deliverables as string[]) ?? []

    return (
      <>
        <SectionWrapper>
          <Container>
            <ServiceJsonLd name={svc.title} description={svc.description ?? ""} />
            <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: category.title, href: `/services/${first}` }, { label: svc.title }]} />
            <AnimatedReveal>
              <h1 className="text-display mt-4 mb-3">{svc.title}</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-8">{svc.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface border border-border rounded-radius-xl p-8">
                  <h2 className="text-h3 font-semibold mb-6">Ce que nous livrons</h2>
                  <ul className="flex flex-col gap-3">
                    {deliverables.map((item: string) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
                        <span className="text-body text-text-primary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-accent-light border border-accent/20 rounded-radius-xl p-8">
                  <h2 className="text-h3 font-semibold mb-6">Résultat attendu</h2>
                  <p className="text-body-lg text-text-primary">{svc.outcome}</p>
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center h-12 px-6 rounded-radius-md bg-accent text-white hover:bg-accent-hover transition-colors font-medium"
                    >
                      Discuter de ce service <ArrowRight size={20} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          </Container>
        </SectionWrapper>
      </>
    )
  }

  const cat = await getServiceCategoryBySlug(first)
  if (cat) {
    const { items: services } = await (await import("@/lib/services/queries")).getServices({
      categoryId: cat.id,
      isActive: true,
      limit: 50,
    })
    return (
      <SectionWrapper>
        <Container>
          <ServiceJsonLd name={cat.title} description={cat.description ?? ""} />
          <AnimatedReveal>
            <Link href="/services" className="text-body-sm text-accent hover:text-accent-hover mb-4 inline-flex items-center gap-1">
              <ArrowRight size={16} className="rotate-180" /> Tous les services
            </Link>
            <h1 className="text-display mt-4 mb-3">{cat.title}</h1>
            <p className="text-body-lg text-text-secondary max-w-2xl mb-12">{cat.description}</p>
          </AnimatedReveal>
          <AnimatedReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCards services={services.map((s: { slug: string; title: string; description: string | null }) => ({
              slug: s.slug,
              title: s.title,
              description: s.description ?? "",
            }))} />
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    )
  }

  const resolvedSlug = SLUG_ALIASES[first] ?? first
  const svc = await getServiceBySlug(resolvedSlug)
  if (!svc) notFound()

  const category = await getServiceCategoryBySlug(svc.category.slug)
  const deliverables = (svc.deliverables as string[]) ?? []

  return (
    <>
      <SectionWrapper>
        <Container>
          <ServiceJsonLd name={svc.title} description={svc.description ?? ""} />
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: category?.title ?? "", href: `/services/${svc.category.slug}` }, { label: svc.title }]} />
          <AnimatedReveal>
            <h1 className="text-display mt-4 mb-3">{svc.title}</h1>
            <p className="text-body-lg text-text-secondary max-w-2xl mb-8">{svc.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface border border-border rounded-radius-xl p-8">
                <h2 className="text-h3 font-semibold mb-6">Ce que nous livrons</h2>
                <ul className="flex flex-col gap-3">
                  {deliverables.map((item: string) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
                      <span className="text-body text-text-primary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-accent-light border border-accent/20 rounded-radius-xl p-8">
                <h2 className="text-h3 font-semibold mb-6">Résultat attendu</h2>
                <p className="text-body-lg text-text-primary">{svc.outcome}</p>
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-12 px-6 rounded-radius-md bg-accent text-white hover:bg-accent-hover transition-colors font-medium"
                  >
                    Discuter de ce service <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
