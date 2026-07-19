import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/ui/Reveal'
import { store } from '../lib/store'
import type { Article } from '../data/articles'

const categories = ['all', 'science', 'engineering', 'health', 'math', 'technology'] as const

const categoryLabels: Record<string, string> = {
  science: 'Science',
  engineering: 'Engineering',
  health: 'Health',
  math: 'Math',
  technology: 'Technology',
}

export default function Articles() {
  const { t } = useTranslation()
  const [active, setActive] = useState<(typeof categories)[number]>('all')
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    store.getArticles().then(setArticles)
  }, [])

  const filtered = active === 'all' ? articles : articles.filter((a) => a.category === active)

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">{t('articles.pageTitle')}</h1>
      <p className="text-text-muted mb-8">{t('articles.pageSubtitle')}</p>

      <div className="flex gap-2 mb-10 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
              active === c
                ? 'bg-gradient-to-br from-violet to-violet-deep text-bg border-transparent'
                : 'border-border-strong text-text-muted hover:text-text'
            }`}
          >
            {c === 'all' ? t('articles.all') : categoryLabels[c]}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-5">
          {filtered.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 80}>
              <div className="h-full bg-surface border border-border rounded-xl overflow-hidden hover:border-border-strong transition-colors">
                {a.image && <img src={a.image} alt={a.title} className="w-full h-36 object-cover" />}
                <div className="p-5">
                  <span className="text-[11px] uppercase tracking-wider text-violet-light">{a.category}</span>
                  <h3 className="font-display font-semibold text-base mt-2 mb-2 leading-snug">{a.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-3">{a.excerpt}</p>
                  <div className="text-xs text-text-faint">{a.author} · {a.date}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-dashed border-border rounded-xl p-14 text-center text-sm text-text-faint">
          Hozircha maqolalar yo'q
        </div>
      )}
    </div>
  )
}
