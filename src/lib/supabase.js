import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Builders] Faltan variables de entorno. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY a .env.local')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])

function validateImageFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) throw new Error(`Formato no permitido: ${ext}. Usa jpg, jpeg, png o webp.`)
  return ext
}

export async function uploadAvatar(userId, file) {
  const ext = validateImageFile(file)
  const path = `${userId}/avatar.${ext}`
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (error) throw error
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
}

export async function uploadScreenshot(userId, file) {
  const ext = validateImageFile(file)
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('screenshots').upload(path, file)
  if (error) throw error
  return supabase.storage.from('screenshots').getPublicUrl(path).data.publicUrl
}
