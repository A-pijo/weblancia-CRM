import type { z } from "zod"
import { validationError } from "./response"

export type ValidationResult<T> =
  | { data: T; error: never }
  | { data: never; error: Response }

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
): ValidationResult<z.infer<T>> {
  const result = schema.safeParse(input)
  if (!result.success) {
    return {
      data: undefined as never,
      error: validationError(result.error.flatten().fieldErrors),
    }
  }
  return { data: result.data, error: undefined as never }
}

export function validateStrict<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
): z.infer<T> {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new Error(`Validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`)
  }
  return result.data
}

const MAX_BODY_SIZE = 1_048_576 // 1 MB

export async function parseBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
): Promise<ValidationResult<z.infer<T>>> {
  const contentLength = request.headers.get("content-length")
  if (contentLength && Number(contentLength) > MAX_BODY_SIZE) {
    return {
      data: undefined as never,
      error: validationError("Le corps de la requête ne doit pas dépasser 1 Mo."),
    }
  }
  if (!contentLength) {
    const reader = request.body?.getReader()
    if (reader) {
      let total = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        total += value.length
        if (total > MAX_BODY_SIZE) {
          reader.cancel()
          return {
            data: undefined as never,
            error: validationError("Le corps de la requête ne doit pas dépasser 1 Mo."),
          }
        }
      }
    }
  }
  try {
    const body = await request.json()
    return validate(schema, body)
  } catch {
    return {
      data: undefined as never,
      error: validationError("Le corps de la requête doit être un JSON valide."),
    }
  }
}

export function validateQuery<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams,
): ValidationResult<z.infer<T>> {
  const obj: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    obj[key] = value
  })
  return validate(schema, obj)
}
