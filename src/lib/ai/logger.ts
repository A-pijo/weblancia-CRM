function timestamp(): string {
  return new Date().toISOString()
}

export const logger = {
  info(msg: string, data?: Record<string, unknown>) {
    const extra = data ? ` ${JSON.stringify(data)}` : ""
    console.log(`[AI] [${timestamp()}] ${msg}${extra}`)
  },

  warn(msg: string, data?: Record<string, unknown>) {
    const extra = data ? ` ${JSON.stringify(data)}` : ""
    console.warn(`[AI] [${timestamp()}] ⚠ ${msg}${extra}`)
  },

  error(msg: string, data?: Record<string, unknown>) {
    const extra = data ? ` ${JSON.stringify(data)}` : ""
    console.error(`[AI] [${timestamp()}] ✗ ${msg}${extra}`)
  },

  start() {
    this.info("Starting article generation...")
  },

  done(durationMs: number, data?: Record<string, unknown>) {
    const seconds = (durationMs / 1000).toFixed(1)
    this.info(`Done in ${seconds}s`, data)
  },
}
