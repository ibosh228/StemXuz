import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Auth() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('register')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (mode === 'register' && (!name.trim() || !email.trim() || password.length < 6)) {
      setError("Iltimos, barcha maydonlarni to'ldiring (parol kamida 6 belgi).")
      return
    }
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(name, email, password, adminCode)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err: any) {
      if (err.message === 'EMAIL_TAKEN') setError('Bu email allaqachon ro\u2019yxatdan o\u2019tgan.')
      else if (err.message === 'INVALID_CREDENTIALS') setError('Email yoki parol noto\u2019g\u2019ri.')
      else setError(err.message || 'Xatolik yuz berdi, qayta urinib ko\u2019ring.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <div className="bg-surface border border-border rounded-2xl p-7">
        <div className="flex gap-2 mb-7 bg-bg-elevated rounded-full p-1">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 text-sm font-medium py-2 rounded-full transition-colors ${
              mode === 'register' ? 'bg-gradient-to-br from-violet to-violet-deep text-bg' : 'text-text-muted'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 text-sm font-medium py-2 rounded-full transition-colors ${
              mode === 'login' ? 'bg-gradient-to-br from-violet to-violet-deep text-bg' : 'text-text-muted'
            }`}
          >
            Kirish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ism familiya"
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Parol"
            className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong"
          />
          {mode === 'register' && (
            <input
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Admin kod (ixtiyoriy)"
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-border-strong"
            />
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-semibold px-6 py-3 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg mt-2 disabled:opacity-50"
          >
            {loading ? '...' : mode === 'register' ? "Ro'yxatdan o'tish" : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  )
}
