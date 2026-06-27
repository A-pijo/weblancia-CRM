import { db } from "@/lib/db"

export type SessionWithCourse = Awaited<ReturnType<typeof getSessionById>>

export async function getSessions(courseId: number) {
  return db.courseSession.findMany({
    where: { courseId },
    orderBy: { startDate: "asc" },
  })
}

export async function getSessionById(id: number) {
  return db.courseSession.findUnique({
    where: { id },
    include: { course: { select: { id: true, title: true, slug: true } } },
  })
}

export async function createSession(data: {
  courseId: number
  title: string
  meetingLink?: string
  meetingPassword?: string
  trainer?: string
  startDate: Date
  endDate?: Date
  timezone?: string
  maxParticipants?: number
}) {
  return db.courseSession.create({ data })
}

export async function updateSession(id: number, data: {
  title?: string
  meetingLink?: string
  meetingPassword?: string
  trainer?: string
  startDate?: Date
  endDate?: Date
  timezone?: string
  maxParticipants?: number
}) {
  return db.courseSession.update({ where: { id }, data })
}

export async function deleteSession(id: number) {
  return db.courseSession.delete({ where: { id } })
}
