import { LinkedinLogo, XLogo, InstagramLogo, YoutubeLogo } from "@/components/icons"
import { cn } from "@/lib/utils/cn"
import { siteConfig } from "@/lib/constants/site"
import type { SiteSettings } from "@/lib/settings"

interface SocialLinksProps {
  className?: string
  settings?: Partial<SiteSettings>
}

export function SocialLinks({ className, settings }: SocialLinksProps) {
  const linkedin = settings?.socialLinkedin ?? siteConfig.social.linkedin
  const twitter = settings?.socialXTwitter ?? siteConfig.social.twitter
  const instagram = settings?.socialInstagram ?? siteConfig.social.instagram
  const youtube = settings?.socialYoutube ?? siteConfig.social.youtube

  const size = 20

  const links = [
    { href: linkedin, label: "LinkedIn", Icon: LinkedinLogo },
    { href: twitter, label: "X (Twitter)", Icon: XLogo },
    { href: instagram, label: "Instagram", Icon: InstagramLogo },
    { href: youtube, label: "YouTube", Icon: YoutubeLogo },
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
