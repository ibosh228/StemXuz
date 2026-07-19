export type Article = {
  id: string
  title: string
  category: 'science' | 'engineering' | 'health' | 'math' | 'technology'
  excerpt: string
  author: string
  date: string
  image?: string
}

export const articles: Article[] = []
