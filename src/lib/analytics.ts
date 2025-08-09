import { openDB } from 'idb'
import { supabase } from '@/integrations/supabase/client'

const DB_NAME = 'mantha-events'
const STORE = 'buf'

const dbp = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
    }
  }
})

export type EventName =
  | 'session_start'
  | 'start_activity'
  | 'cpa_step'
  | 'ask_help'
  | 'stuck'
  | 'solved'
  | 'ei_checkin'
  | 'challenge_generated'
  | 'challenge_completed'
  | 'session_end'

export async function track(name: EventName, props: Record<string, any> = {}) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return
  const db = await dbp
  await db.add(STORE, { name, props, ts: Date.now() })
  // fire-and-forget
  void flush()
}

export async function flush() {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return
  const db = await dbp
  const all = await db.getAll(STORE)
  if (!all.length) return

  try {
    const { error } = await supabase.functions.invoke('ingest-events', {
      body: { user_id: user.id, events: all },
    })
    if (error) throw error

    // clear successfully sent
    const tx = db.transaction(STORE, 'readwrite')
    const st = tx.objectStore(STORE)
    for (const item of all) {
      await st.delete((item as any).id)
    }
    await tx.done
  } catch (_) {
    // keep buffer for later
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void flush()
  })
}
