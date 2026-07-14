export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: unknown
  public isOperational: boolean

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details)
  }
}

export class AuthError extends AppError {
  constructor(message = "Non authentifie") {
    super(message, 401, "UNAUTHORIZED")
  }
}

export class PermissionError extends AppError {
  constructor(message = "Acces refuse") {
    super(message, 403, "FORBIDDEN")
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Ressource introuvable") {
    super(message, 404, "NOT_FOUND")
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT")
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Trop de requetes. Reessayez plus tard.") {
    super(message, 429, "RATE_LIMITED")
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Erreur de base de donnees", details?: unknown) {
    super(message, 500, "DATABASE_ERROR", details)
    this.isOperational = false
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = "Erreur de service externe", details?: unknown) {
    super(message, 502, "EXTERNAL_SERVICE_ERROR", details)
    this.isOperational = false
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function toResponse(error: AppError) {
  return {
    success: false as const,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    },
  }
}
