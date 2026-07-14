import { ImageResponse } from "next/og"

export const alt = "Weblancia — Agence Digitale Premium Fès"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const dynamic = "force-dynamic"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Weblancia
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#a0a0a0",
            marginBottom: 24,
          }}
        >
          Premium Digital Agency
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "#666666",
          }}
        >
          Fès · Morocco
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
