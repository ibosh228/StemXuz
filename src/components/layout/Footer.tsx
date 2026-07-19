import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const links = [
  { to: '/articles', key: 'nav.articles' },
  { to: '/quizzes', key: 'nav.quizzes' },
  { to: '/ai-research', key: 'nav.aiResearch' },
  { to: '/events', key: 'nav.events' },
  { to: '/professors', key: 'nav.professors' },
  { to: '/about', key: 'nav.about' },
]

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row justify-between gap-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="StemX" className="w-7 h-7 object-contain" />
            <span className="font-display font-bold text-sm tracking-widest text-text">STEMX</span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-text-faint mb-3">{t('footer.menu')}</p>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className="text-sm text-text-muted hover:text-text transition-colors">
                  {t(l.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-text-faint">
        StemX © {new Date().getFullYear()}. {t('footer.rights')}
      </div>
    </footer>
  )
}
