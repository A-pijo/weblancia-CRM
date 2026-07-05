import { Container } from "@/components/shared/container"
import { SectionHeader } from "@/components/shared/section-header"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import type { FAQ } from "@/types/common"

interface FAQSectionProps {
  items: FAQ[]
  title?: string
}

function FAQSection({ items, title = "Frequently asked questions" }: FAQSectionProps) {
  const faqSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg">
      <Container>
        <SectionHeader title={title} align="center" />
        <div className="max-w-3xl mx-auto">
          <Accordion>
            {items.map((item, index) => (
              <AccordionItem key={index} title={item.question}>
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Container>
    </section>
  )
}

export { FAQSection }
