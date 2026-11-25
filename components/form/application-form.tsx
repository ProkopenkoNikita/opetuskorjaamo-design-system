'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { CircleCheck, FileImage, FileText, Loader2, Paperclip, Send, Upload, X } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/shared/notice'
import { useStore } from '@/lib/store'
import type { FormDraft } from '@/lib/types'
import {
  DESCRIPTION_MAX,
  FIELD_LABELS,
  FIELD_ORDER,
  type FieldKey,
  type FormErrors,
  validateDraft,
} from '@/lib/validation'
import { CategoryPicker } from './category-picker'
import { CheckboxField, FieldLabel, TextAreaField, TextField } from './fields'

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-card p-5 md:p-7">
      <header>
        <h2 className="font-sans text-lg font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  )
}

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'])

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kt`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mt`
}

export function ApplicationForm() {
  const router = useRouter()
  const { draft, setDraft, resetDraft, availableCategories, submitRequest, setConsentAccepted, consent } =
    useStore()
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const update = <K extends keyof FormDraft>(key: K, value: FormDraft[K]) => {
    setDraft({ [key]: value } as Partial<FormDraft>)
    if (submitted && key in errors) {
      const next = validateDraft({ ...draft, [key]: value }, availableCategories)
      setErrors((e) => ({ ...e, [key]: next[key as FieldKey] }))
    }
  }

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.currentTarget.files ?? [])
    e.currentTarget.value = ''
    if (selected.length === 0) return

    const unsupported = selected.some(
      (file) => !ALLOWED_ATTACHMENT_EXTENSIONS.has(getFileExtension(file.name)),
    )
    const oversized = selected.some((file) => file.size > MAX_ATTACHMENT_SIZE)
    const accepted = selected.filter(
      (file) =>
        ALLOWED_ATTACHMENT_EXTENSIONS.has(getFileExtension(file.name)) &&
        file.size <= MAX_ATTACHMENT_SIZE,
    )

    const uniqueFiles = accepted.filter(
      (file, index, files) =>
        !draft.attachments.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        ) &&
        files.findIndex(
          (candidate) =>
            candidate.name === file.name &&
            candidate.size === file.size &&
            candidate.lastModified === file.lastModified,
        ) === index,
    )

    if (uniqueFiles.length > 0) {
      update('attachments', [...draft.attachments, ...uniqueFiles])
    }

    if (unsupported && oversized) {
      setAttachmentError('Osa tiedostoista ei ole tuettuja tai ylittää 10 Mt:n enimmäiskoon.')
    } else if (unsupported) {
      setAttachmentError('Tiedostomuotoa ei tueta. Valitse JPG-, PNG-, WEBP-, PDF-, DOC- tai DOCX-tiedosto.')
    } else if (oversized) {
      setAttachmentError('Yksittäisen tiedoston enimmäiskoko on 10 Mt.')
    } else {
      setAttachmentError(null)
    }
  }

  const removeAttachment = (indexToRemove: number) => {
    update(
      'attachments',
      draft.attachments.filter((_, index) => index !== indexToRemove),
    )
    setAttachmentError(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setSubmitError(false)
    const found = validateDraft(draft, availableCategories)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setPending(true)
    try {
      await submitRequest(draft)
      resetDraft()
      setConsentAccepted(false)
      router.push('/hakemus/vastaanotettu')
    } catch {
      setSubmitError(true)
      setPending(false)
      requestAnimationFrame(() => document.getElementById('submit-error')?.focus())
    }
  }

  const errorKeys = FIELD_ORDER.filter((k) => errors[k])

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6" aria-labelledby="form-title">
      {errorKeys.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border-2 border-destructive bg-destructive-soft p-4 outline-none focus-visible:ring-3 focus-visible:ring-destructive/30"
        >
          <p className="font-semibold">
            Tarkista {errorKeys.length === 1 ? 'yksi kenttä' : `${errorKeys.length} kenttää`} ennen lähettämistä
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {errorKeys.map((k) => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  onClick={(ev) => {
                    ev.preventDefault()
                    const el = document.getElementById(k)
                    el?.focus()
                    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
                  }}
                  className="font-medium text-destructive underline underline-offset-2"
                >
                  {FIELD_LABELS[k]}: {errors[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Section title="Yhteystiedot" description="Opettaja vastaa hakemukseesi sähköpostitse.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            id="name"
            label="Nimi"
            required
            autoComplete="name"
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
            className="md:col-span-2"
          />
          <TextField
            id="email"
            label="Sähköposti"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nimi@esimerkki.fi"
            value={draft.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
          <TextField
            id="phone"
            label="Puhelinnumero"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="040 123 4567"
            value={draft.phone}
            onChange={(e) => update('phone', e.target.value)}
            error={errors.phone}
          />
        </div>
      </Section>

      <Section title="Ajoneuvo">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            id="registration"
            label="Rekisterinumero"
            required
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            placeholder="ABC-123"
            value={draft.registration}
            onChange={(e) => update('registration', e.target.value.toUpperCase())}
            error={errors.registration}
            className="[&_input]:font-mono [&_input]:tracking-wider"
          />
          <TextField
            id="mileage"
            label="Kilometrilukema"
            inputMode="numeric"
            placeholder="esim. 185 000"
            value={draft.mileage}
            onChange={(e) => update('mileage', e.target.value)}
          />
          <TextField
            id="make"
            label="Merkki"
            placeholder="esim. Volvo"
            value={draft.make}
            onChange={(e) => update('make', e.target.value)}
          />
          <TextField
            id="model"
            label="Malli"
            placeholder="esim. V70"
            value={draft.model}
            onChange={(e) => update('model', e.target.value)}
          />
        </div>
      </Section>

      <Section title="Työ">
        <CategoryPicker
          value={draft.category}
          onChange={(c) => update('category', c)}
          available={availableCategories}
          error={errors.category}
        />
        <TextAreaField
          id="description"
          label="Vian kuvaus tai korjauspyyntö"
          required
          maxLength={DESCRIPTION_MAX}
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
          error={errors.description}
          hint={
            <>
              <p>Kuvaa ongelma, sen oireet ja ne työt, joita toivot tehtävän. Esimerkiksi:</p>
              <ul className="mt-1 list-disc pl-5">
                <li>mitä oireita olet huomannut ja milloin ne alkoivat</li>
                <li>missä tilanteessa vika ilmenee (kylmänä, ajossa, jarrutettaessa)</li>
                <li>mitä ajoneuvolle on jo tehty</li>
              </ul>
              <p className="mt-2 font-medium text-foreground">
                Luettele kaikki toivomasi työt nyt. Hakemuksen ulkopuolisia lisätöitä ei oteta automaattisesti
                vastaan.
              </p>
            </>
          }
        />

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="attachments">Liitteet</FieldLabel>
          <div
            className={`rounded-lg border border-dashed bg-muted/30 p-4 transition-colors ${
              attachmentError ? 'border-destructive' : 'border-input'
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-soft text-primary">
                  <Paperclip className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Lisää kuvia tai asiakirjoja</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Voit liittää kuvia ajoneuvon viasta tai ajoneuvoon liittyviä asiakirjoja.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => attachmentInputRef.current?.click()}
                className="w-full shrink-0 sm:w-auto"
              >
                <Upload aria-hidden="true" />
                Valitse tiedostot
              </Button>
            </div>
            <input
              ref={attachmentInputRef}
              id="attachments"
              name="attachments"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleAttachmentSelect}
              aria-invalid={attachmentError ? true : undefined}
              aria-describedby={attachmentError ? "attachments-hint attachments-error" : "attachments-hint"}
              className="sr-only"
            />
          </div>
          <p id="attachments-hint" className="text-xs leading-relaxed text-muted-foreground">
            Voit lisätä useita tiedostoja. Sallitut muodot: JPG, PNG, WEBP, PDF, DOC ja DOCX. Enintään 10 Mt / tiedosto.
            Liitteiden lisääminen ei ole pakollista.
          </p>
          {attachmentError && (
            <p id="attachments-error" role="alert" className="text-sm font-medium text-destructive">
              {attachmentError}
            </p>
          )}
          {draft.attachments.length > 0 && (
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-sm font-semibold">
                Valitut tiedostot ({draft.attachments.length})
              </p>
              <ul className="flex flex-col gap-2">
                {draft.attachments.map((file, index) => {
                  const isImage = /\.(jpe?g|png|webp)$/i.test(file.name)
                  return (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                      className="flex min-w-0 items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        {isImage ? (
                          <FileImage className="size-4" aria-hidden="true" />
                        ) : (
                          <FileText className="size-4" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{file.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        aria-label={`Poista tiedosto ${file.name}`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </Section>

      <Section title="Lisätiedot" description="Molemmat kohdat ovat valinnaisia.">
        <TextField
          id="preferredSchedule"
          label="Toivottu aikataulu"
          placeholder="esim. marraskuun aikana, ei kiirettä"
          hint="Toive ei ole sitova. Työt ajoitetaan opetuksen mukaan."
          value={draft.preferredSchedule}
          onChange={(e) => update('preferredSchedule', e.target.value)}
        />
        <CheckboxField
          id="priceEstimateRequested"
          checked={draft.priceEstimateRequested}
          onChange={(v) => update('priceEstimateRequested', v)}
          description="Hinta-arvion käytännöt vahvistetaan organisaation toimesta."
        >
          Pyydän hinta-arviota
        </CheckboxField>
      </Section>

      <section
        aria-labelledby="before-submit"
        className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-info-soft p-5 md:p-6"
      >
        <h2 id="before-submit" className="font-sans text-base font-semibold">
          Ennen lähettämistä
        </h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/85">
          {[
            'Työt tehdään opiskelijoiden harjoitustöinä opettajien ohjauksessa.',
            'Hakemus ei takaa, että työ otetaan vastaan.',
            'Vain hakemuksessa kuvatut ja erikseen sovitut työt tehdään. Lisätyöt eivät sisälly automaattisesti.',
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-primary/15 pt-3 text-sm">
          <CircleCheck className="size-4 text-success" aria-hidden="true" />
          <span className="font-medium">
            Palveluehdot hyväksytty{consent.at ? ` ${formatDateTime(consent.at)}` : ''}
          </span>
          <Link href="/palveluehdot" className="font-medium text-primary underline underline-offset-2">
            Lue palveluehdot
          </Link>
        </p>
      </section>

      {submitError && (
        <div id="submit-error" tabIndex={-1} className="outline-none">
          <Notice tone="error" role="alert" title="Hakemuksen lähettäminen epäonnistui">
            Yhteys palveluun katkesi. Tietosi ovat tallessa tällä sivulla – yritä lähettää uudelleen hetken
            kuluttua.
          </Notice>
        </div>
      )}

      <div className="flex flex-col-reverse items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/palveluehdot"
          className="text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Takaisin palveluehtoihin
        </Link>
        <Button type="submit" size="xl" disabled={pending} aria-disabled={pending} className="sm:min-w-56">
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Lähetetään…
            </>
          ) : (
            <>
              {submitError ? 'Yritä uudelleen' : 'Lähetä hakemus'}
              <Send aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {pending ? 'Hakemusta lähetetään' : ''}
      </p>
    </form>
  )
}
