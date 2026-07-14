const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
]

const ALLOWED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif",
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
  ".txt", ".csv",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateFileType(mimeType: string, filename: string): FileValidationResult {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."))
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Extension de fichier non autorisée : ${ext}` }
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: `Type MIME non autorisé : ${mimeType}` }
  }
  return { valid: true }
}

export function validateFileSize(size: number): FileValidationResult {
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: `Le fichier dépasse la limite de ${MAX_FILE_SIZE / 1024 / 1024} Mo` }
  }
  if (size <= 0) {
    return { valid: false, error: "Fichier vide" }
  }
  return { valid: true }
}

export function validateFileUpload(mimeType: string, filename: string, size: number): FileValidationResult {
  const typeCheck = validateFileType(mimeType, filename)
  if (!typeCheck.valid) return typeCheck
  return validateFileSize(size)
}

export function sanitizeFilename(filename: string): string {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase()
}
