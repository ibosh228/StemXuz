import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MagnifyingGlass from '../components/home/MagnifyingGlass'
import ParticlesBackground from '../components/home/ParticlesBackground'
import Reveal from '../components/ui/Reveal'
import { store } from '../lib/store'
import { useAiModal } from '../lib/AiModalContext'
import type { Article } from '../data/articles'
import type { EventItem } from '../data/events'
import type { Professor } from '../data/professors'
import type { Quiz } from '../data/quizzes'

const featureList = [
  { key: 'features.articles', icon: 'M4 4h12v16H4zM8 8h4M8 12h4' },
  { key: 'features.ai', icon: 'M10 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2z' },
  { key: 'features.quizzes', icon: 'M4 6h12v10a2 2 0 01-2 2H6a2 2 0 01-2-2z' },
  { key: 'features.events', icon: 'M4 5h12v13H4zM4 9h12' },
  { key: 'features.professors', icon: 'M10 4a3 3 0 100 6 3 3 0 000-6zM4 17a6 6 0 0112 0' },
]

export default function Home() {
  const { t } = useTranslation()
  const { open: openAiModal } = useAiModal()
  const [articles, setArticles] = useState<Article[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const features = featureList

  useEffect(() => {
    store.getArticles().then(setArticles)
    store.getEvents().then(setEvents)
    store.getProfessors().then(setProfessors)
    store.getQuizzes().then(setQuizzes)
  }, [])

  const stats = [
    { key: 'stats.articles', value: articles.length },
    { key: 'stats.quizzes', value: quizzes.length },
    { key: 'stats.events', value: events.length },
    { key: 'stats.professors', value: professors.length },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--color-violet) 22%, transparent) 0%, transparent 60%)',
          }}
        />
        <ParticlesBackground />
        <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-4">
              {t('hero.title1')} <span className="text-gradient">{t('hero.title2')}</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0 mb-7">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to="/articles"
                className="text-sm font-semibold px-6 py-3 rounded-full text-bg bg-gradient-to-br from-violet to-violet-deep shadow-[0_0_20px_rgba(155,107,255,0.4)] hover:opacity-90 transition-opacity"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <button
                onClick={openAiModal}
                className="text-sm font-medium px-6 py-3 rounded-full border border-border-strong text-text hover:bg-white/5 transition-colors"
              >
                {t('hero.ctaSecondary')}
              </button>
            </div>
          </div>
          <MagnifyingGlass size={220} />
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-5 pt-10 md:pt-14 relative z-10">
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.key}
              className="bg-surface border border-border rounded-xl p-4 text-center"
            >
              <div className="font-display font-bold text-xl text-text">{s.value}</div>
              <div className="text-xs text-text-muted mt-1">{t(s.key)}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* LATEST ARTICLES */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">{t('articles.title')}</h2>
              <p className="text-text-muted text-sm">{t('articles.subtitle')}</p>
            </div>
            <Link to="/articles" className="text-sm text-cyan hover:underline whitespace-nowrap">
              {t('articles.viewAll')} →
            </Link>
          </div>
        </Reveal>
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5">
            {articles.slice(0, 3).map((a, i) => (
              <Reveal key={a.id} delay={i * 100}>
                <Link
                  to={`/articles`}
                  className="block h-full bg-surface border border-border rounded-xl overflow-hidden hover:border-border-strong transition-colors"
                >
                  {a.image && <img src={a.image} alt={a.title} className="w-full h-32 object-cover" />}
                  <div className="p-5">
                    <span className="text-[11px] uppercase tracking-wider text-violet-light">{a.category}</span>
                    <h3 className="font-display font-semibold text-base mt-2 mb-2 leading-snug">{a.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">{a.excerpt}</p>
                    <div className="text-xs text-text-faint">{a.author} · {a.date}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-dashed border-border rounded-xl p-10 text-center text-sm text-text-faint">
            Hozircha maqolalar yo'q
          </div>
        )}
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto px-5 py-8 grid md:grid-cols-2 gap-6">
        <Reveal className="bg-surface border border-border rounded-xl p-7">
          <h3 className="font-display font-semibold text-lg mb-3 text-gradient">{t('mission.title')}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{t('mission.text')}</p>
        </Reveal>
        <Reveal delay={100} className="bg-surface border border-border rounded-xl p-7">
          <h3 className="font-display font-semibold text-lg mb-3 text-gradient">{t('vision.title')}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{t('vision.text')}</p>
        </Reveal>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <Reveal>
          <h2 className="font-display font-bold text-2xl mb-8 text-center">{t('features.title')}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.key} delay={i * 80}>
              <div className="bg-surface border border-border rounded-xl p-5 h-full">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="mb-3 text-violet-light">
                  <path d={f.icon} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h4 className="font-display font-semibold text-sm mb-1.5">{t(`${f.key}.title`)}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{t(`${f.key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AI RESEARCH CTA */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <Reveal
          className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
          
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--color-violet) 20%, transparent), transparent 60%), var(--color-bg-elevated)',
            }}
          />
          <div className="relative">
            <h2 className="font-display font-bold text-xl md:text-2xl mb-2">{t('ai.title')}</h2>
            <p className="text-text-muted text-sm mb-6 max-w-lg">{t('ai.subtitle')}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 max-w-xl">
              <div className="border border-border-strong rounded-xl p-4">
                <div className="text-sm font-semibold mb-1">{t('ai.free')}</div>
                <p className="text-xs text-text-muted">{t('ai.free.desc')}</p>
              </div>
              <div className="border border-violet rounded-xl p-4 bg-violet/5">
                <div className="text-sm font-semibold mb-1 text-violet-light">{t('ai.premium')}</div>
                <p className="text-xs text-text-muted">{t('ai.premium.desc')}</p>
              </div>
            </div>
            <button
              onClick={openAiModal}
              className="inline-block text-sm font-semibold px-6 py-3 rounded-full text-bg bg-gradient-to-br from-violet to-violet-deep shadow-[0_0_20px_rgba(155,107,255,0.4)]"
            >
              {t('ai.cta')}
            </button>
          </div>
        </Reveal>
      </section>

      {/* DAILY QUIZ CTA */}
      <section className="max-w-6xl mx-auto px-5 py-10 pb-24">
        <Reveal className="bg-surface border border-border rounded-2xl p-8 md:p-10 text-center">
          <h2 className="font-display font-bold text-xl md:text-2xl mb-2">{t('quiz.dailyTitle')}</h2>
          <p className="text-text-muted text-sm mb-6 max-w-lg mx-auto">{t('quiz.dailySubtitle')}</p>
          <Link
            to="/quizzes"
            className="inline-block text-sm font-semibold px-6 py-3 rounded-full border border-border-strong hover:bg-white/5 transition-colors"
          >
            {t('quiz.start')}
          </Link>
        </Reveal>
      </section>
    </>
  )
}
