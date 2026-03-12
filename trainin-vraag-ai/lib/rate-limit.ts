// In-memory rate limiter: sliding window per gebruiker
// Max MAX_REQUESTS verzoeken per WINDOW_MS milliseconden

const MAX_REQUESTS = 20
const WINDOW_MS = 60 * 60 * 1000 // 1 uur
const CLEANUP_INTERVAL = 5 * 60 * 1000 // elke 5 minuten opruimen

const store = new Map<string, number[]>()

// Ruim entries op die volledig buiten het window vallen om memory leaks te voorkomen
function cleanup() {
  const windowStart = Date.now() - WINDOW_MS
  for (const [userId, timestamps] of store.entries()) {
    const active = timestamps.filter((t) => t > windowStart)
    if (active.length === 0) {
      store.delete(userId)
    } else {
      store.set(userId, active)
    }
  }
}

let cleanupTimer: ReturnType<typeof setInterval> | null = null
function ensureCleanupTimer() {
  if (!cleanupTimer) {
    cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL)
    if (cleanupTimer.unref) cleanupTimer.unref()
  }
}

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetInSeconds: number } {
  ensureCleanupTimer()

  const now = Date.now()
  const windowStart = now - WINDOW_MS

  const timestamps = (store.get(userId) ?? []).filter((t) => t > windowStart)

  if (timestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = timestamps[0]
    const resetInSeconds = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000)
    return { allowed: false, remaining: 0, resetInSeconds }
  }

  timestamps.push(now)
  store.set(userId, timestamps)

  const remaining = MAX_REQUESTS - timestamps.length
  return { allowed: true, remaining, resetInSeconds: 0 }
}
