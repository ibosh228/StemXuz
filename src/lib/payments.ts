import { supabase } from './supabase'

export type PaymentRequest = {
  id: string
  user_id: string
  note: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export async function submitPaymentRequest(userId: string, note: string) {
  const { error } = await supabase.from('payment_requests').insert({ user_id: userId, note })
  if (error) throw new Error(error.message)
}

export async function getMyPaymentRequests(userId: string): Promise<PaymentRequest[]> {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as PaymentRequest[]
}

export async function getPendingPaymentRequests(): Promise<PaymentRequest[]> {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error || !data) return []
  return data as PaymentRequest[]
}

export async function approvePaymentRequest(requestId: string, userId: string) {
  await supabase.from('payment_requests').update({ status: 'approved' }).eq('id', requestId)
  await supabase.from('profiles').update({ is_premium: true }).eq('id', userId)
}

export async function rejectPaymentRequest(requestId: string) {
  await supabase.from('payment_requests').update({ status: 'rejected' }).eq('id', requestId)
}
