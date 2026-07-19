export type Question = {
  question: string
  options: string[]
  correctIndex: number
}

export type Quiz = {
  id: string
  title: string
  category: 'science' | 'engineering' | 'health' | 'math' | 'technology'
  passage: string
  questions: Question[]
}

export const quizzes: Quiz[] = []
