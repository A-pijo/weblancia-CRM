import { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"

export const metadata: Metadata = {
  title: "Politique de Correction | Weblancia",
  description: "Politique de correction et de mise à jour du contenu sur Weblancia. Comment nous traitons les erreurs et mettons à jour nos articles.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteConfig.url}/legal/correction-policy` },
}

export default function CorrectionPolicyPage() {
  return (
    <>
      <WebPageJsonLd name="Politique de Correction | Weblancia" description="Comment Weblancia traite les erreurs et met à jour son contenu" url={`${siteConfig.url}/legal/correction-policy`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Mentions Légales", href: "/legal" }, { label: "Politique de Correction" }]} />
          <AnimatedReveal>
            <h1 className="text-h1 mb-6 mt-4">Politique de Correction</h1>
            <div className="max-w-3xl prose">
              <p className="text-body text-text-secondary mb-4">
                Weblancia s&apos;engage à maintenir l&apos;exactitude et la pertinence de son contenu. 
                Cette politique décrit comment nous traitons les erreurs et mettons à jour nos articles.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Signalement d&apos;Erreurs</h2>
              <p className="text-body text-text-secondary mb-4">
                Si vous identifiez une erreur dans nos contenus, veuillez nous contacter à l&apos;adresse 
                <a href="mailto:contact@weblancia.com" className="text-accent hover:underline"> contact@weblancia.com</a> 
                avec l&apos;objet &quot;Correction&quot; en précisant :
              </p>
              <ul className="list-disc ml-6 text-body text-text-secondary space-y-1 mb-4">
                <li>L&apos;URL de la page concernée</li>
                <li>La nature de l&apos;erreur</li>
                <li>La correction proposée (avec source si applicable)</li>
              </ul>

              <h2 className="text-h2 mt-8 mb-3">Notre Processus de Correction</h2>
              <ol className="list-decimal ml-6 text-body text-text-secondary space-y-2 mb-4">
                <li><strong>Réception</strong> : Votre signalement est accusé réception sous 48 heures ouvrées.</li>
                <li><strong>Évaluation</strong> : Notre équipe vérifie l&apos;erreur et détermine la correction appropriée.</li>
                <li><strong>Correction</strong> : L&apos;article est mis à jour avec la correction. Les modifications sont documentées en fin d&apos;article.</li>
                <li><strong>Notification</strong> : Vous êtes informé de la correction effectuée.</li>
              </ol>

              <h2 className="text-h2 mt-8 mb-3">Transparence des Modifications</h2>
              <p className="text-body text-text-secondary mb-4">
                Les articles comportent une date de publication et une date de dernière mise à jour. 
                Les modifications significatives (corrections factuelles, ajouts majeurs) sont signalées 
                dans une note en fin d&apos;article.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Mises à Jour Régulières</h2>
              <p className="text-body text-text-secondary mb-4">
                Nos articles sont révisés périodiquement pour s&apos;assurer qu&apos;ils restent pertinents 
                et exacts. Les articles obsolètes sont soit mis à jour, soit retirés, soit clairement 
                marqués comme &quot;information historique&quot;.
              </p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
