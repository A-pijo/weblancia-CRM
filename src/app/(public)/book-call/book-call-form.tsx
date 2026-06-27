"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookCallSchema, type BookCallFormData } from "@/lib/validation"
import { useFormSubmission } from "@/lib/hooks/use-form-submission"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CheckCircle, WarningCircle } from "@/components/icons"

const consultationTypeOptions = [
  { value: "strategie", label: "Stratégie digitale" },
  { value: "site-ecommerce", label: "Site web / E-commerce" },
  { value: "seo-marketing", label: "SEO & Marketing" },
  { value: "audit", label: "Audit & Performance" },
  { value: "autre", label: "Autre" },
]

const timeOptions = [
  { value: "matin", label: "Matin 9h-12h" },
  { value: "apres-midi", label: "Après-midi 14h-17h" },
]

export function BookCallForm() {
  const { state, errorMessage, submit } = useFormSubmission({
    apiEndpoint: "/api/book-call",
    redirectWhatsApp: true,
    whatsappMessage: "Bonjour ! Je viens de réserver une consultation via votre site web.",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookCallFormData>({
    resolver: zodResolver(bookCallSchema),
    defaultValues: {
      name: "", email: "", phone: "", company: "", consultationType: "",
      date: "", time: "", notes: "", honeypot: "",
    },
  })

  const onSubmit = async (data: BookCallFormData) => {
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
          Nous confirmons votre rendez-vous par email sous 24 heures. Vous recevrez également un lien WhatsApp pour confirmer.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <input type="text" {...register("honeypot")} className="opacity-0 absolute h-0 w-0 -z-10" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <Input label="Nom complet" id="bc-name" placeholder="Votre nom" error={errors.name?.message} {...register("name")} />
      <Input label="Email" id="bc-email" type="email" placeholder="votre@email.com" error={errors.email?.message} {...register("email")} />
      <Input label="Téléphone" id="bc-phone" type="tel" placeholder="+212 XXXXXXXXX" error={errors.phone?.message} {...register("phone")} />
      <Input label="Entreprise (optionnel)" id="bc-company" placeholder="Nom de votre entreprise" {...register("company")} />
      <Select label="Type de consultation" id="bc-type" placeholder="Sélectionnez un type" options={consultationTypeOptions} error={errors.consultationType?.message} {...register("consultationType")} />
      <Input label="Date souhaitée" id="bc-date" type="date" error={errors.date?.message} {...register("date")} />
      <Select label="Créneau horaire" id="bc-time" placeholder="Sélectionnez un créneau" options={timeOptions} error={errors.time?.message} {...register("time")} />
      <Textarea label="Notes (optionnel)" id="bc-notes" placeholder="Ajoutez des précisions sur votre projet..." rows={4} {...register("notes")} />

      {errorMessage && (
        <div className="p-4 rounded-radius-md bg-danger-bg text-danger text-body-sm" role="alert">
          {errorMessage}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full md:w-auto" loading={state === "loading"}>
        Réserver ma consultation
      </Button>
    </form>
  )
}