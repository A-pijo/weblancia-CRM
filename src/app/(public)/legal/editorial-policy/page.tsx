import { Metadata } from "next"
import Link from "next/link"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"

export const metadata: Metadata = {
  title: "Politique Éditoriale | Weblancia",
  description: "Découvrez la politique éditoriale de Weblancia : principes, processus de rédaction, révision et qualité du contenu.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteConfig.url}/legal/editorial-policy` },
}

export default function EditorialPolicyPage() {
  return (
    <>
      <WebPageJsonLd name="Politique Éditoriale | Weblancia" description="Principes et processus éditoriaux de Weblancia" url={`${siteConfig.url}/legal/editorial-policy`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Mentions Légales", href: "/legal" }, { label: "Politique Éditoriale" }]} />
          <AnimatedReveal>
            <h1 className="text-h1 mb-6 mt-4">Politique Éditoriale</h1>
            <div className="max-w-3xl prose">
              <h2 className="text-h2 mt-8 mb-3">Notre Engagement</h2>
              <p className="text-body text-text-secondary mb-4">
                Weblancia s&apos;engage à produire un contenu de qualité, précis, pertinent et utile pour nos lecteurs. 
                Notre politique éditoriale garantit l&apos;intégrité, la transparence et l&apos;expertise de chaque publication.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Qui Rédige Nos Articles</h2>
              <p className="text-body text-text-secondary mb-4">
                Nos articles sont rédigés par des experts reconnus dans leur domaine : développeurs web, spécialistes SEO, 
                designers UI/UX et professionnels du marketing digital. Chaque auteur possède une expérience pratique 
                significative et une expertise vérifiable dans son domaine. Les profils de nos auteurs sont disponibles 
                sur notre <Link href="/author" className="text-accent hover:underline">page auteurs</Link>.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Processus de Publication</h2>
              <p className="text-body text-text-secondary mb-4">
                Chaque article suit un processus rigoureux :
              </p>
              <ol className="list-decimal ml-6 text-body text-text-secondary space-y-2 mb-4">
                <li><strong>Recherche et planification</strong> : Identification des sujets pertinents basés sur les tendances du secteur et les besoins de nos lecteurs.</li>
                <li><strong>Rédaction</strong> : L&apos;auteur rédige l&apos;article en s&apos;appuyant sur des sources fiables et son expertise.</li>
                <li><strong>Révision interne</strong> : Relecture par un pair pour vérifier l&apos;exactitude technique et la clarté.</li>
                <li><strong>Vérification des faits</strong> : Validation des données, statistiques et affirmations factuelles.</li>
                <li><strong>Publication</strong> : Mise en ligne après approbation finale avec référencement et métadonnées optimisés.</li>
              </ol>

              <h2 className="text-h2 mt-8 mb-3">Principes Éditoriaux</h2>
              <ul className="list-disc ml-6 text-body text-text-secondary space-y-2 mb-4">
                <li><strong>Exactitude</strong> : Nous vérifions rigoureusement toutes les informations avant publication.</li>
                <li><strong>Transparence</strong> : Les articles signés engagent leur auteur. En cas de contenu sponsorisé, il est clairement identifié.</li>
                <li><strong>Indépendance</strong> : Notre contenu éditorial est indépendant et non influencé par des intérêts commerciaux.</li>
                <li><strong>Actualité</strong> : Nous mettons à jour régulièrement nos articles pour refléter les dernières évolutions.</li>
                <li><strong>Accessibilité</strong> : Nous écrivons dans un langage clair et accessible, tout en maintenant un niveau d&apos;expertise élevé.</li>
              </ul>

              <h2 className="text-h2 mt-8 mb-3">Sources et Références</h2>
              <p className="text-body text-text-secondary mb-4">
                Nous nous appuyons sur des sources fiables et reconnues : documentation officielle, études académiques, 
                rapports d&apos;analystes, et retours d&apos;expérience directs de nos projets clients. Chaque affirmation 
                importante est étayée par une source vérifiable.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Liens Affiliés et Sponsoring</h2>
              <p className="text-body text-text-secondary mb-4">
                Weblancia peut occasionnellement inclure des liens affiliés dans ses articles. Ces liens sont toujours 
                clairement identifiés et n&apos;influencent pas le contenu éditorial. Nous ne recommandons que des 
                produits ou services que nous avons personnellement testés et approuvés.
              </p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
