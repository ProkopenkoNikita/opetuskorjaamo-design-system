'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { DEFAULT_SETTINGS, EMPTY_DRAFT, SEED_REQUESTS } from './data'
import type {
  Category,
  FormDraft,
  ListPreviewState,
  RequestStatus,
  ServiceRequest,
  Settings,
} from './types'

export type IntakePreset = 'open' | 'loma' | 'ruuhka' | 'partial'

interface Consent {
  accepted: boolean
  at: string | null
}

interface StoreValue {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
  applyIntakePreset: (preset: IntakePreset) => void
  activePreset: IntakePreset | null
  availableCategories: Category[]

  requests: ServiceRequest[]
  submitRequest: (draft: FormDraft) => Promise<ServiceRequest>
  lastSubmitted: ServiceRequest | null

  consent: Consent
  setConsentAccepted: (accepted: boolean) => void

  draft: FormDraft
  setDraft: (patch: Partial<FormDraft>) => void
  resetDraft: () => void

  currentTeacherId: string
  setCurrentTeacherId: (id: string) => void
  claimRequest: (id: string) => void
  releaseRequest: (id: string) => void
  decideRequest: (id: string, decision: 'hyvaksytty' | 'hylatty') => void
  archiveRequest: (id: string) => void
  addComment: (id: string, text: string) => void
  scheduleRequest: (id: string, start: string, end: string, note: string) => void

  simulateSubmitError: boolean
  setSimulateSubmitError: (v: boolean) => void
  listPreviewState: ListPreviewState
  setListPreviewState: (v: ListPreviewState) => void
}

const StoreContext = createContext<StoreValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)

