"use client"

import { useEffect } from "react"
import { useCookieConsent } from "@/components/layout/cookie-consent"
import Script from "next/script"
import { env } from "@/lib/env"

export function GoogleAnalytics() {
  const { consented } = useCookieConsent()

  if (!env.GA_MEASUREMENT_ID || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${env.GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            cookie_flags: 'samesite=none;secure',
          });
        `}
      </Script>
    </>
  )
}

export function MicrosoftClarity() {
  const { consented } = useCookieConsent()

  useEffect(() => {
    if (!env.CLARITY_ID || !consented) return
    try {
      const script = document.createElement("script")
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${env.CLARITY_ID}");
      `
      document.head.appendChild(script)
    } catch {
      // Clarity blocked by ad blocker
    }
  }, [consented])

  return null
}

export function GoogleSearchConsoleVerification() {
  if (!env.GSC_VERIFICATION) return null
  return <meta name="google-site-verification" content={env.GSC_VERIFICATION} />
}