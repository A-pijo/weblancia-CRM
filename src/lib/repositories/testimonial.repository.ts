import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.testimonial

export class TestimonialRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.testimonial, "testimonial") }
  async toggleStatus(id: number, isActive: boolean) { return this.model.update({ where: { id }, data: { isActive } }) }
}

export const testimonialRepository = new TestimonialRepository()