const STATUS_LABELS: Record<RequestStatus, string> = {
  uusi: 'Hakemus vastaanotettu',
  kasittelyssa: 'Otettu käsittelyyn',
  hyvaksytty: 'Työ hyväksytty',
  hylatty: 'Työ hylätty',
  arkistoitu: 'Arkistoitu',
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [activePreset, setActivePreset] = useState<IntakePreset | null>('open')
  const [requests, setRequests] = useState<ServiceRequest[]>(SEED_REQUESTS)
  const [lastSubmitted, setLastSubmitted] = useState<ServiceRequest | null>(null)
  const [consent, setConsent] = useState<Consent>({ accepted: false, at: null })
  const [draft, setDraftState] = useState<FormDraft>(EMPTY_DRAFT)
  const [currentTeacherId, setCurrentTeacherId] = useState('t1')
  const [simulateSubmitError, setSimulateSubmitError] = useState(false)
  const [listPreviewState, setListPreviewState] = useState<ListPreviewState>('normal')

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }))
    setActivePreset(null)
  }, [])

  const applyIntakePreset = useCallback((preset: IntakePreset) => {
    setActivePreset(preset)
    setSettings((s) => {
      switch (preset) {
        case 'open':
          return { ...s, intakeOpen: true, closureReason: null, disabledCategories: [] }
        case 'loma':
          return {
            ...s,
            intakeOpen: false,
            closureReason: 'loma',
            closureMessage:
              'Opetuskorjaamo on suljettu koulun loma-ajan vuoksi. Emme ota vastaan uusia hakemuksia tänä aikana.',
            disabledCategories: [],
          }
        case 'ruuhka':
          return {
            ...s,
            intakeOpen: false,
            closureReason: 'ruuhka',
            closureMessage:
              'Olemme saaneet enemmän hakemuksia kuin opiskelijaryhmät ehtivät tällä jaksolla käsitellä. Hakemusten vastaanotto on keskeytetty tilapäisesti.',
            disabledCategories: [],
          }
        case 'partial':
          return { ...s, intakeOpen: true, closureReason: null, disabledCategories: ['raskas'] }
      }
    })
  }, [])

  const availableCategories = useMemo<Category[]>(
    () =>
      settings.intakeOpen
        ? (['kevyt', 'raskas', 'kori'] as Category[]).filter(
            (c) => !settings.disabledCategories.includes(c),
          )
        : [],
    [settings.intakeOpen, settings.disabledCategories],
  )

  const setDraft = useCallback(
    (patch: Partial<FormDraft>) => setDraftState((d) => ({ ...d, ...patch })),
    [],
  )
  const resetDraft = useCallback(() => setDraftState(EMPTY_DRAFT), [])

  const setConsentAccepted = useCallback((accepted: boolean) => {
    setConsent({ accepted, at: accepted ? new Date().toISOString() : null })
  }, [])

  const submitRequest = useCallback(
    async (d: FormDraft) => {
      await new Promise((r) => setTimeout(r, 1400))
      if (simulateSubmitError) {
        throw new Error('Palvelin ei vastannut')
      }
      const now = new Date().toISOString()
      const created: ServiceRequest = {
        id: uid(),
        number: `OK-2026-${String(149 + Math.floor(Math.random() * 50)).padStart(4, '0')}`,
        createdAt: now,
        name: d.name.trim(),
        email: d.email.trim(),
        phone: d.phone.trim() || undefined,
        registration: d.registration.trim().toUpperCase(),
        make: d.make.trim() || undefined,
        model: d.model.trim() || undefined,
        mileage: d.mileage.trim() || undefined,
        category: d.category as Category,
        description: d.description.trim(),
        attachments: [...d.attachments],
        preferredSchedule: d.preferredSchedule.trim() || undefined,
        priceEstimateRequested: d.priceEstimateRequested,
        consent: { accepted: true, at: consent.at ?? now, termsVersion: settings.termsVersion },
        status: 'uusi',
        assigneeId: null,
        statusChangedAt: now,
        statusChangedById: null,
        comments: [],
        history: [{ id: uid(), at: now, byId: null, label: STATUS_LABELS.uusi }],
      }
      setRequests((rs) => [created, ...rs])
      setLastSubmitted(created)
      return created
    },
    [simulateSubmitError, consent.at, settings.termsVersion],
  )

  const mutate = useCallback(
    (id: string, fn: (r: ServiceRequest) => ServiceRequest) =>
      setRequests((rs) => rs.map((r) => (r.id === id ? fn(r) : r))),
    [],
  )

  const transition = useCallback(
    (id: string, status: RequestStatus, assigneeId: string | null) => {
      const now = new Date().toISOString()
      mutate(id, (r) => ({
        ...r,
        status,
        assigneeId,
        statusChangedAt: now,
        statusChangedById: currentTeacherId,
        history: [
          ...r.history,
          { id: uid(), at: now, byId: currentTeacherId, label: STATUS_LABELS[status] },
        ],
      }))
    },
    [mutate, currentTeacherId],
  )

  const value: StoreValue = {
    settings,
    updateSettings,
    applyIntakePreset,
    activePreset,
    availableCategories,
    requests,
    submitRequest,
    lastSubmitted,
    consent,
    setConsentAccepted,
    draft,
    setDraft,
    resetDraft,
    currentTeacherId,
    setCurrentTeacherId,
    claimRequest: (id) => transition(id, 'kasittelyssa', currentTeacherId),
    releaseRequest: (id) => {
      const now = new Date().toISOString()
      mutate(id, (r) => ({
        ...r,
        status: 'uusi',
        assigneeId: null,
        statusChangedAt: now,
        statusChangedById: currentTeacherId,
        history: [
          ...r.history,
          { id: uid(), at: now, byId: currentTeacherId, label: 'Vastuu vapautettu' },
        ],
      }))
    },
    decideRequest: (id, decision) => transition(id, decision, currentTeacherId),
    archiveRequest: (id) => {
      const r = requests.find((x) => x.id === id)
      transition(id, 'arkistoitu', r?.assigneeId ?? null)
    },
    addComment: (id, text) =>
      mutate(id, (r) => ({
        ...r,
        comments: [
          ...r.comments,
          { id: uid(), authorId: currentTeacherId, at: new Date().toISOString(), text },
        ],
      })),
    scheduleRequest: (id, start, end, note) =>
      mutate(id, (r) => ({ ...r, scheduledStart: start, scheduledEnd: end, calendarNote: note })),
    simulateSubmitError,
    setSimulateSubmitError,
    listPreviewState,
    setListPreviewState,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
