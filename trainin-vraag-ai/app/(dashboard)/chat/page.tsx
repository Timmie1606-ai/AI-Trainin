import { createClient, createServiceClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/chat/ChatWindow'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Pre-fetch gesprekken
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  // Check credential status
  const serviceClient = createServiceClient()
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
