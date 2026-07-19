import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { store } from '../lib/store'
import { getAllUsers, setPremium } from '../lib/auth'
import { getPendingPaymentRequests, approvePaymentRequest, rejectPaymentRequest, type PaymentRequest } from '../lib/payments'
import type { Article } from '../data/articles'
import type { EventItem } from '../data/events'
import type { Professor } from '../data/professors'
import type { Quiz, Question } from '../data/quizzes'
import type { TeamMember } from '../data/team'
import NotFound from './NotFound'

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

const emptyQuestion = (): Question => ({ question: '', options: ['', '', '', ''], correctIndex: 0 })

const inputCls =
  'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-border-strong'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Admin() {
  const { user } = useAuth()

  const [tab, setTab] = useState<'articles' | 'events' | 'professors' | 'quizzes' | 'team' | 'users' | 'payments'>('articles')
  const [articles, setArticles] = useState<Article[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getAllUsers>>>([])
  const [payments, setPayments] = useState<PaymentRequest[]>([])

  useEffect(() => {
    store.getArticles().then(setArticles)
    store.getEvents().then(setEvents)
    store.getProfessors().then(setProfessors)
    store.getQuizzes().then(setQuizzes)
    store.getTeam().then(setTeam)
    getAllUsers().then(setUsers)
    getPendingPaymentRequests().then(setPayments)
  }, [])

  async function handleApprove(reqId: string, userId: string) {
    await approvePaymentRequest(reqId, userId)
    setPayments(await getPendingPaymentRequests())
    setUsers(await getAllUsers())
  }

  async function handleReject(reqId: string) {
    await rejectPaymentRequest(reqId)
    setPayments(await getPendingPaymentRequests())
  }

  // ---- Article form ----
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [aTitle, setATitle] = useState('')
  const [aCategory, setACategory] = useState<'science' | 'engineering' | 'health' | 'math' | 'technology'>('science')
  const [aExcerpt, setAExcerpt] = useState('')
  const [aAuthor, setAAuthor] = useState('')
  const [aImage, setAImage] = useState('')

  function loadArticle(a: Article | null) {
    setEditingArticle(a)
    setATitle(a?.title ?? '')
    setACategory(a?.category ?? 'science')
    setAExcerpt(a?.excerpt ?? '')
    setAAuthor(a?.author ?? '')
    setAImage(a?.image ?? '')
  }

  async function saveArticleForm() {
    if (!aTitle.trim()) return
    const item: Article = {
      id: editingArticle?.id ?? newId('article'),
      title: aTitle,
      category: aCategory,
      excerpt: aExcerpt,
      author: aAuthor || user?.name || 'Admin',
      date: editingArticle?.date ?? new Date().toISOString().slice(0, 10),
      image: aImage || undefined,
    }
    setArticles(await store.saveArticle(item))
    loadArticle(null)
  }

  async function handleArticleImage(file: File | null) {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setAImage(dataUrl)
  }

  // ---- Event form ----
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [eTitle, setETitle] = useState('')
  const [eDate, setEDate] = useState('')
  const [eLocation, setELocation] = useState('')
  const [eDesc, setEDesc] = useState('')

  function loadEvent(e: EventItem | null) {
    setEditingEvent(e)
    setETitle(e?.title ?? '')
    setEDate(e?.date ?? '')
    setELocation(e?.location ?? '')
    setEDesc(e?.description ?? '')
  }

  async function saveEventForm() {
    if (!eTitle.trim() || !eDate) return
    const item: EventItem = {
      id: editingEvent?.id ?? newId('event'),
      title: eTitle,
      date: eDate,
      location: eLocation,
      description: eDesc,
      upcoming: new Date(eDate) >= new Date(),
    }
    setEvents(await store.saveEvent(item))
    loadEvent(null)
  }

  // ---- Professor form ----
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [pName, setPName] = useState('')
  const [pTitle, setPTitle] = useState('')
  const [pField, setPField] = useState<'science' | 'engineering' | 'health' | 'math' | 'technology'>('science')
  const [pBio, setPBio] = useState('')
  const [pImage, setPImage] = useState('')

  function loadProfessor(p: Professor | null) {
    setEditingProfessor(p)
    setPName(p?.name ?? '')
    setPTitle(p?.title ?? '')
    setPField(p?.field ?? 'science')
    setPBio(p?.bio ?? '')
    setPImage(p?.image ?? '')
  }

  async function saveProfessorForm() {
    if (!pName.trim()) return
    const item: Professor = {
      id: editingProfessor?.id ?? newId('prof'),
      name: pName,
      title: pTitle,
      field: pField,
      bio: pBio,
      image: pImage || undefined,
    }
    setProfessors(await store.saveProfessor(item))
    loadProfessor(null)
  }

  async function handleProfessorImage(file: File | null) {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setPImage(dataUrl)
  }

  // ---- Quiz form ----
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [qTitle, setQTitle] = useState('')
  const [qCategory, setQCategory] = useState<'science' | 'engineering' | 'health' | 'math' | 'technology'>('science')
  const [qPassage, setQPassage] = useState('')
  const [qQuestions, setQQuestions] = useState<Question[]>([
    emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion(),
  ])

  function loadQuiz(q: Quiz | null) {
    setEditingQuiz(q)
    setQTitle(q?.title ?? '')
    setQCategory(q?.category ?? 'science')
    setQPassage(q?.passage ?? '')
    setQQuestions(
      q?.questions?.length
        ? q.questions.map((qq) => ({ ...qq, options: [...qq.options] }))
        : [emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion()]
    )
  }

  function updateQuestion(idx: number, patch: Partial<Question>) {
    setQQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)))
  }

  function updateOption(qIdx: number, optIdx: number, value: string) {
    setQQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        const options = [...q.options]
        options[optIdx] = value
        return { ...q, options }
      })
    )
  }

  async function saveQuizForm() {
    if (!qTitle.trim() || !qPassage.trim()) return
    const item: Quiz = {
      id: editingQuiz?.id ?? newId('quiz'),
      title: qTitle,
      category: qCategory,
      passage: qPassage,
      questions: qQuestions,
    }
    setQuizzes(await store.saveQuiz(item))
    loadQuiz(null)
  }

  // ---- Team member form ----
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [mName, setMName] = useState('')
  const [mTitle, setMTitle] = useState('')
  const [mBio, setMBio] = useState('')
  const [mImage, setMImage] = useState('')
  const [mLinkedin, setMLinkedin] = useState('')
  const [mInstagram, setMInstagram] = useState('')
  const [mTelegram, setMTelegram] = useState('')
  const [mWebsite, setMWebsite] = useState('')

  function loadMember(m: TeamMember | null) {
    setEditingMember(m)
    setMName(m?.name ?? '')
    setMTitle(m?.title ?? '')
    setMBio(m?.bio ?? '')
    setMImage(m?.image ?? '')
    setMLinkedin(m?.linkedin ?? '')
    setMInstagram(m?.instagram ?? '')
    setMTelegram(m?.telegram ?? '')
    setMWebsite(m?.website ?? '')
  }

  async function saveMemberForm() {
    if (!mName.trim()) return
    const item: TeamMember = {
      id: editingMember?.id ?? newId('team'),
      name: mName,
      title: mTitle,
      bio: mBio,
      image: mImage || undefined,
      linkedin: mLinkedin || undefined,
      instagram: mInstagram || undefined,
      telegram: mTelegram || undefined,
      website: mWebsite || undefined,
    }
    setTeam(await store.saveTeamMember(item))
    loadMember(null)
  }

  async function handleMemberImage(file: File | null) {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setMImage(dataUrl)
  }

  // Keep this page indistinguishable from a normal 404 for non-admins.
  if (!user || !user.isAdmin) {
    return <NotFound />
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-2xl mb-1">Admin panel</h1>
      <p className="text-text-muted text-sm mb-8">
        Kirdingiz: {user.name} ({user.email})
      </p>

      <div className="flex gap-2 mb-8 flex-wrap">
        {(['articles', 'events', 'professors', 'quizzes', 'team', 'users', 'payments'] as const).map((tKey) => (
          <button
            key={tKey}
            onClick={() => setTab(tKey)}
            className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
              tab === tKey
                ? 'bg-gradient-to-br from-violet to-violet-deep text-bg border-transparent'
                : 'border-border-strong text-text-muted'
            }`}
          >
            {tKey}
          </button>
        ))}
      </div>

      {tab === 'articles' && (
        <div>
          <div className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-2.5">
            <p className="text-xs text-text-faint mb-1">{editingArticle ? "Tahrirlash" : "Yangi maqola"}</p>
            <input className={inputCls} placeholder="Sarlavha" value={aTitle} onChange={(e) => setATitle(e.target.value)} />
            <select className={inputCls} value={aCategory} onChange={(e) => setACategory(e.target.value as any)}>
              <option value="science">science</option>
              <option value="engineering">engineering</option>
              <option value="health">health</option>
              <option value="math">math</option>
              <option value="technology">technology</option>
            </select>
            <textarea className={inputCls} placeholder="Qisqacha mazmun" value={aExcerpt} onChange={(e) => setAExcerpt(e.target.value)} />
            <input className={inputCls} placeholder="Muallif" value={aAuthor} onChange={(e) => setAAuthor(e.target.value)} />
            <div className="flex items-center gap-3">
              {aImage && <img src={aImage} alt="" className="w-16 h-16 rounded-lg object-cover" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleArticleImage(e.target.files?.[0] ?? null)}
                className="text-xs text-text-muted"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={saveArticleForm} className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg">
                {editingArticle ? 'Saqlash' : "+ Qo'shish"}
              </button>
              {editingArticle && (
                <button onClick={() => loadArticle(null)} className="text-sm px-5 py-2 rounded-full border border-border-strong text-text-muted">
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {articles.map((a) => (
              <div key={a.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5">
                <span className="text-sm">{a.title}</span>
                <div className="flex gap-3">
                  <button onClick={() => loadArticle(a)} className="text-xs text-violet-light">Tahrirlash</button>
                  <button onClick={() => store.removeArticle(a.id).then(setArticles)} className="text-xs text-red-400">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div>
          <div className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-2.5">
            <p className="text-xs text-text-faint mb-1">{editingEvent ? "Tahrirlash" : "Yangi tadbir"}</p>
            <input className={inputCls} placeholder="Sarlavha" value={eTitle} onChange={(e) => setETitle(e.target.value)} />
            <input className={inputCls} type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} />
            <input className={inputCls} placeholder="Manzil" value={eLocation} onChange={(e) => setELocation(e.target.value)} />
            <textarea className={inputCls} placeholder="Tavsif" value={eDesc} onChange={(e) => setEDesc(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={saveEventForm} className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg">
                {editingEvent ? 'Saqlash' : "+ Qo'shish"}
              </button>
              {editingEvent && (
                <button onClick={() => loadEvent(null)} className="text-sm px-5 py-2 rounded-full border border-border-strong text-text-muted">
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5">
                <span className="text-sm">{e.title} — {e.date}</span>
                <div className="flex gap-3">
                  <button onClick={() => loadEvent(e)} className="text-xs text-violet-light">Tahrirlash</button>
                  <button onClick={() => store.removeEvent(e.id).then(setEvents)} className="text-xs text-red-400">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'professors' && (
        <div>
          <div className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-2.5">
            <p className="text-xs text-text-faint mb-1">{editingProfessor ? "Tahrirlash" : "Yangi professor"}</p>
            <input className={inputCls} placeholder="Ism familiya" value={pName} onChange={(e) => setPName(e.target.value)} />
            <input className={inputCls} placeholder="Lavozim" value={pTitle} onChange={(e) => setPTitle(e.target.value)} />
            <select className={inputCls} value={pField} onChange={(e) => setPField(e.target.value as any)}>
              <option value="science">science</option>
              <option value="engineering">engineering</option>
              <option value="health">health</option>
              <option value="math">math</option>
              <option value="technology">technology</option>
            </select>
            <textarea className={inputCls} placeholder="Bio" value={pBio} onChange={(e) => setPBio(e.target.value)} />
            <div className="flex items-center gap-3">
              {pImage && <img src={pImage} alt="" className="w-12 h-12 rounded-full object-cover" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProfessorImage(e.target.files?.[0] ?? null)}
                className="text-xs text-text-muted"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={saveProfessorForm} className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg">
                {editingProfessor ? 'Saqlash' : "+ Qo'shish"}
              </button>
              {editingProfessor && (
                <button onClick={() => loadProfessor(null)} className="text-sm px-5 py-2 rounded-full border border-border-strong text-text-muted">
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {professors.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {p.image && <img src={p.image} alt="" className="w-6 h-6 rounded-full object-cover" />}
                  <span className="text-sm">{p.name}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => loadProfessor(p)} className="text-xs text-violet-light">Tahrirlash</button>
                  <button onClick={() => store.removeProfessor(p.id).then(setProfessors)} className="text-xs text-red-400">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'quizzes' && (
        <div>
          <div className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-3">
            <p className="text-xs text-text-faint mb-1">{editingQuiz ? "Tahrirlash" : "Yangi viktorina"}</p>
            <input className={inputCls} placeholder="Sarlavha" value={qTitle} onChange={(e) => setQTitle(e.target.value)} />
            <select className={inputCls} value={qCategory} onChange={(e) => setQCategory(e.target.value as any)}>
              <option value="science">science</option>
              <option value="engineering">engineering</option>
              <option value="health">health</option>
              <option value="math">math</option>
              <option value="technology">technology</option>
            </select>
            <textarea
              className={inputCls}
              placeholder="Mavzu matni (foydalanuvchi avval shuni o'qiydi)"
              rows={5}
              value={qPassage}
              onChange={(e) => setQPassage(e.target.value)}
            />

            <p className="text-xs text-text-faint pt-2">5 ta savol (matnga asoslanib):</p>
            {qQuestions.map((q, qi) => (
              <div key={qi} className="border border-border rounded-lg p-3 space-y-2">
                <input
                  className={inputCls}
                  placeholder={`${qi + 1}-savol matni`}
                  value={q.question}
                  onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                />
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, { correctIndex: oi })}
                    />
                    <input
                      className={inputCls}
                      placeholder={`${oi + 1}-variant`}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button onClick={saveQuizForm} className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg">
                {editingQuiz ? 'Saqlash' : "+ Qo'shish"}
              </button>
              {editingQuiz && (
                <button onClick={() => loadQuiz(null)} className="text-sm px-5 py-2 rounded-full border border-border-strong text-text-muted">
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {quizzes.map((q) => (
              <div key={q.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5">
                <span className="text-sm">{q.title}</span>
                <div className="flex gap-3">
                  <button onClick={() => loadQuiz(q)} className="text-xs text-violet-light">Tahrirlash</button>
                  <button onClick={() => store.removeQuiz(q.id).then(setQuizzes)} className="text-xs text-red-400">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div>
          <div className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-2.5">
            <p className="text-xs text-text-faint mb-1">{editingMember ? "Tahrirlash" : "Yangi jamoa a'zosi"}</p>
            <input className={inputCls} placeholder="Ism familiya" value={mName} onChange={(e) => setMName(e.target.value)} />
            <input className={inputCls} placeholder="Lavozim" value={mTitle} onChange={(e) => setMTitle(e.target.value)} />
            <textarea className={inputCls} placeholder="Bio" value={mBio} onChange={(e) => setMBio(e.target.value)} />
            <input className={inputCls} placeholder="LinkedIn URL" value={mLinkedin} onChange={(e) => setMLinkedin(e.target.value)} />
            <input className={inputCls} placeholder="Instagram URL" value={mInstagram} onChange={(e) => setMInstagram(e.target.value)} />
            <input className={inputCls} placeholder="Telegram URL" value={mTelegram} onChange={(e) => setMTelegram(e.target.value)} />
            <input className={inputCls} placeholder="Website URL" value={mWebsite} onChange={(e) => setMWebsite(e.target.value)} />
            <div className="flex items-center gap-3">
              {mImage && <img src={mImage} alt="" className="w-16 h-16 rounded-lg object-cover" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMemberImage(e.target.files?.[0] ?? null)}
                className="text-xs text-text-muted"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={saveMemberForm} className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg">
                {editingMember ? 'Saqlash' : "+ Qo'shish"}
              </button>
              {editingMember && (
                <button onClick={() => loadMember(null)} className="text-sm px-5 py-2 rounded-full border border-border-strong text-text-muted">
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {team.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {m.image && <img src={m.image} alt="" className="w-6 h-6 rounded-full object-cover" />}
                  <span className="text-sm">{m.name}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => loadMember(m)} className="text-xs text-violet-light">Tahrirlash</button>
                  <button onClick={() => store.removeTeamMember(m.id).then(setTeam)} className="text-xs text-red-400">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {users.length === 0 && (
            <p className="text-sm text-text-faint">Hozircha ro'yxatdan o'tgan foydalanuvchi yo'q.</p>
          )}
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3">
              <div>
                <div className="text-sm text-text">
                  {u.name} {u.isAdmin && <span className="text-[10px] text-violet-light ml-1">ADMIN</span>}
                </div>
                <div className="text-xs text-text-faint">{u.email}</div>
              </div>
              <button
                onClick={() => setPremium(u.id, !u.isPremium).then(setUsers)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                  u.isPremium
                    ? 'bg-gradient-to-br from-violet to-violet-deep text-bg'
                    : 'border border-border-strong text-text-muted'
                }`}
              >
                {u.isPremium ? 'Premium ✓' : 'Free'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-2">
          {payments.length === 0 && (
            <p className="text-sm text-text-faint">Kutilayotgan to'lov so'rovlari yo'q.</p>
          )}
          {payments.map((p) => {
            const relatedUser = users.find((u) => u.id === p.user_id)
            return (
              <div key={p.id} className="bg-surface border border-border rounded-lg px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-text">{relatedUser?.name ?? p.user_id}</div>
                    <div className="text-xs text-text-faint">
                      {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(p.id, p.user_id)}
                      className="text-xs font-semibold px-4 py-1.5 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
                    >
                      Tasdiqlash
                    </button>
                    <button
                      onClick={() => handleReject(p.id)}
                      className="text-xs px-4 py-1.5 rounded-full border border-border-strong text-text-muted"
                    >
                      Rad etish
                    </button>
                  </div>
                </div>
                {p.note && <p className="text-xs text-text-muted">Izoh: {p.note}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
