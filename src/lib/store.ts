import { supabase } from './supabase'
import type { Article } from '../data/articles'
import type { EventItem } from '../data/events'
import type { Professor } from '../data/professors'
import type { Quiz } from '../data/quizzes'
import type { TeamMember } from '../data/team'

export const store = {
  async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data as Article[]
  },
  async saveArticle(a: Article) {
    await supabase.from('articles').upsert(a)
    return this.getArticles()
  },
  async removeArticle(id: string) {
    await supabase.from('articles').delete().eq('id', id)
    return this.getArticles()
  },

  async getEvents(): Promise<EventItem[]> {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data as EventItem[]
  },
  async saveEvent(e: EventItem) {
    await supabase.from('events').upsert(e)
    return this.getEvents()
  },
  async removeEvent(id: string) {
    await supabase.from('events').delete().eq('id', id)
    return this.getEvents()
  },

  async getProfessors(): Promise<Professor[]> {
    const { data, error } = await supabase.from('professors').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data as Professor[]
  },
  async saveProfessor(p: Professor) {
    await supabase.from('professors').upsert(p)
    return this.getProfessors()
  },
  async removeProfessor(id: string) {
    await supabase.from('professors').delete().eq('id', id)
    return this.getProfessors()
  },

  async getQuizzes(): Promise<Quiz[]> {
    const { data, error } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data as Quiz[]
  },
  async saveQuiz(q: Quiz) {
    await supabase.from('quizzes').upsert(q)
    return this.getQuizzes()
  },
  async removeQuiz(id: string) {
    await supabase.from('quizzes').delete().eq('id', id)
    return this.getQuizzes()
  },

  async getTeam(): Promise<TeamMember[]> {
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true })
    if (error || !data) return []
    return data as TeamMember[]
  },
  async saveTeamMember(m: TeamMember) {
    await supabase.from('team_members').upsert(m)
    return this.getTeam()
  },
  async removeTeamMember(id: string) {
    await supabase.from('team_members').delete().eq('id', id)
    return this.getTeam()
  },
}
