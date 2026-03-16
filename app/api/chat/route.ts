import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption/credentials'
import { TraininClient } from '@/lib/trainin/client'
import { runAgentLoop, type ChatMessage } from '@/lib/ai/openrouter'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import { checkRateLimit } from '@/lib/rate-limit'
import type { Json } from '@/types/database'

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
})

export async function POST(request: Request) {
  // 1. Auth
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  // 2. Proefperiode check via user_profiles
  const TRIAL_DAYS = 7
  const { data: profile } = await serviceClient
    .from('user_profiles')
    .select('is_admin, trial_expires_at')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.is_admin ?? false
  if (!isAdmin) {
    let trialExpired = false
    if (profile?.trial_expires_at) {
      trialExpired = new Date(profile.trial_expires_at) < new Date()
    } else {
      const days = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
      trialExpired = days > TRIAL_DAYS
    }
    if (trialExpired) {
      return NextResponse.json(
        { error: 'Je proefperiode van 7 dagen is verlopen. Neem contact op via https://tidycal.com/deaistrateeg/trainin om verder te gaan.' },
        { status: 403 }
      )
    }
  }

  // 3. Rate limit check
  const rateLimit = checkRateLimit(user.id)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Limiet bereikt. Je kunt maximaal 20 berichten per uur versturen. Probeer het over ${rateLimit.resetInSeconds} seconden opnieuw.` },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
          'Retry-After': String(rateLimit.resetInSeconds),
        },
      }
    )
  }

  // 3. Input validatie

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldig JSON' }, { status: 400 })
  }

  const parsed = chatSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { message, conversationId } = parsed.data

  // 3. Credentials ophalen en decrypten
  const serviceClient = createServiceClient()
  const { data: creds } = await serviceClient
    .from('trainin_credentials')
    .select('encrypted_api_key, api_key_iv, encrypted_tenant_id, tenant_id_iv, is_verified')
    .eq('user_id', user.id)
    .single()

  if (!creds) {
    return NextResponse.json(
      { error: 'Geen Trainin credentials gevonden. Ga naar Instellingen om je API Key in te voeren.' },
      { status: 400 }
    )
  }

  let apiKey: string
  let tenantId: string
  try {
    apiKey = decrypt(creds.encrypted_api_key, creds.api_key_iv)
    tenantId = decrypt(creds.encrypted_tenant_id, creds.tenant_id_iv)
  } catch {
    return NextResponse.json({ error: 'Credentials konden niet worden geladen' }, { status: 500 })
  }

  // 4. Conversatie aanmaken of ophalen
  let activeConversationId: string

  if (conversationId) {
    activeConversationId = conversationId
  } else {
    const { data: newConv, error: convError } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select('id')
      .single()

    if (convError || !newConv) {
      return NextResponse.json({ error: 'Kon conversatie niet aanmaken' }, { status: 500 })
    }
    activeConversationId = newConv.id
  }

  // 5. Bestaande berichten ophalen voor context
  const { data: existingMessages } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', activeConversationId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(20)

  const history: ChatMessage[] = (existingMessages ?? [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  // Huidige bericht toevoegen
  history.push({ role: 'user', content: message })

  // 6. Gebruikersbericht opslaan
  await supabase.from('messages').insert({
    conversation_id: activeConversationId,
    user_id: user.id,
    role: 'user',
    content: message,
  })

  // 7. Streaming response opzetten
  const traininClient = new TraininClient(apiKey, tenantId)
  const systemPrompt = buildSystemPrompt()
  const convId = activeConversationId

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        const line = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(line))
      }

      // Conversatie ID meteen sturen
      send('conversation_id', { conversationId: convId })

      try {
        const result = await runAgentLoop({
          messages: history,
          systemPrompt,
          traininClient,
          onEvent: send,
        })

        // AI antwoord opslaan in DB
        await supabase.from('messages').insert({
          conversation_id: convId,
          user_id: user.id,
          role: 'assistant',
          content: result.finalText,
          input_tokens: result.inputTokens,
          output_tokens: result.outputTokens,
        })

        // Tool calls opslaan
        for (const tc of result.toolCalls) {
          await supabase.from('messages').insert({
            conversation_id: convId,
            user_id: user.id,
            role: 'tool',
            content: JSON.stringify(tc.result),
            tool_name: tc.name,
            tool_input: tc.input as Json,
            tool_result: tc.result as Json,
          })
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        console.error('Chat fout:', errMsg)
        send('error', { message: `Fout: ${errMsg}` })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// Gesprekken ophalen
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  return NextResponse.json({ conversations: conversations ?? [] })
}
