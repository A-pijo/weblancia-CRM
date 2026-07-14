"use client"

import { useEffect } from "react"
import { useCookieConsent } from "@/components/layout/cookie-consent"
import Script from "next/script"
const GA_ID = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_MEASUREMENT_ID || "" : ""
const CLARITY_ID_VAL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_CLARITY_ID || process.env.CLARITY_ID || "" : ""
const GSC_VERIFICATION_VAL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GSC_VERIFICATION || process.env.GSC_VERIFICATION || "" : ""

export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const { consented } = useCookieConsent()

  if (!GA_ID || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            cookie_flags: 'samesite=none;secure',
          });
        `}
      </Script>
    </>
  )
}

export function MicrosoftClarity({ nonce }: { nonce?: string }) {
  const { consented } = useCookieConsent()

  useEffect(() => {
    if (!CLARITY_ID_VAL || !consented) return
    try {
      const script = document.createElement("script")
      if (nonce) script.nonce = nonce
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID_VAL}");
      `
      document.head.appendChild(script)
    } catch {
      // Clarity blocked by ad blocker
    }
  }, [consented])

  return null
}

export function GoogleSearchConsoleVerification() {
  if (!GSC_VERIFICATION_VAL) return null
  return <meta name="google-site-verification" content={GSC_VERIFICATION_VAL} />
}