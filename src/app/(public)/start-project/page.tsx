import { Metadata } from "next"
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
  alternates: { canonical: `${siteConfig.url}/start-project` },
  openGraph: { title: "Commencer votre projet | Weblancia", description: "Racontez-nous votre vision. Notre équipe vous contactera pour en discuter.", url: `${siteConfig.url}/start-project` },
  twitter: { card: "summary_large_image", title: "Commencer votre projet | Weblancia", description: "Racontez-nous votre vision. Notre équipe vous contactera pour en discuter." },
}

export default function StartProjectPage() {
  return (
    <>
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
