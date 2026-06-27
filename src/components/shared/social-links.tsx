import { LinkedinLogo, XLogo, InstagramLogo, YoutubeLogo } from "@/components/icons"
import { cn } from "@/lib/utils/cn"
import { siteConfig } from "@/lib/constants/site"

interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  const { social } = siteConfig
  const size = 20

  const links = [
    { href: social.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
    { href: social.twitter, label: "X (Twitter)", Icon: XLogo },
    { href: social.instagram, label: "Instagram", Icon: InstagramLogo },
    { href: social.youtube, label: "YouTube", Icon: YoutubeLogo },
  ]

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-accent transition-colors duration-200"
          aria-label={label}
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  )
}
