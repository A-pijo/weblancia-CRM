import { getInitials } from "@/lib/utils/string"
import type { TeamMember } from "@/types/team"
import { PersonJsonLd } from "@/components/shared/json-ld"
import { siteConfig } from "@/lib/constants/site"

interface TeamCardProps {
  member: TeamMember
}

function TeamCard({ member }: TeamCardProps) {
  const sameAs = [member.social?.linkedin, member.social?.twitter].filter(Boolean) as string[]
  return (
    <div className="text-center group">
      <PersonJsonLd name={member.name} jobTitle={member.role} url={`${siteConfig.url}/about/team#member-${member.id}`} sameAs={sameAs.length > 0 ? sameAs : undefined} image={member.photo ? `${siteConfig.url}${member.photo}` : undefined} />
      <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4 overflow-hidden">
        <span className="text-xl font-semibold text-accent">{getInitials(member.name)}</span>
      </div>
      <h3 className="text-body font-semibold mb-1 group-hover:text-accent transition-colors">{member.name}</h3>
      <p className="text-caption text-text-secondary mb-2">{member.role}</p>
      <p className="text-body-sm text-text-tertiary line-clamp-2 max-w-xs mx-auto mb-2">
        {member.bio}
      </p>
      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {member.social?.linkedin && (
          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-caption text-accent hover:underline" aria-label={`LinkedIn de ${member.name}`}>LinkedIn</a>
        )}
        {member.social?.twitter && (
          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-caption text-accent hover:underline" aria-label={`Twitter de ${member.name}`}>Twitter</a>
        )}
      </div>
    </div>
  )
}

export { TeamCard }
