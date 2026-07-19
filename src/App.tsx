import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthProvider } from './lib/AuthContext'
import { AiModalProvider } from './lib/AiModalContext'
import { ThemeProvider } from './lib/ThemeContext'
import AiModal from './components/ui/AiModal'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AiModalProvider>
          <RouterProvider router={router} />
          <AiModal />
        </AiModalProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
