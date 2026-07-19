import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/ui/Reveal'

export default function AiResearch() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'system'; text: string }[]>([])

  function send() {
    if (!input.trim()) return
    setMessages((m) => [...m, { role: 'user', text: input }, { role: 'system', text: t('ai.notConnected') }])
    setInput('')
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">{t('ai.pageTitle')}</h1>
      <p className="text-text-muted mb-10">{t('ai.pageSubtitle')}</p>

      <Reveal className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="border border-border-strong rounded-xl p-5">
          <div className="text-base font-display font-semibold mb-2">{t('ai.free')}</div>
          <p className="text-sm text-text-muted">{t('ai.free.desc')}</p>
        </div>
        <div className="border border-violet rounded-xl p-5 bg-violet/5">
          <div className="text-base font-display font-semibold mb-2 text-violet-light">{t('ai.premium')}</div>
          <p className="text-sm text-text-muted">{t('ai.premium.desc')}</p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <p className="text-xs text-text-faint mb-3">{t('ai.comingSoon')}</p>
        <div className="bg-surface border border-border rounded-2xl p-5 min-h-[280px] flex flex-col">
          <div className="flex-1 space-y-3 mb-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm px-4 py-2.5 rounded-xl max-w-[80%] ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-violet to-violet-deep text-bg ml-auto'
                    : 'bg-white/5 text-text-muted'
                }`}
              >
                {m.text}
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-text-faint text-sm text-center pt-16">…</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('ai.chatPlaceholder') ?? ''}
              className="flex-1 bg-bg-elevated border border-border rounded-full px-4 py-2.5 text-sm text-text placeholder:text-text-faint outline-none focus:border-border-strong"
            />
            <button
              onClick={send}
              className="text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
            >
              →
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
