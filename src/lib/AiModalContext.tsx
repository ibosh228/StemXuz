import { createContext, useContext, useState, type ReactNode } from 'react'

type AiModalContextType = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const AiModalContext = createContext<AiModalContextType | null>(null)

export function AiModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <AiModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </AiModalContext.Provider>
  )
}

export function useAiModal() {
  const ctx = useContext(AiModalContext)
  if (!ctx) throw new Error('useAiModal must be used within AiModalProvider')
  return ctx
}
