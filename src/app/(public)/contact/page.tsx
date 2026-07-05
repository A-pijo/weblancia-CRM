import { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { SocialLinks } from "@/components/shared/social-links"
import { FaqJsonLd, ContactPageJsonLd } from "@/components/shared/json-ld"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { EnvelopeSimple, Phone, MapPin, Clock } from "@/components/icons"
import { siteConfig } from "@/lib/constants/site"
import { ContactForm } from "./contact-form"
import { prisma } from "@/lib/database/prisma"

export const metadata: Metadata = {
  title: "Contact | Weblancia",
  description:
    "Contactez Weblancia pour vos projets web, e-commerce, branding et marketing digital. Une question ? Notre équipe vous répond sous 48 heures.",
  keywords: ["Weblancia", "contact", "Casablanca", "devis", "projet digital", "accompagnement"],
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: { title: "Contact | Weblancia", description: "Contactez Weblancia pour vos projets web, e-commerce, branding et marketing digital.", url: `${siteConfig.url}/contact`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Contact | Weblancia", description: "Contactez Weblancia pour vos projets web, e-commerce, branding et marketing digital.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export const revalidate = 3600

export default async function ContactPage() {
  const faqItems = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  })

  const contactInfo = [
    {
      icon: EnvelopeSimple,
      label: "Email",
      value: siteConfig.email.hello,
      href: `mailto:${siteConfig.email.hello}`,
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: `${siteConfig.address.city}, ${siteConfig.address.country}`,
    },
    {
      icon: Clock,
      label: "Horaires",
      value: "Lundi - Vendredi, 9h00 - 18h00",
    },
  ]

  return (
    <>
      <ContactPageJsonLd />
      <Container>
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      </Container>
      <HeroDefault
        headline="Contactez-nous"
        subheadline="Une question ? Un projet ? Nous sommes là pour vous accompagner."
        align="left"
      />
      <SectionWrapper>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <AnimatedReveal>
                <ContactForm />
              </AnimatedReveal>
            </div>
            <div className="lg:col-span-2">
              <AnimatedReveal delay={0.1}>
                <Card className="sticky top-24">
                  <h3 className="text-h3 font-semibold mb-6">Nos coordonnées</h3>
                  <div className="flex flex-col gap-5">
                    {contactInfo.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0 mt-0.5">
                            <Icon size={18} className="text-accent" />
                          </div>
                          <div>
                            <p className="text-caption text-text-tertiary mb-0.5">{item.label}</p>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="text-body text-text-primary hover:text-accent transition-colors duration-200"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-body text-text-primary">{item.value}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <hr className="my-6 border-border" />
                  <p className="text-caption text-text-tertiary mb-3">Suivez-nous</p>
                  <SocialLinks />
                </Card>
              </AnimatedReveal>
            </div>
          </div>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <FaqJsonLd questions={faqItems.map((item) => ({ question: item.question, answer: item.answer }))} pageUrl={`${siteConfig.url}/contact`} />
          <AnimatedReveal>
            <h2 className="text-h2 font-semibold text-center mb-12">Questions fréquentes</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion>
                {faqItems.map((item) => (
                  <div key={item.id} id={`faq-${item.id}`}>
                    <AccordionItem title={item.question}>
                      {item.answer}
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
