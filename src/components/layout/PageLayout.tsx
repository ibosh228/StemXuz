import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
