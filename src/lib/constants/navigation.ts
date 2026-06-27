export interface NavLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}

export const mainNavLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Academy", href: "/academy" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export const servicesMegaMenu: MegaMenuColumn[] = [
  {
    title: "Web Development",
    links: [
      { label: "Corporate Websites", href: "/services/web-development/corporate-websites" },
      { label: "Landing Pages", href: "/services/web-development/landing-pages" },
      { label: "E-commerce", href: "/services/web-development/ecommerce" },
      { label: "Web Applications", href: "/services/web-development/web-applications" },
      { label: "Mobile Apps", href: "/services/web-development/mobile-apps" },
      { label: "Custom Software", href: "/services/web-development/custom-software" },
    ],
  },
  {
    title: "Digital Marketing",
    links: [
      { label: "SEO", href: "/services/digital-marketing/seo" },
      { label: "Local SEO", href: "/services/digital-marketing/local-seo" },
      { label: "Technical SEO", href: "/services/digital-marketing/technical-seo" },
      { label: "Google Ads", href: "/services/digital-marketing/google-ads" },
      { label: "Meta Ads", href: "/services/digital-marketing/meta-ads" },
      { label: "Community Management", href: "/services/digital-marketing/community-management" },
    ],
  },
  {
    title: "Branding & Design",
    links: [
      { label: "Brand Identity", href: "/services/branding-design/brand-identity" },
      { label: "Logo Design", href: "/services/branding-design/logo-design" },
      { label: "UI/UX Design", href: "/services/branding-design/ui-ux-design" },
    ],
  },
  {
    title: "Consulting",
    links: [
      { label: "Startup Consulting", href: "/services/consulting/startup-consulting" },
      { label: "Business Consulting", href: "/services/consulting/business-consulting" },
      { label: "Technical Consulting", href: "/services/consulting/technical-consulting" },
      { label: "Strategy Consulting", href: "/services/consulting/strategy-consulting" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "Laravel", href: "/services/technology/laravel" },
      { label: "React / Next.js", href: "/services/technology/react-nextjs" },
      { label: "WordPress", href: "/services/technology/wordpress" },
      { label: "Flutter", href: "/services/technology/flutter" },
      { label: "PHP / JS / TS", href: "/services/technology/javascript-typescript" },
    ],
  },
  {
    title: "Maintenance",
    links: [
      { label: "Website Maintenance", href: "/services/maintenance-support/website-maintenance" },
      { label: "Hosting", href: "/services/maintenance-support/hosting" },
      { label: "Professional Emails", href: "/services/maintenance-support/professional-emails" },
      { label: "Website Migration", href: "/services/maintenance-support/website-migration" },
    ],
  },
  {
    title: "Automation",
    links: [
      { label: "API Integration", href: "/services/automation/api-integration" },
      { label: "Data Scraping", href: "/services/automation/data-scraping" },
      { label: "Workflow Automation", href: "/services/automation/workflow-automation" },
      { label: "CRM / ERP", href: "/services/automation/crm-erp" },
      { label: "Booking Systems", href: "/services/automation/booking-systems-marketplace" },
    ],
  },
  {
    title: "Audit",
    links: [
      { label: "Website Audit", href: "/services/audit/website-audit" },
      { label: "SEO Audit", href: "/services/audit/seo-audit" },
      { label: "Security Audit", href: "/services/audit/security-audit" },
      { label: "Performance Audit", href: "/services/audit/performance-audit" },
    ],
  },
];

export const academyMegaMenu: MegaMenuColumn[] = [
  {
    title: "Courses",
    links: [
      { label: "Web Development", href: "/academy/courses" },
      { label: "Laravel", href: "/academy/courses" },
      { label: "React & Next.js", href: "/academy/courses" },
      { label: "WordPress", href: "/academy/courses" },
      { label: "Flutter", href: "/academy/courses" },
      { label: "Digital Marketing", href: "/academy/courses" },
      { label: "SEO", href: "/academy/courses" },
      { label: "UI/UX Design", href: "/academy/courses" },
      { label: "Office / Excel", href: "/academy/courses" },
    ],
  },
  {
    title: "Workshops",
    links: [
      { label: "Upcoming Workshops", href: "/academy/workshops" },
      { label: "Recorded Workshops", href: "/academy/workshops" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free Guides", href: "/academy/resources" },
      { label: "Templates", href: "/academy/resources" },
      { label: "Toolkits", href: "/academy/resources" },
      { label: "E-books", href: "/academy/resources" },
    ],
  },
  {
    title: "Certificates",
    links: [
      { label: "Programs", href: "/academy/certificates" },
      { label: "Verify Certificate", href: "/academy/certificates" },
    ],
  },
  {
    title: "Careers",
    links: [
      { label: "Internships", href: "/academy/careers" },
      { label: "Jobs", href: "/academy/careers" },
    ],
  },
];
