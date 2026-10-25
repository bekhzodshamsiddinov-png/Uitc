// Thin client for the admin API. Every call is same-origin with the session
// cookie (HttpOnly — never readable from JS) plus a custom CSRF header.

export type LeadStatus = 'new' | 'contacted' | 'trial' | 'enrolled' | 'rejected'

export interface Lead {
  key: string
  id: string
  createdAt: string
  updatedAt: string
  name: string
  phone: string
  course: string
  who: 'child' | 'self' | 'unknown'
  source: string
  lang?: 'uz' | 'ru' | 'en'
  status: LeadStatus
  notes: { at: string; text: string }[]
}

export interface SessionInfo {
  totpEnabled: boolean
  mustChangePassword: boolean
  expiresAt: number
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, public data: Record<string, unknown> = {}) {
    super(code)
  }
}

export async function api<T = Record<string, unknown>>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const r = await fetch(`/api/admin/${path}`, {
    method: init.method ?? 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'x-uitc-admin': '1', ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}) },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  let data: Record<string, unknown> = {}
  try {
    data = await r.json()
  } catch {
    /* non-JSON */
  }
  if (!r.ok) throw new ApiError(r.status, String(data.error ?? 'error'), data)
  return data as T
}

export const statusMeta: Record<LeadStatus, { label: string; cls: string; dot: string }> = {
  new: { label: 'Yangi', cls: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
  contacted: { label: 'Bog‘lanildi', cls: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  trial: { label: 'Sinov darsi', cls: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' },
  enrolled: { label: 'O‘qishga yozildi', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'Rad etildi', cls: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
}
export const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'trial', 'enrolled', 'rejected']

export const errorText = (e: unknown) => {
  const code = e instanceof ApiError ? e.code : 'network'
  return (
    {
      invalid_credentials: 'Parol noto‘g‘ri.',
      totp_required: 'Ilovadagi 6 xonali kodni kiriting.',
      invalid_totp: 'Tasdiqlash kodi noto‘g‘ri yoki eskirgan.',
      locked: 'Juda ko‘p noto‘g‘ri urinish. 15 daqiqadan so‘ng qayta urinib ko‘ring.',
      wrong_password: 'Joriy parol noto‘g‘ri.',
      weak_password: 'Yangi parol kamida 12 belgi bo‘lsin va harf hamda raqam qatnashsin.',
      same_password: 'Yangi parol eskisidan farq qilishi kerak.',
      not_configured: 'Admin panel hali sozlanmagan (server muhit o‘zgaruvchilari).',
      forbidden: 'Ruxsat yo‘q.',
      network: 'Server bilan aloqa yo‘q. Internetni tekshiring.',
    } as Record<string, string>
  )[code] ?? 'Xatolik yuz berdi.'
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
