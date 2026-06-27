export interface Course {
  slug: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: string;
  price: string;
  image?: string;
  lessons: number;
  projects: number;
}
