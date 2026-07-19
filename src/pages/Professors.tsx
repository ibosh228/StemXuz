import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/ui/Reveal'
import { store } from '../lib/store'
import type { Professor } from '../data/professors'

export default function Professors() {
  const { t } = useTranslation()
  const [professors, setProfessors] = useState<Professor[]>([])

  useEffect(() => {
    store.getProfessors().then(setProfessors)
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">{t('professors.pageTitle')}</h1>
      <p className="text-text-muted mb-10">{t('professors.pageSubtitle')}</p>

      {professors.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {professors.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <div className="bg-surface border border-border rounded-xl p-5 text-center h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet to-cyan mb-4 flex items-center justify-center font-display font-bold text-bg text-lg overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    p.name.split(' ').slice(-1)[0][0]
                  )}
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">{p.name}</h3>
                <p className="text-xs text-violet-light mb-2">{p.title}</p>
                <p className="text-xs text-text-muted leading-relaxed">{p.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-dashed border-border rounded-xl p-14 text-center text-sm text-text-faint">
          Hozircha professorlar yo'q
        </div>
      )}
    </div>
  )
}
