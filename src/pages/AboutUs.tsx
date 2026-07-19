import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/ui/Reveal'
import { store } from '../lib/store'
import type { TeamMember } from '../data/team'

function TeamCard({ m, delay }: { m: TeamMember; delay: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Reveal delay={delay}>
      <div className="relative rounded-2xl overflow-hidden h-80 group">
        {m.image ? (
          <img
            src={m.image}
            alt={m.name}
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-6xl font-display font-bold text-bg opacity-40">
            {m.name[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display font-bold text-white text-base mb-1">{m.name}</h3>
          <p className="text-xs text-white/75 leading-snug mb-3 line-clamp-2">{m.title}</p>

          {expanded && m.bio && (
            <p className="text-xs text-white/85 leading-relaxed mb-3">{m.bio}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 11.02-4.12 2.06 2.06 0 01-.02 4.12zM7.12 20.45H3.56V9h3.56z"/></svg>
                </a>
              )}
              {m.instagram && (
                <a href={m.instagram} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76 4.9 4.9 0 01-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 015.44 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"/></svg>
                </a>
              )}
              {m.telegram && (
                <a href={m.telegram} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M21.05 3.35L17.9 19.72c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.95L17.5 6.5c.4-.36-.09-.56-.63-.2L6.4 13.24 1.5 11.7c-1.05-.33-1.07-1.05.22-1.55L19.72 2.4c.88-.32 1.65.2 1.33 1z"/></svg>
                </a>
              )}
              {m.website && (
                <a href={m.website} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z"/></svg>
                </a>
              )}
            </div>
            {m.bio && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs font-semibold text-cyan hover:underline flex items-center gap-0.5"
              >
                {expanded ? 'Less' : 'Read more'} <span>{expanded ? '↑' : '›'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function AboutUs() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    store.getTeam().then(setTeam)
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">{t('about.pageTitle')}</h1>
      <p className="text-text-muted mb-12">{t('about.pageSubtitle')}</p>

      <Reveal className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-3 text-gradient">{t('mission.title')}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{t('mission.text')}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-3 text-gradient">{t('vision.title')}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{t('vision.text')}</p>
        </div>
      </Reveal>

      {team.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display font-bold text-2xl mb-8">Jamoa</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <TeamCard key={m.id} m={m} delay={i * 90} />
            ))}
          </div>
        </div>
      )}

      <Reveal delay={100} className="bg-surface border border-border rounded-2xl p-8 max-w-4xl">
        <h3 className="font-display font-semibold text-xl mb-2">{t('about.contact')}</h3>
        <p className="text-sm text-text-muted mb-6">{t('about.contactDesc')}</p>
        {sent ? (
          <p className="text-sm text-cyan">✓ {t('common.soon')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Email"
              className="bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong sm:col-span-1"
            />
            <input
              placeholder="Ism"
              className="bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong sm:col-span-1"
            />
            <textarea
              placeholder="..."
              rows={3}
              className="bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong sm:col-span-2"
            />
            <button
              onClick={() => setSent(true)}
              className="sm:col-span-2 text-sm font-semibold px-6 py-2.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg w-fit"
            >
              {t('about.contact')}
            </button>
          </div>
        )}
      </Reveal>
    </div>
  )
}
