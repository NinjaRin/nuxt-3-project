import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.NUXT_PUBLIC_SUPABASE_KEY as string

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)