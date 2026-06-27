export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface TeamMemberRow {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  email: string | null;
  phone: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio ?? "",
    photo: row.image ?? undefined,
    social: {
      linkedin: row.linkedin ?? undefined,
      twitter: row.twitter ?? undefined,
    },
  }
}
