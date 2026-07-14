import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { logger } from "@/lib/logger"

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL
  try {
    const adapter = new PrismaPg({ connectionString: dbUrl })
    const client = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })
    return client
  } catch (err) {
    if (err instanceof Error && err.stack) {
      logger.error("PrismaClient construction failed", err, "database")
    }
    throw err
  }
}

export const prisma: PrismaClient =
  globalForPrisma.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma
}

export async function isDbAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (err) {
    return false
  }
}

export async function dbDiagnostics() {
  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename`
    const userCount = await prisma.user.count()
    return {
      connected: true,
      tableCount: tables.length,
      tables: tables.map((t) => t.tablename),
      userCount,
      dbName: process.env.DATABASE_URL?.split("/").pop()?.split("?").shift() || "unknown",
    }
  } catch (error) {
    logger.error("DB diagnostics failed", error, "database")
    return { connected: false, tableCount: 0, tables: [], userCount: 0, dbName: "unknown" }
  }
}
