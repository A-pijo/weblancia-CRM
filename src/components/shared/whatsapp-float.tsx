"use client"

import { cn } from "@/lib/utils/cn"
import { usePathname } from "next/navigation"

function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-14-14l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72,24,24,0,0,1,19.12-23.45l11.44,22.88-8.36,12.53a8,8,0,0,0-.56,7.91,56.6,56.6,0,0,0,22.49,22.49,8,8,0,0,0,7.91-.56l12.53-8.36,22.88,11.44A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.19,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.36A104,104,0,1,0,128,24Zm0,192a87.6,87.6,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" />
    </svg>
  )
}

export function WhatsAppFloat() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) return null
  if (typeof process === "undefined") return null
  if (process.env.NEXT_PUBLIC_WHATSAPP_ENABLED !== "true") return null

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  const message = encodeURIComponent("Bonjour ! Je suis intéressé(e) par vos services.")
  const href = `https://wa.me/${number}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-20 lg:bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full bg-[#25D366] text-white",
        "flex items-center justify-center",
        "shadow-lg hover:shadow-xl hover:scale-110",
        "transition-all duration-300 ease-out",
        "hover:bg-[#22c35e]",
      )}
      aria-label="Contactez-nous sur WhatsApp"
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}
