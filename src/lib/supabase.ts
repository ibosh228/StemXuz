import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn(
    'Supabase konfiguratsiyasi topilmadi. VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY sozlanganini tekshiring.'
  )
}

export const supabase = createClient(url ?? '', key ?? '')
