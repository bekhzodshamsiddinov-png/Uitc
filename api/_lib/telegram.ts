// Telegram notifications for new leads. The bot token lives only in the
// TELEGRAM_BOT_TOKEN env var; the chats that receive messages are linked from
// the admin panel (Admin → Telegram) and kept in the private store.
import { readJson, writeJson } from './store.js'

export interface TgChat { id: string; title: string; type: string }

const CHATS = 'admin/telegram.json'
const CHAT_ID_RE = /^-?\d{1,20}$/

export const telegramConfigured = () => !!process.env.TELEGRAM_BOT_TOKEN

async function call<T>(method: string, body: Record<string, unknown> = {}): Promise<T | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return null
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    })
    const data = (await r.json()) as { ok: boolean; result?: T }
    return data.ok ? (data.result ?? null) : null
  } catch {
    return null
  }
}

export async function loadChats(): Promise<TgChat[]> {
  const stored = (await readJson<{ chats: TgChat[] }>(CHATS))?.chats ?? []
  const env = process.env.TELEGRAM_CHAT_ID
  if (env && CHAT_ID_RE.test(env) && !stored.some((c) => c.id === env)) stored.push({ id: env, title: 'TELEGRAM_CHAT_ID', type: 'env' })
  return stored.filter((c) => CHAT_ID_RE.test(c.id))
}

export const saveChats = (chats: TgChat[]) => writeJson(CHATS, { chats: chats.slice(0, 10) })

export const botInfo = () => call<{ username: string; first_name: string }>('getMe')

interface Update {
  message?: { chat: RawChat }
  channel_post?: { chat: RawChat }
  my_chat_member?: { chat: RawChat }
}
interface RawChat { id: number; type: string; title?: string; first_name?: string; last_name?: string; username?: string }

/** Chats that recently wrote to the bot (/start) or added it to a group. */
export async function recentChats(): Promise<TgChat[]> {
  const updates = (await call<Update[]>('getUpdates', { limit: 100, allowed_updates: ['message', 'channel_post', 'my_chat_member'] })) ?? []
  const found = new Map<string, TgChat>()
  for (const u of updates) {
    const c = u.message?.chat ?? u.channel_post?.chat ?? u.my_chat_member?.chat
    if (!c) continue
    const title = c.title ?? [c.first_name, c.last_name].filter(Boolean).join(' ') ?? c.username ?? ''
    found.set(String(c.id), { id: String(c.id), title: (title || (c.username ? '@' + c.username : String(c.id))).slice(0, 80), type: c.type })
  }
  return [...found.values()]
}

export async function sendTo(chatId: string, html: string) {
  return !!(await call('sendMessage', { chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true }))
}

/** Sends to every linked chat; true if at least one delivery succeeded. */
export async function notifyAll(html: string) {
  if (!telegramConfigured()) return false
  const chats = await loadChats()
  const results = await Promise.all(chats.map((c) => sendTo(c.id, html)))
  return results.some(Boolean)
}
