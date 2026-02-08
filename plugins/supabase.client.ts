import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const client = createClient(config.public.supabaseUrl as string || 'https://yrnjmjgvxmdzttuzqued.supabase.co', config.public.supabaseKey as string || 'sb_publishable_9JvTsTqQaImQL5dRucXMxQ_4zURS89J')
  return { provide: { supabase: client } }
})