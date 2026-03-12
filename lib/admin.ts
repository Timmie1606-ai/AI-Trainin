import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const serviceClient = createServiceClient()
  const { data } = await serviceClient
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return data?.is_admin === true
}
