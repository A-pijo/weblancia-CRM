import { db } from "@/lib/db"

export async function getAcademyCategories() {
  return db.academyCategory.findMany({ orderBy: { displayOrder: "asc" } })
}

export async function getAcademyCategoryById(id: number) {
  return db.academyCategory.findUnique({ where: { id } })
}

export async function getAcademyCategoryBySlug(slug: string) {
  return db.academyCategory.findUnique({ where: { slug } })
}

export async function createAcademyCategory(data: Record<string, unknown>) {
  return db.academyCategory.create({
    data: {
      slug: data.slug as string,
      title: data.title as string,
      description: (data.description as string) ?? null,
      icon: (data.icon as string) ?? null,
      displayOrder: (data.displayOrder as number) ?? 0,
    },
  })
}

export async function updateAcademyCategory(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = ["slug", "title", "description", "icon", "displayOrder"]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.academyCategory.update({ where: { id }, data: updateData })
}

export async function deleteAcademyCategory(id: number) {
  const related = await Promise.all([
    db.course.count({ where: { academyCategoryId: id } }),
    db.workshop.count({ where: { academyCategoryId: id } }),
    db.resource.count({ where: { academyCategoryId: id } }),
    db.certificate.count({ where: { academyCategoryId: id } }),
  ])
  if (related.some((count) => count > 0)) {
    throw new Error(
      "Cannot delete category with related courses, workshops, resources, or certificates. Remove them first."
    )
  }
  return db.academyCategory.delete({ where: { id } })
}

export async function permanentlyDeleteAcademyCategory(id: number) {
  return db.academyCategory.delete({ where: { id } })
}
