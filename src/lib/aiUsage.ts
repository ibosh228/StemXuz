const FREE_DAILY_LIMIT = 5

function todayKey(userId: string) {
  const today = new Date().toISOString().slice(0, 10)
  return `stemx_ai_usage_${userId}_${today}`
}

export function getAiUsageToday(userId: string): number {
  return Number(localStorage.getItem(todayKey(userId)) || '0')
}

export function incrementAiUsage(userId: string): number {
  const next = getAiUsageToday(userId) + 1
  localStorage.setItem(todayKey(userId), String(next))
  return next
}

export function getAiLimit(): number {
  return FREE_DAILY_LIMIT
}

export function hasAiQuotaLeft(userId: string, isPremium: boolean): boolean {
  if (isPremium) return true
  return getAiUsageToday(userId) < FREE_DAILY_LIMIT
}
