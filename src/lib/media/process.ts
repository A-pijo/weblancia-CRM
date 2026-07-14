import sharp from "sharp"

export interface ProcessedImage {
  original: Buffer
  webp: Buffer
  thumbnail: Buffer
  dimensions: { width: number; height: number }
}

export async function processImage(buffer: Buffer, mimeType: string): Promise<ProcessedImage> {
  const image = sharp(buffer)
  const metadata = await image.metadata()
  const { width = 0, height = 0 } = metadata

  const webp = await image.clone().webp({ quality: 80, effort: 4 }).toBuffer()

  const thumbnailWidth = Math.min(width, 300)
  const thumbnail = await image
    .clone()
    .resize(thumbnailWidth, undefined, { fit: "cover", withoutEnlargement: true })
    .webp({ quality: 70, effort: 3 })
    .toBuffer()

  return { original: buffer, webp, thumbnail, dimensions: { width, height } }
}

export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata()
  return { width: metadata.width ?? 0, height: metadata.height ?? 0 }
}
