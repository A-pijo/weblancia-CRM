import type { TeamMember } from "@/types/team"

interface TeamCardProps {
  member: TeamMember
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
        <span className="text-xl font-semibold text-accent">{getInitials(member.name)}</span>
      </div>
      <h3 className="text-body font-semibold mb-1">{member.name}</h3>
      <p className="text-caption text-text-secondary mb-2">{member.role}</p>
      <p className="text-body-sm text-text-tertiary line-clamp-2 max-w-xs mx-auto">
        {member.bio}
      </p>
    </div>
  )
}

export { TeamCard }
