import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/types/course"
import { Clock, BookOpen, Monitor } from "@/components/icons"

interface CourseCardProps {
  course: Course
}

const levelStyles: Record<string, string> = {
  Beginner: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  Intermediate: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  Advanced: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-radius-lg overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg",
        "group",
      )}
    >
      <div className="relative aspect-video bg-accent-light flex items-center justify-center">
        <Monitor size={48} className="text-accent/40" aria-hidden="true" />
      </div>
      <div className="p-6">
        <Badge size="default" className={cn("mb-3", levelStyles[course.level])}>
          {course.level}
        </Badge>
        <h3 className="text-xl/7 font-semibold mb-2">{course.title}</h3>
        <p className="text-body-sm text-text-secondary line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center gap-4 text-caption text-text-tertiary mb-4">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen size={14} aria-hidden="true" />
            {course.lessons} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Monitor size={14} aria-hidden="true" />
            {course.format}
          </span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span
            className={cn(
              "text-[clamp(1.25rem,1.5vw,1.5rem)] leading-[1.35] font-semibold",
              course.price === "Free" ? "text-[var(--color-success)]" : "text-accent",
            )}
          >
            {course.price}
          </span>
          <span className="text-caption text-text-tertiary">{course.instructor}</span>
        </div>
      </div>
    </div>
  )
}

export { CourseCard }
