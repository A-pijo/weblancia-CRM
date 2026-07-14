import { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { StartProjectForm } from "./start-project-form"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Commencer votre projet | Weblancia",
  description:
    "Racontez-nous votre vision. Remplissez notre formulaire de projet et notre équipe vous contactera pour discuter de votre projet en détail.",
  keywords: ["Weblancia", "projet", "devis", "développement web", "création site", "Casablanca"],
  alternates: { canonical: `${siteConfig.url}/start-project` },
  openGraph: { title: "Commencer votre projet | Weblancia", description: "Racontez-nous votre vision. Notre équipe vous contactera pour en discuter.", url: `${siteConfig.url}/start-project`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Commencer votre projet | Weblancia", description: "Racontez-nous votre vision. Notre équipe vous contactera pour en discuter.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export default function StartProjectPage() {
  return (
    <>
      <WebPageJsonLd name="Commencer votre projet | Weblancia" description="Racontez-nous votre vision. Notre équipe vous contactera pour discuter de votre projet en détail." url={`${siteConfig.url}/start-project`} />
      <HeroDefault
        headline="Commencer votre projet"
        subheadline="Racontez-nous votre vision. Nous vous contacterons pour en discuter en détail."
        align="left"
      />
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <StartProjectForm />
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
