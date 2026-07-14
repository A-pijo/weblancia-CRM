import { cn } from "@/lib/utils/cn"
import { getInitials } from "@/lib/utils/string"
import type { Testimonial } from "@/types/common"

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "bg-bg-secondary border border-border rounded-radius-lg p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "flex flex-col",
      )}
    >
      <blockquote className="text-body leading-relaxed mb-6 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center shrink-0" aria-hidden="true">
          <span className="text-sm font-semibold text-accent">{getInitials(testimonial.author)}</span>
        </div>
        <div>
          <p className="text-caption font-semibold">{testimonial.author}</p>
          <p className="text-caption text-text-tertiary">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
      {testimonial.result && (
        <p className="text-accent font-bold mt-4">{testimonial.result}</p>
      )}
    </div>
  )
}

export { TestimonialCard }
