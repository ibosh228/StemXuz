import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-32 text-center">
      <h1 className="font-display font-bold text-4xl mb-3 text-gradient">404</h1>
      <p className="text-text-muted mb-8">Sahifa topilmadi.</p>
      <Link
        to="/"
        className="text-sm font-semibold px-6 py-3 rounded-full bg-gradient-to-br from-violet to-violet-deep text-bg"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
