import { prisma } from "@/lib/database/prisma"
import { Prisma } from "@/generated/prisma/client"

type PrismaModel = {
  findUnique: (args: any) => any
  findMany: (args: any) => any
  findFirst: (args: any) => any
  create: (args: any) => any
  update: (args: any) => any
  delete: (args: any) => any
  count: (args: any) => any
  upsert: (args: any) => any
  createMany: (args: any) => any
  updateMany: (args: any) => any
  deleteMany: (args: any) => any
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class BaseRepository<TDelegate extends PrismaModel> {
  protected readonly model: TDelegate
  protected readonly modelName: string

  constructor(model: TDelegate, modelName: string) {
    this.model = model
    this.modelName = modelName
  }

  async findById(id: number | string): Promise<Prisma.Result<TDelegate, any, "findUnique"> | null> {
    return this.model.findUnique({ where: { id: Number(id) } })
  }

  async findMany(params?: {
    where?: any
    orderBy?: any
    include?: any
    select?: any
    skip?: number
    take?: number
  }): Promise<Prisma.Result<TDelegate, any, "findMany">> {
    return this.model.findMany(params || {})
  }

  async findPaginated(params: PaginationParams & {
    where?: any
    orderBy?: any
    include?: any
    select?: any
  }): Promise<PaginatedResult<Prisma.Result<TDelegate, any, "findMany">[0]>> {
    const page = Math.max(1, params.page || 1)
    const limit = Math.min(100, Math.max(1, params.limit || 10))
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      this.model.findMany({ where: params.where, orderBy: params.orderBy, include: params.include, select: params.select, skip, take: limit }),
      this.model.count({ where: params.where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async create(data: any): Promise<Prisma.Result<TDelegate, any, "create">> {
    return this.model.create({ data })
  }

  async update(id: number | string, data: any): Promise<Prisma.Result<TDelegate, any, "update">> {
    return this.model.update({ where: { id: Number(id) }, data })
  }

  async delete(id: number | string): Promise<Prisma.Result<TDelegate, any, "delete">> {
    return this.model.delete({ where: { id: Number(id) } })
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where })
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where })
    return count > 0
  }

  async upsert(where: any, create: any, update: any): Promise<Prisma.Result<TDelegate, any, "upsert">> {
    return this.model.upsert({ where, create, update })
  }
}
