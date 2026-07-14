type LogLevel = "debug" | "info" | "warn" | "error" | "security" | "audit" | "performance"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  module?: string
  data?: unknown
  requestId?: string
  duration?: number
}

const isDev = process.env.NODE_ENV !== "production"
const enabledLevels: Set<LogLevel> = new Set(isDev ? ["debug", "info", "warn", "error", "security", "audit", "performance"] : ["info", "warn", "error", "security", "audit"])

function formatEntry(entry: LogEntry): string {
  const parts = [`[${entry.timestamp}]`, `[${entry.level.toUpperCase()}]`]
  if (entry.module) parts.push(`[${entry.module}]`)
  if (entry.requestId) parts.push(`[${entry.requestId}]`)
  if (entry.duration !== undefined) parts.push(`[${entry.duration}ms]`)
  parts.push(entry.message)
  return parts.join(" ")
}

function createLogFn(level: LogLevel) {
  return (message: string, data?: unknown, module?: string) => {
    if (!enabledLevels.has(level)) return
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      module,
      data,
    }
    const formatted = formatEntry(entry)
    switch (level) {
      case "error":
        console.error(formatted, data !== undefined ? data : "")
        break
      case "warn":
        console.warn(formatted, data !== undefined ? data : "")
        break
      case "security":
      case "audit":
        console.log(formatted, data !== undefined ? data : "")
        break
      default:
        if (isDev) console.log(formatted, data !== undefined ? data : "")
    }
  }
}

function createPerfLogFn() {
  return (message: string, duration: number, module?: string) => {
    if (!enabledLevels.has("performance")) return
    const entry: LogEntry = {
      level: "performance",
      message,
      timestamp: new Date().toISOString(),
      module,
      duration,
    }
    if (isDev) {
      console.log(formatEntry(entry))
    }
  }
}

export const logger = {
  debug: createLogFn("debug"),
  info: createLogFn("info"),
  warn: createLogFn("warn"),
  error: createLogFn("error"),
  security: createLogFn("security"),
  audit: createLogFn("audit"),
  performance: createPerfLogFn(),
}
