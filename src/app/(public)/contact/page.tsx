import { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { SocialLinks } from "@/components/shared/social-links"
import { FaqJsonLd } from "@/components/shared/json-ld"
import { EnvelopeSimple, Phone, MapPin, Clock } from "@/components/icons"
import { siteConfig } from "@/lib/constants/site"
import { ContactForm } from "./contact-form"
import type { FAQ } from "@/types/common"

export const metadata: Metadata = {
  title: "Contact | Weblancia",
  description:
    "Contactez Weblancia pour vos projets web, e-commerce, branding et marketing digital. Une question ? Notre équipe vous répond sous 48 heures.",
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: { title: "Contact | Weblancia", description: "Contactez Weblancia pour vos projets web, e-commerce, branding et marketing digital.", url: `${siteConfig.url}/contact` },
  twitter: { card: "summary_large_image", title: "Contact | Weblancia", description: "Contactez Weblancia pour vos projets web, e-commerce, branding et marketing digital." },
}

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

const faqItems: FAQ[] = [
  {
    question: "Quels sont vos tarifs ?",
    answer:
      "Nos tarifs varient en fonction de la complexité et de l'ampleur de chaque projet. Nous proposons des devis personnalisés après avoir compris vos besoins. Contactez-nous pour une estimation gratuite.",
  },
  {
    question: "Quels sont les délais de réalisation ?",
    answer:
      "Les délais dépendent du type de projet. Un site vitrine peut être livré en 2 à 4 semaines, tandis qu'un e-commerce ou une application sur mesure peut prendre 2 à 6 mois. Nous établissons un calendrier précis lors de notre première consultation.",
  },
  {
    question: "Comment se déroule notre collaboration ?",
    answer:
      "Notre processus commence par une consultation gratuite pour comprendre vos objectifs. Ensuite, nous élaborons une stratégie, concevons les maquettes, développons la solution, et assurons un suivi après livraison. Vous êtes impliqué à chaque étape.",
  },
  {
    question: "Proposez-vous un support après la livraison ?",
    answer:
      "Oui, nous offrons différentes formules de maintenance et de support pour garantir le bon fonctionnement de votre projet. Nous sommes disponibles pour toute évolution ou correction technique après la mise en ligne.",
  },
]

export default function ContactPage() {
  return (
    <>
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
          <FaqJsonLd questions={faqItems.map((item) => ({ question: item.question, answer: item.answer }))} />
          <AnimatedReveal>
            <h2 className="text-h2 font-semibold text-center mb-12">Questions fréquentes</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion>
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} title={item.question}>
                    {item.answer}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
