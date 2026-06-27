"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { startProjectSchema, type StartProjectFormData } from "@/lib/validation"
import { useFormSubmission } from "@/lib/hooks/use-form-submission"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CheckCircle, WarningCircle } from "@/components/icons"

const projectTypeOptions = [
  { value: "site-web", label: "Site web" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobile", label: "Application mobile" },
  { value: "web-app", label: "Application web" },
  { value: "branding", label: "Branding & Design" },
  { value: "seo-marketing", label: "SEO & Marketing" },
  { value: "audit", label: "Audit" },
  { value: "autre", label: "Autre" },
]

const budgetOptions = [
  { value: "moins-15k", label: "Moins de 15 000 DH" },
  { value: "15k-30k", label: "15 000 - 30 000 DH" },
  { value: "30k-60k", label: "30 000 - 60 000 DH" },
  { value: "60k-100k", label: "60 000 - 100 000 DH" },
  { value: "100k-plus", label: "100 000+ DH" },
]

const timelineOptions = [
  { value: "urgent", label: "Urgent (moins d'un mois)" },
  { value: "1-3", label: "1-3 mois" },
  { value: "3-6", label: "3-6 mois" },
  { value: "6-plus", label: "6+ mois" },
  { value: "flexible", label: "Pas de date précise" },
]

const sourceOptions = [
  { value: "google", label: "Google" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "bouche-a-oreille", label: "Bouche-à-oreille" },
  { value: "autre", label: "Autre" },
]

export function StartProjectForm() {
  const { state, errorMessage, submit } = useFormSubmission({
    apiEndpoint: "/api/start-project",
    redirectWhatsApp: true,
    whatsappMessage: "Bonjour ! Je viens de soumettre un projet via votre site web.",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StartProjectFormData>({
    resolver: zodResolver(startProjectSchema),
    defaultValues: {
      name: "", email: "", phone: "", company: "", projectType: "", budget: "",
      timeline: "", description: "", source: "", consent: false as unknown as true, honeypot: "",
    },
  })

  const consentValue = watch("consent")

  const onSubmit = async (data: StartProjectFormData) => {
    await submit(data as unknown as Record<string, unknown>)
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h3 className="text-h3 font-semibold mb-2">Merci !</h3>
        <p className="text-body text-text-secondary max-w-md">
          Nous avons bien reçu votre projet. Notre équipe vous contactera sous 48 heures pour discuter des détails.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl mx-auto">
      <input type="text" {...register("honeypot")} className="opacity-0 absolute h-0 w-0 -z-10" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <fieldset className="border-none p-0 m-0">
        <legend className="sr-only">Informations personnelles</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-h3 font-semibold mb-1">Informations personnelles</h3>
            <p className="text-body text-text-secondary mb-6">Comment pouvons-nous vous contacter ?</p>
          </div>
          <Input label="Nom complet" id="sp-name" placeholder="Votre nom" error={errors.name?.message} {...register("name")} />
          <Input label="Email" id="sp-email" type="email" placeholder="votre@email.com" error={errors.email?.message} {...register("email")} />
          <Input label="Téléphone" id="sp-phone" type="tel" placeholder="+212 XXXXXXXXX" {...register("phone")} />
          <Input label="Entreprise (optionnel)" id="sp-company" placeholder="Nom de votre entreprise" {...register("company")} />
        </div>
      </fieldset>

      <fieldset className="border-none p-0 m-0">
        <legend className="sr-only">Votre projet</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="md:col-span-2">
            <hr className="border-border mb-8" />
            <h3 className="text-h3 font-semibold mb-1">Votre projet</h3>
            <p className="text-body text-text-secondary mb-6">Parlez-nous de votre vision.</p>
          </div>
          <Select label="Type de projet" id="sp-project-type" placeholder="Sélectionnez un type" options={projectTypeOptions} error={errors.projectType?.message} {...register("projectType")} />
          <Select label="Budget" id="sp-budget" placeholder="Sélectionnez un budget" options={budgetOptions} error={errors.budget?.message} {...register("budget")} />
          <Select label="Délai souhaité" id="sp-timeline" placeholder="Sélectionnez un délai" options={timelineOptions} error={errors.timeline?.message} {...register("timeline")} />
          <Select label="Comment nous avez-vous connu ?" id="sp-source" placeholder="Sélectionnez une option" options={sourceOptions} {...register("source")} />
          <div className="md:col-span-2">
            <Textarea label="Description du projet" id="sp-description" placeholder="Décrivez votre projet en détail..." rows={6} error={errors.description?.message} {...register("description")} />
          </div>
        </div>
      </fieldset>

      <div className="mb-8">
        <hr className="border-border mb-8" />
        <Checkbox label="J'accepte les conditions de confidentialité" id="sp-consent" error={!!errors.consent} checked={consentValue as boolean} {...register("consent")} />
        {errors.consent && (
          <p className="text-[13px]/[18px] text-danger flex items-center gap-1 mt-1" role="alert">
            <WarningCircle size={14} /> {errors.consent.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-radius-md bg-danger-bg text-danger text-body-sm mb-6" role="alert">
          {errorMessage}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full md:w-auto" loading={state === "loading"}>
        Envoyer mon projet
      </Button>
    </form>
  )
}