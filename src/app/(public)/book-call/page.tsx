import { Metadata } from "next"
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
  alternates: { canonical: `${siteConfig.url}/book-call` },
  openGraph: { title: "Réserver un appel | Weblancia", description: "Planifiez un appel gratuit avec notre équipe pour discuter de votre projet digital.", url: `${siteConfig.url}/book-call` },
  twitter: { card: "summary_large_image", title: "Réserver un appel | Weblancia", description: "Planifiez un appel gratuit avec notre équipe pour discuter de votre projet digital." },
}

export default function BookCallPage() {
  return (
    <>
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
