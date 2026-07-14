import { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { BookCallForm } from "./book-call-form"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Réserver un appel | Weblancia",
  description:
    "Planifiez un appel gratuit avec notre équipe pour discuter de votre projet digital.",
  keywords: ["Weblancia", "appel gratuit", "consultation", "projet digital", "Casablanca"],
  alternates: { canonical: `${siteConfig.url}/book-call` },
  openGraph: { title: "Réserver un appel | Weblancia", description: "Planifiez un appel gratuit avec notre équipe pour discuter de votre projet digital.", url: `${siteConfig.url}/book-call`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Réserver un appel | Weblancia", description: "Planifiez un appel gratuit avec notre équipe pour discuter de votre projet digital.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export default function BookCallPage() {
  return (
    <>
      <WebPageJsonLd name="Réserver un appel | Weblancia" description="Planifiez un appel gratuit avec notre équipe pour discuter de votre projet digital." url={`${siteConfig.url}/book-call`} />
      <HeroDefault
        headline="Réserver un appel"
        subheadline="Planifiez un appel gratuit avec notre équipe pour discuter de votre projet."
        align="left"
      />
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <BookCallForm />
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
