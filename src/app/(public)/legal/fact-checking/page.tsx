import { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"

export const metadata: Metadata = {
  title: "Vérification des Faits | Weblancia",
  description: "Notre processus de vérification des faits garantit l'exactitude et la fiabilité des informations publiées sur Weblancia.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteConfig.url}/legal/fact-checking` },
}

export default function FactCheckingPage() {
  return (
    <>
      <WebPageJsonLd name="Vérification des Faits | Weblancia" description="Processus de vérification des faits chez Weblancia" url={`${siteConfig.url}/legal/fact-checking`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Mentions Légales", href: "/legal" }, { label: "Vérification des Faits" }]} />
          <AnimatedReveal>
            <h1 className="text-h1 mb-6 mt-4">Vérification des Faits</h1>
            <div className="max-w-3xl prose">
              <p className="text-body text-text-secondary mb-4">
                Weblancia accorde une importance primordiale à l&apos;exactitude des informations publiées. 
                Notre processus de vérification des faits garantit que chaque article repose sur des données fiables.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Notre Méthodologie</h2>
              <ul className="list-disc ml-6 text-body text-text-secondary space-y-2 mb-4">
                <li><strong>Sources primaires</strong> : Nous privilégions les sources officielles, la documentation technique, les études académiques et les données issues de nos propres projets.</li>
                <li><strong>Recoupement</strong> : Les informations importantes sont vérifiées auprès de multiples sources indépendantes.</li>
                <li><strong>Citations</strong> : Les statistiques et données chiffrées sont systématiquement accompagnées de leur source.</li>
                <li><strong>Expertise interne</strong> : Nos auteurs sont des praticiens actifs qui valident la pertinence technique des informations.</li>
              </ul>

              <h2 className="text-h2 mt-8 mb-3">Types de Contenu Vérifiés</h2>
              <p className="text-body text-text-secondary mb-4">
                Notre processus de vérification s&apos;applique à tous les contenus publiés, y compris :
              </p>
              <ul className="list-disc ml-6 text-body text-text-secondary space-y-1 mb-4">
                <li>Articles de blog et analyses</li>
                <li>Guides et tutoriels techniques</li>
                <li>Études de cas et témoignages</li>
                <li>Comparatifs et recommandations</li>
                <li>Contenu de l&apos;Academy (cours, workshops)</li>
              </ul>

              <h2 className="text-h2 mt-8 mb-3">Sources Non Acceptées</h2>
              <p className="text-body text-text-secondary mb-4">
                Nous n&apos;utilisons pas comme sources : les contenus non vérifiés issus de forums anonymes, 
                les rumeurs non confirmées, les informations provenant de sites sans crédibilité établie, 
                ou les affirmations non étayées par des données vérifiables.
              </p>

              <h2 className="text-h2 mt-8 mb-3">Contact</h2>
              <p className="text-body text-text-secondary mb-4">
                Pour signaler une inexactitude factuelle dans nos contenus, écrivez à 
                <a href="mailto:contact@weblancia.com" className="text-accent hover:underline"> contact@weblancia.com</a>. 
                Notre équipe examine chaque signalement et applique les corrections nécessaires selon 
                notre <a href="/legal/correction-policy" className="text-accent hover:underline">politique de correction</a>.
              </p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
    </>
  )
}
