// Admin → Telegram: link the chats that get new-lead notifications.
import { readJson } from '../_lib/http.js'
import { adminJson, requireAdmin } from '../_lib/guard.js'
import { botInfo, loadChats, recentChats, saveChats, sendTo, telegramConfigured } from '../_lib/telegram.js'

export async function GET(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  if (!telegramConfigured()) return adminJson(200, { ok: true, configured: false, chats: [] })
  const [bot, chats] = await Promise.all([botInfo(), loadChats()])
  return adminJson(200, { ok: true, configured: true, bot: bot?.username ?? null, chats })
}

export async function POST(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  if (!telegramConfigured()) return adminJson(409, { ok: false, error: 'not_configured' })
  const body = await readJson(req, 1024)
  if (body instanceof Response) return body
  const chats = await loadChats()
  const stored = chats.filter((c) => c.type !== 'env')

  switch (body.action) {
    case 'detect': {
      // Only lists chats that wrote /start to the bot. Anyone can message a
      // public bot, so nothing is linked until the admin picks a chat.
      const found = (await recentChats()).filter((c) => !stored.some((m) => m.id === c.id))
      return adminJson(200, { ok: true, candidates: found })
    }
    case 'add': {
      const id = String(body.id ?? '')
      const chat = (await recentChats()).find((c) => c.id === id)
      if (!chat) return adminJson(404, { ok: false, error: 'not_found' })
      if (!stored.some((c) => c.id === id)) await saveChats([...stored, chat])
      return adminJson(200, { ok: true, chats: await loadChats() })
    }
    case 'remove': {
      const id = String(body.id ?? '')
      await saveChats(stored.filter((c) => c.id !== id))
      return adminJson(200, { ok: true, chats: await loadChats() })
    }
    case 'test': {
      const results = await Promise.all(chats.map((c) => sendTo(c.id, '✅ <b>United IT Clubs</b>\nSinov xabari: yangi arizalar şu yerga keladi.')))
      return adminJson(200, { ok: true, sent: results.filter(Boolean).length, total: chats.length })
    }
    default:
      return adminJson(400, { ok: false, error: 'unknown_action' })
  }
}
