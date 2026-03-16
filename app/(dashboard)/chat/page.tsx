import { createClient, createServiceClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/chat/ChatWindow'
import TrialExpired from '@/components/chat/TrialExpired'

const TRIAL_DAYS = 7

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Proefperiode check via user_profiles (admin + trial_expires_at override)
  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('user_profiles')
    .select('is_admin, trial_expires_at')
    .eq('id', user!.id)
    .single()

  const isAdmin = profile?.is_admin ?? false

  let trialExpired = false
  if (!isAdmin) {
    if (profile?.trial_expires_at) {
      trialExpired = new Date(profile.trial_expires_at) < new Date()
    } else {
      const daysSinceCreation = (Date.now() - new Date(user!.created_at).getTime()) / (1000 * 60 * 60 * 24)
      trialExpired = daysSinceCreation > TRIAL_DAYS
    }
  }

  if (trialExpired) {
    return (
      <div className="h-full flex flex-col">
        <TrialExpired />
      </div>
    )
  }

  // Pre-fetch gesprekken
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  // Check credential status
  const { data: creds } = await serviceClient
    .from('trainin_credentials')
    .select('is_verified, trainin_account_name')
    .eq('user_id', user!.id)
    .single()

  const credentialsStatus = creds === null
    ? 'missing' as const
    : creds.is_verified
      ? 'verified' as const
      : 'unverified' as const

  return (
    <div className="h-full flex flex-col">
      <ChatWindow
        initialConversations={conversations ?? []}
        credentialsStatus={credentialsStatus}
      />
    </div>
  )
}
