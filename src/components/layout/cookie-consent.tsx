"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/i18n/provider"

type ConsentStatus = "accepted" | "declined" | null

interface CookieConsentContext {
  consented: boolean
  status: ConsentStatus
}

const CookieConsentCtx = createContext<CookieConsentContext>({ consented: false, status: null })

export function useCookieConsent() {
  return useContext(CookieConsentCtx)
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const { t } = useLocale()
  const [status, setStatus] = useState<ConsentStatus>(null)

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent") as ConsentStatus | null
    setStatus(stored)
  }, [])

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setStatus("accepted")
  }

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setStatus("declined")
  }

  return (
    <CookieConsentCtx.Provider value={{ consented: status === "accepted", status }}>
      {children}
      <AnimatePresence>
        {status === null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border p-4 md:p-6"
          >
            <div className="container-page flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-body-sm text-text-secondary max-w-[640px]">
                {t("cookie.message")}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <Button variant="ghost" size="sm" onClick={decline}>
                  {t("cookie.decline")}
                </Button>
                <Button variant="primary" size="sm" onClick={accept}>
                  {t("cookie.accept")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CookieConsentCtx.Provider>
  )
}