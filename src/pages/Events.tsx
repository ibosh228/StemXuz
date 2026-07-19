import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/ui/Reveal'
import { store } from '../lib/store'
import type { EventItem } from '../data/events'

export default function Events() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    store.getEvents().then(setEvents)
  }, [])

  const filtered = events.filter((e) => (tab === 'upcoming' ? e.upcoming : !e.upcoming))

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">{t('events.pageTitle')}</h1>
      <p className="text-text-muted mb-8">{t('events.pageSubtitle')}</p>

      <div className="flex gap-2 mb-10">
        {(['upcoming', 'past'] as const).map((tKey) => (
          <button
            key={tKey}
            onClick={() => setTab(tKey)}
            className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
              tab === tKey
                ? 'bg-gradient-to-br from-violet to-violet-deep text-bg border-transparent'
                : 'border-border-strong text-text-muted hover:text-text'
            }`}
          >
            {t(`events.${tKey}`)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((e, i) => (
          <Reveal key={e.id} delay={i * 80}>
            <div className="bg-surface border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-shrink-0 w-20 text-center">
                <div className="font-display font-bold text-lg text-violet-light">
                  {new Date(e.date).getDate()}
                </div>
                <div className="text-xs text-text-faint uppercase">
                  {new Date(e.date).toLocaleString('default', { month: 'short' })}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-base mb-1">{e.title}</h3>
                <p className="text-sm text-text-muted mb-1">{e.description}</p>
                <p className="text-xs text-text-faint">{e.location}</p>
              </div>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface border border-dashed border-border rounded-xl p-14 text-center text-sm text-text-faint">
            Hozircha tadbirlar yo'q
          </div>
        )}
      </div>
    </div>
  )
}
