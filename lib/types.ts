export type Category = 'kevyt' | 'raskas' | 'kori'

export type RequestStatus =
  | 'uusi'
  | 'kasittelyssa'
  | 'hyvaksytty'
  | 'hylatty'
  | 'arkistoitu'

export type ClosureReason = 'loma' | 'ruuhka' | 'muu'

export interface Teacher {
  id: string
  name: string
  initials: string
}

export interface InternalComment {
  id: string
  authorId: string
  at: string
  text: string
}

export interface StatusEvent {
  id: string
  at: string
  byId: string | null
  label: string
}

export interface ServiceRequest {
  id: string
  number: string
  createdAt: string
  name: string
  email: string
  phone?: string
  registration: string
  make?: string
  model?: string
  mileage?: string
  category: Category
  description: string
  attachments?: File[]
  preferredSchedule?: string
  priceEstimateRequested: boolean
  consent: { accepted: boolean; at: string; termsVersion: string }
  status: RequestStatus
  assigneeId: string | null
  statusChangedAt: string
  statusChangedById: string | null
  comments: InternalComment[]
  history: StatusEvent[]
  scheduledStart?: string
  scheduledEnd?: string
  calendarNote?: string
}

export interface TermsSection {
  id: string
  title: string
  body: string
  needsConfirmation: boolean
}

export interface OrgInfo {
  address: string
  openingHours: string
  parking: string
  handover: string
  pickup: string
  handoverHours: string
  scheduling: string
  payment: string
  contactEmail: string
  contactPhone: string
  reviewPeriodText: string
}

export interface Settings {
  intakeOpen: boolean
  closureReason: ClosureReason | null
  closureMessage: string
  closedFrom: string
  closedUntil: string
  nextIntakePeriod: string
  disabledCategories: Category[]
  reviewDays: number | null
  autoRejectEnabled: boolean
  autoMessagesEnabled: boolean
  archiveAfterDays: number | null
  confirmationEmail: { subject: string; body: string }
  rejectionEmail: { subject: string; body: string }
  preFormText: string
  terms: TermsSection[]
  termsVersion: string
  termsUpdatedAt: string
  org: OrgInfo
}

export interface FormDraft {
  name: string
  email: string
  phone: string
  registration: string
  make: string
  model: string
  mileage: string
  category: Category | ''
  description: string
  attachments: File[]
  preferredSchedule: string
  priceEstimateRequested: boolean
}

export type ListPreviewState = 'normal' | 'loading' | 'error' | 'empty'
