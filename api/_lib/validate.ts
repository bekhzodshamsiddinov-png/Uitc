// Shared validation used by both the browser form and the /api/lead function.
// The server never trusts the client: every rule here is re-checked server-side.

export interface LeadInput {
  name: string
  phone: string
  course: string
  message?: string
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

const NAME_RE = /^[\p{L}\p{M}' ’ʻ‘`.-]{2,60}$/u
// Uzbekistan mobile numbers: +998 XX XXX XX XX
const PHONE_RE = /^\+998\d{9}$/
const COURSE_RE = /^[a-z0-9-]{1,60}$/

export const normalizePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 9) return '+998' + digits
  if (digits.length === 12 && digits.startsWith('998')) return '+' + digits
  return '+' + digits
}

// Strip control characters and collapse whitespace.
export const clean = (s: unknown, max: number) =>
  typeof s === 'string'
    ? s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
    : ''

export function validateLead(input: Partial<Record<keyof LeadInput, unknown>>): {
  data: LeadInput
  errors: LeadErrors
} {
  const data: LeadInput = {
    name: clean(input.name, 60),
    phone: normalizePhone(clean(input.phone, 24)),
    course: clean(input.course, 60) || 'general',
    message: clean(input.message, 500),
  }
  const errors: LeadErrors = {}
  if (!NAME_RE.test(data.name)) errors.name = 'Ismingizni to‘g‘ri kiriting (2–60 harf).'
  if (!PHONE_RE.test(data.phone)) errors.phone = 'Telefon raqam +998 XX XXX XX XX formatida bo‘lsin.'
  if (!COURSE_RE.test(data.course)) errors.course = 'Kursni tanlang.'
  return { data, errors }
}

export const formatPhoneInput = (raw: string) => {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('998')) d = d.slice(3)
  d = d.slice(0, 9)
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean)
  return '+998 ' + parts.join(' ')
}
