export type Professor = {
  id: string
  name: string
  title: string
  field: 'science' | 'engineering' | 'health' | 'math' | 'technology'
  bio: string
  image?: string
}

export const professors: Professor[] = []
