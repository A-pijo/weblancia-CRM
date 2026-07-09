import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { getCityBySlug, cities, getLocalServiceMapping } from "@/lib/data/cities"
import { prisma } from "@/lib/database/prisma"
import { ServiceJsonLd, LocalBusinessJsonLd, WebPageJsonLd } from "@/components/shared/json-ld"
import { ArrowRight, MapPin } from "@/components/icons"

type Props = { params: Promise<{ city: string; serviceSlug: string }> }

export async function generateStaticParams() {
  const serviceSlugs = ["seo", "web-development", "digital-marketing", "branding-design"]
  const params = []
  for (const city of cities) {
    for (const serviceSlug of serviceSlugs) {
      params.push({ city: city.slug, serviceSlug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, serviceSlug } = await params
  const city = getCityBySlug(citySlug)
  const mapping = getLocalServiceMapping(serviceSlug)
  if (!city || !mapping) return { title: "Page non trouvée | Weblancia" }
  const title = mapping.title.replace("{city}", city.name).replace("{region}", city.region)
  const description = mapping.description.replace(/{city}/g, city.name).replace(/{region}/g, city.region)
  return {
    title: `${title} | Weblancia`,
    description,
    alternates: { canonical: `${siteConfig.url}/ville/${city.slug}/${serviceSlug}` },
    openGraph: { title, description, url: `${siteConfig.url}/ville/${city.slug}/${serviceSlug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function CityServicePage({ params }: Props) {
  const { city: citySlug, serviceSlug } = await params
  const city = getCityBySlug(citySlug)
  const mapping = getLocalServiceMapping(serviceSlug)
  if (!city || !mapping) notFound()

  const title = mapping.title.replace("{city}", city.name).replace("{region}", city.region)
  const description = mapping.description.replace(/{city}/g, city.name).replace(/{region}/g, city.region)

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } }).catch(() => null)
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    take: 4,
  }).catch(() => [])

  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 4)

  return (
    <>
      <WebPageJsonLd name={title} description={description} url={`${siteConfig.url}/ville/${city.slug}/${serviceSlug}`} />
      <LocalBusinessJsonLd />
      {service && (
        <ServiceJsonLd name={service.title} description={description} category={serviceSlug} />
      )}
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: `${mapping.title.replace("{city}", city.name).replace("{region}", city.region)}` }]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <div className="flex items-center gap-2 text-accent mb-3">
                <MapPin size={18} />
                <span className="text-caption font-medium">{city.name} — {city.region}</span>
              </div>
              <h1 className="text-display mb-4">{title}</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">{description}</p>
              <Link href="/book-call" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-radius-md hover:bg-accent-hover transition-colors font-medium">
                Réserver un appel <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-4">{service?.title ?? "Nos Services"} à {city.name}</h2>
            <p className="text-body text-text-secondary max-w-2xl mb-6">
              Basés à Fès, nous intervenons dans tout le Maroc et proposons nos services aux entreprises de {city.name} 
              et de la région {city.region}. Que vous soyez une startup, une PME ou une grande entreprise, 
              nous adaptons notre approche à vos besoins spécifiques.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Également Disponible dans</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherCities.map((c, i) => (
              <AnimatedReveal key={c.slug} delay={i * 0.08}>
                <Link href={`/ville/${c.slug}/${serviceSlug}`} className="block bg-surface border border-border rounded-radius-lg p-4 text-center hover:border-accent transition-colors h-full">
                  <p className="text-body font-semibold">{c.name}</p>
                  <p className="text-caption text-text-secondary">{c.description}</p>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      {projects.length > 0 && (
        <SectionWrapper bgSecondary>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-6">Nos Réalisations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <AnimatedReveal key={p.id} delay={i * 0.08}>
                    <Link href={`/work/${p.slug}`} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                      <h3 className="text-body font-semibold mb-1">{p.title}</h3>
                      <p className="text-body-sm text-text-secondary line-clamp-2">{p.description}</p>
                    </Link>
                  </AnimatedReveal>
                ))}
              </div>
            </AnimatedReveal>
          </Container>
        </SectionWrapper>
      )}

      <CTABanner
        headline={`Prêt à booster votre présence digitale à ${city.name} ?`}
        subheadline={`Contactez notre équipe pour discuter de votre projet à ${city.name} et dans la région ${city.region}.`}
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
