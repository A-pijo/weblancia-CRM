export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}
