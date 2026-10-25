// Temporary deployment check: verifies the private store and admin secrets are wired. Returns booleans only.
import { list } from '@vercel/blob'
import { json } from './_lib/http.js'
import { adminConfigured } from './_lib/auth.js'

export async function GET() {
  let store = false
  try {
    await list({ limit: 1, prefix: 'health/' })
    store = true
  } catch {
    store = false
  }
  return json(200, { store, admin: adminConfigured() }, { 'x-robots-tag': 'noindex' })
}
