import { createBrowserRouter } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Quizzes from './pages/Quizzes'
import AiResearch from './pages/AiResearch'
import Events from './pages/Events'
import Professors from './pages/Professors'
import AboutUs from './pages/AboutUs'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function withLayout(el: React.ReactNode) {
  return <PageLayout>{el}</PageLayout>
}

export const router = createBrowserRouter([
  { path: '/', element: withLayout(<Home />) },
  { path: '/articles', element: withLayout(<Articles />) },
  { path: '/quizzes', element: withLayout(<Quizzes />) },
  { path: '/ai-research', element: withLayout(<AiResearch />) },
  { path: '/events', element: withLayout(<Events />) },
  { path: '/professors', element: withLayout(<Professors />) },
  { path: '/about', element: withLayout(<AboutUs />) },
  { path: '/auth', element: withLayout(<Auth />) },
  { path: '/admin', element: withLayout(<Admin />) },
  { path: '*', element: withLayout(<NotFound />) },
])
