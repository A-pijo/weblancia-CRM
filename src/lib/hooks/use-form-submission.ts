"use client"

import { useState, useCallback } from "react"

interface UseFormSubmissionOptions {
  apiEndpoint: string
  redirectWhatsApp?: boolean
  whatsappMessage?: string
}

interface WindowWithDataLayer extends Window {
  dataLayer?: Record<string, unknown>[]
}

export function useFormSubmission({ apiEndpoint, redirectWhatsApp = false, whatsappMessage = "" }: UseFormSubmissionOptions) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      setState("loading")
      setErrorMessage("")

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
          setState("error")
          setErrorMessage(result.error || "Une erreur est survenue. Veuillez réessayer.")
          return false
        }

        setState("success")

        if (typeof window !== "undefined") {
          const w = window as WindowWithDataLayer
          if (w.dataLayer) {
            w.dataLayer.push({ event: "formSubmission", formEndpoint: apiEndpoint })
          }
        }

        if (redirectWhatsApp && process.env.NEXT_PUBLIC_WHATSAPP_ENABLED === "true") {
          const encodedMessage = encodeURIComponent(whatsappMessage)
          const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodedMessage}`
          window.open(whatsappUrl, "_blank")
        }

        return true
      } catch {
        setState("error")
        setErrorMessage("Erreur de connexion. Veuillez vérifier votre connexion Internet.")
        return false
      }
    },
    [apiEndpoint, redirectWhatsApp, whatsappMessage],
  )

  const reset = useCallback(() => {
    setState("idle")
    setErrorMessage("")
  }, [])

  return { state, errorMessage, submit, reset }
}