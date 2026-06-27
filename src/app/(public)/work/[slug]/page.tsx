import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChartBar } from "@/components/icons"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProjectJsonLd } from "@/components/shared/json-ld"
import { getProjectBySlug, getRelatedProjects, getAdjacentProjects } from "@/lib/projects/queries"
import { siteConfig } from "@/lib/constants/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: "Projet non trouvé | Weblancia" }
  return {
    title: `${project.title} | Weblancia`,
    description: project.description ?? undefined,
    alternates: { canonical: `${siteConfig.url}/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description ?? undefined,
      url: `${siteConfig.url}/work/${project.slug}`,
      images: project.featuredImage ? [{ url: project.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description ?? undefined,
    },
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const related = await getRelatedProjects(project.id)
  const { prev, next } = await getAdjacentProjects(project.id)

  const testimonial = project.clientTestimonial as { quote?: string; author?: string; role?: string } | null
  const results = project.results as { label: string; value: string }[] | null
  const technologies = project.technologies as string[] | null
  const servicesProvided = project.servicesProvided as string[] | null

  return (
    <>
      <SectionWrapper>
        <Container>
          <ProjectJsonLd name={project.title} description={project.description ?? ""} url={`${siteConfig.url}/work/${project.slug}`} image={project.featuredImage ? `${siteConfig.url}${project.featuredImage}` : undefined} />
          <Breadcrumbs items={[{ label: "Work", href: "/work" }, { label: project.title }]} />

          {/* Hero */}
          <AnimatedReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologies?.map((tech) => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>
                <h1 className="text-display mb-4">{project.title}</h1>
                {project.client && <p className="text-body-lg text-text-secondary mb-2">{project.client}</p>}
                {project.industry && <p className="text-caption text-text-secondary mb-6">{project.industry}</p>}
                <p className="text-body text-text-secondary mb-6">{project.description}</p>

                {results && results.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                    {results.map((kpi, i) => (
                      <div key={i} className="p-4 bg-success-bg rounded-radius-lg">
                        <p className="text-h3 font-bold text-success">{kpi.value}</p>
                        <p className="text-caption text-success">{kpi.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {testimonial && (
                  <blockquote className="border-l-4 border-accent pl-4 italic text-body text-text-secondary">
                    <p>&ldquo;{testimonial.quote}&rdquo;</p>
                    <footer className="text-caption mt-2 not-italic">
                      <strong>{testimonial.author}</strong>{testimonial.role ? <> — {testimonial.role}</> : null}
                    </footer>
                  </blockquote>
                )}
              </div>
              <div className="relative aspect-[4/3] rounded-radius-xl overflow-hidden bg-bg-secondary">
                {project.featuredImage && (
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      {/* Challenge & Solution */}
      {(project.challenge || project.solution) && (
        <SectionWrapper bgSecondary>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {project.challenge && (
                <AnimatedReveal>
                  <h2 className="text-h3 font-semibold mb-4">Challenge</h2>
                  <p className="text-body text-text-secondary whitespace-pre-line">{project.challenge}</p>
                </AnimatedReveal>
              )}
              {project.solution && (
                <AnimatedReveal>
                  <h2 className="text-h3 font-semibold mb-4">Solution</h2>
                  <p className="text-body text-text-secondary whitespace-pre-line">{project.solution}</p>
                </AnimatedReveal>
              )}
            </div>
          </Container>
        </SectionWrapper>
      )}

      {/* Gallery */}
      {project.images.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h3 font-semibold mb-8 text-center">Gallery</h2>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((img, i) => (
                <AnimatedReveal key={img.id} delay={i * 0.05}>
                  <div className="relative aspect-video rounded-radius-lg overflow-hidden bg-bg-secondary">
                    <Image src={img.url} alt={img.alt ?? project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}

      {/* Services Provided */}
      {servicesProvided && servicesProvided.length > 0 && (
        <SectionWrapper bgSecondary>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h3 font-semibold mb-6 text-center">Services Provided</h2>
            </AnimatedReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {servicesProvided.map((svc) => (
                <Badge key={svc} variant="category">{svc}</Badge>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}

      {/* Full Case Study */}
      {project.fullCaseStudy && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h3 font-semibold mb-6">Case Study</h2>
              <div className="prose prose-invert max-w-none whitespace-pre-line text-body text-text-secondary">
                {project.fullCaseStudy}
              </div>
            </AnimatedReveal>
          </Container>
        </SectionWrapper>
      )}

      {/* Prev / Next */}
      <SectionWrapper bgSecondary>
        <Container>
          <div className="flex justify-between items-center">
            <div>
              {prev && (
                <Link href={`/work/${prev.slug}`} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors">
                  <ArrowRight size={16} className="rotate-180" />
                  <span className="text-button font-medium">{prev.title}</span>
                </Link>
              )}
            </div>
            <div>
              {next && (
                <Link href={`/work/${next.slug}`} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors">
                  <span className="text-button font-medium">{next.title}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Related Projects */}
      {related.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h3 font-semibold mb-6 text-center">Related Projects</h2>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel, i) => (
                <AnimatedReveal key={rel.id} delay={i * 0.08}>
                  <Link href={`/work/${rel.slug}`} className="block bg-surface rounded-radius-lg overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-video bg-bg-secondary">
                      {rel.featuredImage && (
                        <Image src={rel.featuredImage} alt={rel.title} fill className="object-cover" sizes="33vw" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{rel.title}</h3>
                      {rel.client && <p className="text-caption text-text-secondary">{rel.client}</p>}
                    </div>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}

      {/* CTA */}
      <SectionWrapper>
        <Container>
          <div className="text-center py-12">
            <h2 className="text-h3 font-semibold mb-4">Intéressé par un projet similaire ?</h2>
            <Link href="/start-project" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-radius-md font-medium hover:bg-accent-hover transition-colors">
              Démarrer votre projet <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
