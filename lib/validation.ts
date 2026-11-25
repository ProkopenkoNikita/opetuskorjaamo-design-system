import { EMAIL_RE } from './format'
import type { Category, FormDraft } from './types'

export type FieldKey = 'name' | 'email' | 'registration' | 'category' | 'description' | 'phone'
export type FormErrors = Partial<Record<FieldKey, string>>

export const FIELD_LABELS: Record<FieldKey, string> = {
  name: 'Nimi',
  email: 'Sähköposti',
  phone: 'Puhelinnumero',
  registration: 'Rekisterinumero',
  category: 'Työtyyppi',
  description: 'Vian kuvaus tai korjauspyyntö',
}

export const FIELD_ORDER: FieldKey[] = ['name', 'email', 'phone', 'registration', 'category', 'description']

export const DESCRIPTION_MIN = 20
export const DESCRIPTION_MAX = 1500

export function validateDraft(d: FormDraft, available: Category[]): FormErrors {
  const e: FormErrors = {}
  if (!d.name.trim()) e.name = 'Kirjoita nimesi.'
  if (!d.email.trim()) e.email = 'Kirjoita sähköpostiosoite, jotta opettaja voi vastata sinulle.'
  else if (!EMAIL_RE.test(d.email.trim()))
    e.email = 'Tarkista sähköpostiosoite. Muoto on esimerkiksi nimi@esimerkki.fi.'
  if (d.phone.trim() && !/^[+\d][\d\s-]{5,}$/.test(d.phone.trim()))
    e.phone = 'Tarkista puhelinnumero. Käytä vain numeroita, välilyöntejä ja plusmerkkiä.'
  if (!d.registration.trim()) e.registration = 'Kirjoita ajoneuvon rekisterinumero.'
  else if (!/^[A-Za-zÅÄÖåäö0-9-]{2,8}$/.test(d.registration.trim().replace(/\s/g, '')))
    e.registration = 'Tarkista rekisterinumero. Muoto on esimerkiksi ABC-123.'
  if (!d.category) e.category = 'Valitse, onko kyseessä kevyen kaluston, raskaan kaluston vai korityö.'
  else if (!available.includes(d.category))
    e.category = 'Tätä työtyyppiä ei oteta vastaan juuri nyt. Valitse toinen työtyyppi.'
  if (!d.description.trim()) e.description = 'Kuvaa vika tai työ, jonka toivot tehtävän.'
  else if (d.description.trim().length < DESCRIPTION_MIN)
    e.description = `Kerro hieman tarkemmin – vähintään ${DESCRIPTION_MIN} merkkiä, jotta opettaja voi arvioida työn.`
  return e
}
