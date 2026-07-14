import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type MediaDelegate = typeof prisma.media
export class MediaRepository extends BaseRepository<MediaDelegate> {
  constructor() { super(prisma.media, "media") }
}

type SettingDelegate = typeof prisma.setting
export class SettingRepository extends BaseRepository<SettingDelegate> {
  constructor() { super(prisma.setting, "setting") }
  async findByKey(key: string) { return this.model.findUnique({ where: { key } }) }
  async upsertByKey(key: string, value: string) {
    return this.model.upsert({ where: { key }, create: { key, value }, update: { value } })
  }
}

type FormContactDelegate = typeof prisma.contactRequest
export class FormContactRepository extends BaseRepository<FormContactDelegate> {
  constructor() { super(prisma.contactRequest, "contactRequest") }
  async markRead(id: number) { return this.model.update({ where: { id }, data: { isRead: true } }) }
}

type FormBookCallDelegate = typeof prisma.bookCall
export class FormBookCallRepository extends BaseRepository<FormBookCallDelegate> {
  constructor() { super(prisma.bookCall, "bookCall") }
  async confirm(id: number) { return this.model.update({ where: { id }, data: { isConfirmed: true } }) }
}

type FormProjectDelegate = typeof prisma.startProject
export class FormProjectRepository extends BaseRepository<FormProjectDelegate> {
  constructor() { super(prisma.startProject, "startProject") }
  async markRead(id: number) { return this.model.update({ where: { id }, data: { isRead: true } }) }
}

type NewsletterDelegate = typeof prisma.newsletterSubscriber
export class NewsletterRepository extends BaseRepository<NewsletterDelegate> {
  constructor() { super(prisma.newsletterSubscriber, "newsletterSubscriber") }
  async findByEmail(email: string) { return this.model.findUnique({ where: { email } }) }
}
