export interface ServiceCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
  outcome: string;
  categorySlug: string;
}
