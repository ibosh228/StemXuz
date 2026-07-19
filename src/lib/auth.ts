import { supabase } from './supabase'

export type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  isPremium: boolean
}

const ADMIN_CODE = 'STEMX-ADMIN'

async function fetchProfile(id: string, email: string): Promise<User | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error || !data) return null
  return {
    id,
    email,
    name: data.name,
    isAdmin: data.is_admin,
    isPremium: data.is_premium,
  }
}

export async function register(name: string, email: string, password: string, adminCode?: string) {
  const isAdmin = adminCode?.trim() === ADMIN_CODE
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, is_admin: isAdmin } },
  })
  if (error) throw new Error(error.message === 'User already registered' ? 'EMAIL_TAKEN' : error.message)
  if (!data.user) throw new Error('SIGNUP_FAILED')

  // Profile row is created by a DB trigger; poll briefly in case of replication lag.
  let profile = await fetchProfile(data.user.id, email)
  for (let i = 0; i < 5 && !profile; i++) {
    await new Promise((r) => setTimeout(r, 300))
    profile = await fetchProfile(data.user.id, email)
  }
  return profile ?? { id: data.user.id, email, name, isAdmin, isPremium: isAdmin }
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('INVALID_CREDENTIALS')
  const profile = await fetchProfile(data.user.id, email)
  if (!profile) throw new Error('PROFILE_NOT_FOUND')
  return profile
}

export async function logout() {
  await supabase.auth.signOut()
}

export async function currentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  return fetchProfile(data.user.id, data.user.email ?? '')
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error || !data) return []
  return (data ?? []).map((d: any) => ({ id: d.id, name: d.name, email: '', isAdmin: d.is_admin, isPremium: d.is_premium }))
}

export async function setPremium(userId: string, isPremium: boolean) {
  await supabase.from('profiles').update({ is_premium: isPremium }).eq('id', userId)
  return getAllUsers()
}
