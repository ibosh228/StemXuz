import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { useAiModal } from '../../lib/AiModalContext'
import { useTheme } from '../../lib/ThemeContext'

const langs = ['uz', 'ru', 'en']

const navItems = [
  { to: '/', key: 'nav.home' },
  { to: '/articles', key: 'nav.articles' },
  { to: '/quizzes', key: 'nav.quizzes' },
  { to: '/ai-research', key: 'nav.aiResearch', highlight: true },
  { to: '/events', key: 'nav.events' },
  { to: '/professors', key: 'nav.professors' },
  { to: '/about', key: 'nav.about' },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const { open: openAiModal } = useAiModal()
  const { theme, toggle: toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between pt-3.5">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="StemX" className="w-7 h-7 object-contain" />
            <span className="font-display font-bold text-sm tracking-widest text-text">STEMX</span>
          </NavLink>

          <div className="flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text hidden sm:inline">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-xs text-text-muted hover:text-text transition-colors"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className="text-xs text-text-muted hover:text-text transition-colors">
                {t('nav.signin')}
              </NavLink>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Rejimni almashtirish"
              className="w-7 h-7 flex items-center justify-center rounded-full border border-border-strong text-text-muted hover:text-text transition-colors"
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M17 10.5A7 7 0 018.2 3a7 7 0 108.8 7.5z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M10 2v2M10 16v2M4 4l1.4 1.4M14.6 14.6L16 16M2 10h2M16 10h2M4 16l1.4-1.4M14.6 5.4L16 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-1 text-[11px] border border-border-strong rounded-full px-1 py-1">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => i18n.changeLanguage(l)}
                  className={`px-2 py-1 rounded-full uppercase transition-colors ${
                    i18n.language === l
                      ? 'bg-white/10 text-text font-semibold'
                      : 'text-text-faint hover:text-text-muted'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              className="md:hidden text-text"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:justify-center gap-1.5 py-3.5 flex-wrap`}
        >
          {navItems.map((item) =>
            item.highlight ? (
              <button
                key={item.to}
                onClick={() => {
                  setMenuOpen(false)
                  openAiModal()
                }}
                className="text-xs font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-violet to-violet-deep shadow-[0_0_16px_rgba(155,107,255,0.4)] whitespace-nowrap"
              >
                {t(item.key)}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-xs px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
                    isActive ? 'bg-white/10 text-text font-semibold' : 'text-text-muted hover:text-text'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
