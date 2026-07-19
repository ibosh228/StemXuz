import { useEffect, useState } from 'react'
import { useAiModal } from '../../lib/AiModalContext'
import { useAuth } from '../../lib/AuthContext'
import { getAiUsageToday, incrementAiUsage, getAiLimit, hasAiQuotaLeft } from '../../lib/aiUsage'
import { submitPaymentRequest, getMyPaymentRequests } from '../../lib/payments'

const CARD_NUMBER = '5440 8103 0235 0995'
const CARD_HOLDER = 'Muradova Muxabbat Kadirovna'
const PRICE = "10 000 so'm / oy"

function UpgradeScreen() {
  const { user } = useAuth()
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [pendingExists, setPendingExists] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    getMyPaymentRequests(user.id).then((reqs) => {
      if (reqs.some((r) => r.status === 'pending')) setPendingExists(true)
    })
  }, [user])

  async function handleSubmit() {
    if (!user) return
    setLoading(true)
    try {
      await submitPaymentRequest(user.id, note)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted || pendingExists) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
        <p className="font-display font-semibold text-lg mb-2">So'rov yuborildi ✓</p>
        <p className="text-sm text-text-muted max-w-xs">
          To'lovingiz tekshirilgach, Premium avtomatik yoqiladi.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
      <p className="font-display font-semibold text-lg mb-1">Premium'ga o'ting</p>
      <p className="text-sm text-violet-light mb-5">{PRICE}</p>

      <div className="bg-surface border border-border rounded-xl p-4 mb-5 text-left w-full max-w-xs">
        <p className="text-xs text-text-faint mb-1">Quyidagi kartaga o'tkazing:</p>
        <p className="font-display font-semibold text-text tracking-wide">{CARD_NUMBER}</p>
        <p className="text-xs text-text-muted mt-1">{CARD_HOLDER}</p>
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Izoh (masalan: soat, summasi)"
        className="w-full max-w-xs bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-border-strong mb-3"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="text-sm font-semibold px-6 py-2.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg disabled:opacity-50"
      >
        {loading ? '...' : "To'lov qildim"}
      </button>
    </div>
  )
}

export default function AiModal() {
  const { isOpen, close } = useAiModal()
  const { user } = useAuth()
  const [usedToday, setUsedToday] = useState(0)
  const [forceUpgrade, setForceUpgrade] = useState(false)

  // Esc key + body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  // Every time the modal transitions to OPEN, count one free-tier "session".
  useEffect(() => {
    if (!isOpen) {
      setForceUpgrade(false)
      return
    }
    if (!user) return

    if (user.isPremium) {
      setUsedToday(getAiUsageToday(user.id))
      return
    }

    const before = getAiUsageToday(user.id)
    if (before >= getAiLimit()) {
      setUsedToday(before)
      return
    }
    const after = incrementAiUsage(user.id)
    setUsedToday(after)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id])

  if (!isOpen) return null

  const limit = getAiLimit()
  const hasQuota = user ? (user.isPremium || hasAiQuotaLeft(user.id, user.isPremium)) : false
  const blocked = user && !user.isPremium && usedToday > limit
  const showUpgrade = forceUpgrade || (!!user && !hasQuota) || !!blocked

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm animate-modal-fade"
      onClick={close}
    >
      <div
        className="relative w-full h-full bg-bg-elevated overflow-hidden animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Yopish"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-text transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {!user ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
            <p className="font-display font-semibold text-lg mb-2">Avval tizimga kiring</p>
            <p className="text-sm text-text-muted mb-6 max-w-xs">
              AI Research'dan foydalanish uchun ro'yxatdan o'ting yoki kiring.
            </p>
            <a
              href="/auth"
              className="text-sm font-semibold px-6 py-2.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
            >
              Kirish / Ro'yxatdan o'tish
            </a>
          </div>
        ) : showUpgrade ? (
          <UpgradeScreen />
        ) : (
          <>
            {!user.isPremium && (
              <button
                onClick={() => setForceUpgrade(true)}
                className="absolute top-3 left-3 z-10 text-[11px] font-medium px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-text"
              >
                Free: {usedToday}/{limit} bugun · Premium'ga o'tish
              </button>
            )}
            <iframe
              src="https://stemx-ai-mentor.lovable.app/"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="clipboard-read; clipboard-write"
              title="AI Research"
            />
          </>
        )}
      </div>
    </div>
  )
}
