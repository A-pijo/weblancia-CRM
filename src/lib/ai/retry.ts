import { aiConfig } from "./config"
import { logger } from "./logger"

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message ?? ""
  const name = error.name ?? ""
  return (
    msg.includes("429") ||
    msg.includes("500") ||
    msg.includes("503") ||
    msg.includes("timeout") ||
    msg.includes("rate limit") ||
    msg.includes("quota") ||
    msg.includes("Too Many Requests") ||
    msg.includes("Internal Server Error") ||
    msg.includes("Service Unavailable") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    name === "TimeoutError" ||
    name === "AbortError"
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
  const maxAttempts = aiConfig.retry.maxAttempts
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts && isRetryableError(error)) {
        const delay = aiConfig.retry.baseDelayMs * attempt
        logger.warn(`${context} failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms...`, {
          error: error instanceof Error ? error.message : String(error),
        })
        await sleep(delay)
      } else {
        throw error
      }
    }
  }

  throw lastError
}
