"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactFormData } from "@/lib/validation"
import { useFormSubmission } from "@/lib/hooks/use-form-submission"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CheckCircle, WarningCircle } from "@/components/icons"

const subjectOptions = [
  { value: "devis", label: "Demande de devis" },
  { value: "support", label: "Support technique" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
]

export function ContactForm() {
  const { state, errorMessage, submit } = useFormSubmission({
    apiEndpoint: "/api/contact",
    redirectWhatsApp: true,
    whatsappMessage: "Bonjour ! Je viens de vous envoyer un message via le formulaire de contact.",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "", consent: false as unknown as true, honeypot: "" },
  })

  const consentValue = watch("consent")

  const onSubmit = async (data: ContactFormData) => {
    await submit(data as unknown as Record<string, unknown>)
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h3 className="text-h3 font-semibold mb-2">Merci !</h3>
        <p className="text-body text-text-secondary max-w-md">
          Nous avons bien reçu votre message. Notre équipe vous répondra sous 48 heures.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <input type="text" {...register("honeypot")} className="opacity-0 absolute h-0 w-0 -z-10" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <Input
        label="Nom complet"
        id="contact-name"
        placeholder="Votre nom"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        id="contact-email"
        type="email"
        placeholder="votre@email.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Téléphone (optionnel)"
        id="contact-phone"
        type="tel"
        placeholder="+212 XXXXXXXXX"
        {...register("phone")}
      />
      <Select
        label="Sujet"
        id="contact-subject"
        placeholder="Sélectionnez un sujet"
        options={subjectOptions}
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label="Message"
        id="contact-message"
        placeholder="Votre message..."
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />
      <div>
        <Checkbox
          label="J'accepte d'être contacté"
          id="contact-consent"
          error={!!errors.consent}
          checked={consentValue as boolean}
          {...register("consent")}
        />
        {errors.consent && (
          <p className="text-[13px]/[18px] text-danger flex items-center gap-1 mt-1" role="alert">
            <WarningCircle size={14} /> {errors.consent.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-radius-md bg-danger-bg text-danger text-body-sm" role="alert">
          {errorMessage}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full md:w-auto" loading={state === "loading"}>
        Envoyer le message
      </Button>
    </form>
  )
}