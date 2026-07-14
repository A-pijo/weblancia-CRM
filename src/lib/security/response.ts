import { NextResponse } from "next/server"

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  meta?: Record<string, unknown>
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export function success<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  const body: ApiSuccess<T> = { success: true, data }
  if (meta) body.meta = meta
  return NextResponse.json(body, { status })
}

export function created<T>(data: T, meta?: Record<string, unknown>) {
  return success(data, meta, 201)
}

export function badRequest(message: string, details?: unknown) {
  const body: ApiError = { success: false, error: { code: "BAD_REQUEST", message, details } }
  return NextResponse.json(body, { status: 400 })
}

export function unauthorized(message = "Non authentifié") {
  const body: ApiError = { success: false, error: { code: "UNAUTHORIZED", message } }
  return NextResponse.json(body, { status: 401 })
}

export function forbidden(message = "Accès refusé") {
  const body: ApiError = { success: false, error: { code: "FORBIDDEN", message } }
  return NextResponse.json(body, { status: 403 })
}

export function notFound(message = "Ressource introuvable") {
  const body: ApiError = { success: false, error: { code: "NOT_FOUND", message } }
  return NextResponse.json(body, { status: 404 })
}

export function conflict(message: string) {
  const body: ApiError = { success: false, error: { code: "CONFLICT", message } }
  return NextResponse.json(body, { status: 409 })
}

export function tooMany(message = "Trop de requêtes. Réessayez plus tard.") {
  const body: ApiError = { success: false, error: { code: "RATE_LIMITED", message } }
  return NextResponse.json(body, { status: 429 })
}

export function serverError(error?: unknown) {
  if (error && process.env.NODE_ENV === "development") {
    console.error("[API Error]", error)
  }
  const body: ApiError = {
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Une erreur interne est survenue." },
  }
  return NextResponse.json(body, { status: 500 })
}

export function validationError(errors: unknown) {
  const body: ApiError = {
    success: false,
    error: { code: "VALIDATION_ERROR", message: "Données invalides.", details: errors },
  }
  return NextResponse.json(body, { status: 422 })
}
