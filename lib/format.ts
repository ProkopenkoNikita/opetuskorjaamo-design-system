import { TEACHERS } from './data'
import type { ServiceRequest, Settings } from './types'

const dateFmt = new Intl.DateTimeFormat('fi-FI', { day: 'numeric', month: 'numeric', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('fi-FI', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const timeFmt = new Intl.DateTimeFormat('fi-FI', { hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso: string) => dateFmt.format(new Date(iso))
export const formatDateTime = (iso: string) => dateTimeFmt.format(new Date(iso))
export const formatTime = (iso: string) => timeFmt.format(new Date(iso))

export const teacherById = (id: string | null | undefined) =>
  TEACHERS.find((t) => t.id === id) ?? null

export function reviewPeriodLabel(settings: Settings) {
  if (settings.org.reviewPeriodText) return settings.org.reviewPeriodText
  if (settings.reviewDays) return `${settings.reviewDays} vuorokautta`
  return null
}

export function fillTemplate(template: string, request: Partial<ServiceRequest>, settings: Settings) {
  return template
    .replaceAll('{nimi}', request.name || 'Asiakas')
    .replaceAll('{hakemusnumero}', request.number || 'OK-2026-0000')
    .replaceAll('{kasittelyaika}', reviewPeriodLabel(settings) ?? '[Vahvistettava: käsittelyaika]')
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
