import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/ui/Reveal'
import { store } from '../lib/store'
import type { Quiz } from '../data/quizzes'

function QuizRunner({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const { t } = useTranslation()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (!started) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 max-w-xl mx-auto">
        <span className="text-[11px] uppercase tracking-wider text-violet-light">{quiz.category}</span>
        <h3 className="font-display font-semibold text-lg mt-2 mb-4">{quiz.title}</h3>
        {quiz.passage && (
          <p className="text-sm text-text-muted leading-relaxed mb-6 whitespace-pre-line">{quiz.passage}</p>
        )}
        <button
          onClick={() => setStarted(true)}
          className="text-sm font-semibold px-6 py-2.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
        >
          {t('quiz.start')}
        </button>
      </div>
    )
  }

  const q = quiz.questions[step]

  function choose(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    if (idx === q.correctIndex) setScore((s) => s + 1)
  }

  function next() {
    if (step + 1 < quiz.questions.length) {
      setStep((s) => s + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center max-w-lg mx-auto">
        <h3 className="font-display font-bold text-2xl mb-2 text-gradient">
          {score} / {quiz.questions.length}
        </h3>
        <p className="text-text-muted text-sm mb-6">{quiz.title}</p>
        <button
          onClick={onExit}
          className="text-sm font-semibold px-6 py-3 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
        >
          ← {t('quiz.pageTitle')}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 max-w-lg mx-auto">
      <div className="text-xs text-text-faint mb-4">
        {step + 1} / {quiz.questions.length}
      </div>
      <h3 className="font-display font-semibold text-lg mb-6 leading-snug">{q.question}</h3>
      <div className="space-y-2.5 mb-6">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correctIndex
          const isSelected = idx === selected
          let cls = 'border-border-strong text-text hover:bg-white/5'
          if (selected !== null) {
            if (isCorrect) cls = 'border-cyan bg-cyan/10 text-text'
            else if (isSelected) cls = 'border-red-400/60 bg-red-400/10 text-text'
            else cls = 'border-border text-text-faint'
          }
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-colors ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <button
          onClick={next}
          className="text-sm font-semibold px-6 py-2.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
        >
          {step + 1 < quiz.questions.length ? 'Keyingi →' : 'Yakunlash'}
        </button>
      )}
    </div>
  )
}

export default function Quizzes() {
  const { t } = useTranslation()
  const [active, setActive] = useState<Quiz | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    store.getQuizzes().then(setQuizzes)
  }, [])

  if (active) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-16">
        <QuizRunner quiz={active} onExit={() => setActive(null)} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">{t('quiz.pageTitle')}</h1>
      <p className="text-text-muted mb-10">{t('quiz.pageSubtitle')}</p>

      {quizzes.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-5">
          {quizzes.map((q, i) => (
            <Reveal key={q.id} delay={i * 100}>
              <button
                onClick={() => setActive(q)}
                className="w-full h-full text-left bg-surface border border-border rounded-xl p-5 hover:border-border-strong transition-colors"
              >
                <span className="text-[11px] uppercase tracking-wider text-violet-light">{q.category}</span>
                <h3 className="font-display font-semibold text-base mt-2 mb-2">{q.title}</h3>
                <p className="text-xs text-text-faint">
                  {q.questions.length} {t('quiz.questions')}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-dashed border-border rounded-xl p-14 text-center text-sm text-text-faint">
          Hozircha viktorinalar yo'q
        </div>
      )}
    </div>
  )
}
