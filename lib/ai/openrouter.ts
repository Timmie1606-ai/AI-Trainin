import OpenAI from 'openai'
import { TraininClient, TraininAPIError } from '@/lib/trainin/client'
import { TRAININ_TOOLS, type ToolName } from '@/lib/trainin/tools'
import { VERCEL_TOOLS, type VercelToolName } from '@/lib/vercel/tools'
import { VercelClient } from '@/lib/vercel/client'

// OpenAI SDK — geeft twee opties: OpenRouter primair, Gemini als fallback
function getAIClients(): Array<{ client: OpenAI; model: string; name: string }> {
  const clients: Array<{ client: OpenAI; model: string; name: string }> = []

  const openrouterKey = process.env.OPENROUTER_API_KEY
  if (openrouterKey) {
    clients.push({
      name: 'OpenRouter',
      model: process.env.OPENROUTER_MODEL ?? 'openrouter/hunter-alpha',
      client: new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: openrouterKey,
        defaultHeaders: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://traininsight.nl',
          'X-Title': 'Traininsight',
        },
      }),
    })
  }

  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    clients.push({
      name: 'Gemini',
      model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
      client: new OpenAI({
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        apiKey: geminiKey,
      }),
    })
  }

  if (clients.length === 0) throw new Error('Geen AI API key ingesteld (OPENROUTER_API_KEY of GEMINI_API_KEY)')
  return clients
}

// Backwards compat helper — geeft de eerste beschikbare client
function getAIClient(): { client: OpenAI; model: string } {
  return getAIClients()[0]
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ToolCallRecord {
  name: string
  input: unknown
  result: unknown
  success: boolean
}

export interface AgentResult {
  finalText: string
  toolCalls: ToolCallRecord[]
  inputTokens: number
  outputTokens: number
}

// Dispatch tool call naar de juiste TraininClient methode
async function executeTool(
  name: ToolName,
  args: Record<string, unknown>,
  client: TraininClient
): Promise<unknown> {
  switch (name) {
    case 'get_clients':
      return client.getClients({
        domain: args.domain as string | undefined,
        include: args.include as string | undefined,
        page: args.page as number | undefined,
        perPage: args.perPage as number | undefined,
      })

    case 'get_orders':
      return client.getOrders({
        domain: args.domain as string | undefined,
        orderDateFrom: args.orderDateFrom as string | undefined,
        orderDateUntil: args.orderDateUntil as string | undefined,
        invoiceDateFrom: args.invoiceDateFrom as string | undefined,
        invoiceDateUntil: args.invoiceDateUntil as string | undefined,
        include: args.include as string | undefined,
        page: args.page as number | undefined,
        perPage: args.perPage as number | undefined,
      })

    case 'get_sessions':
      return client.getSessions({
        domain: args.domain as string | undefined,
        from: args.from as string | undefined,
        until: args.until as string | undefined,
        include: args.include as string | undefined,
        page: args.page as number | undefined,
        perPage: args.perPage as number | undefined,
      })

    case 'get_businesses':
      return client.getBusinesses({
        page: args.page as number | undefined,
        perPage: args.perPage as number | undefined,
      })

    default:
      throw new Error(`Onbekend tool: ${name}`)
  }
}

// Dispatch tool call naar de juiste VercelClient methode
async function executeVercelTool(
  name: VercelToolName,
  args: Record<string, unknown>,
  client: VercelClient
): Promise<unknown> {
  switch (name) {
    case 'get_vercel_status':
      return client.getProject()
    case 'get_vercel_deployments':
      return client.getDeployments(args.limit as number | undefined)
    default:
      throw new Error(`Onbekend Vercel tool: ${name}`)
  }
}

// ============================================
// Streaming Agentic Loop
// ============================================
// Stuurt SSE events naar de frontend:
// - tool_start: AI gaat data ophalen
// - tool_end: data opgehaald
// - text_delta: tekstfragment van het antwoord
// - done: klaar

// Hulpfunctie om tool resultaten in te korten als ze te groot zijn
function truncateToolResult(result: unknown, maxLength = 50000): string {
  const json = JSON.stringify(result)
  if (json.length <= maxLength) return json

  return JSON.stringify({
    warning: `Data is ingekort omdat het te groot was (${json.length} tekens). Probeer een specifiekere periode of filters te gebruiken.`,
    truncated_data: typeof result === 'object' && result !== null && 'data' in result && Array.isArray((result as any).data)
      ? {
          ...result as any,
          data: (result as any).data.slice(0, 10), // Behoud alleen de eerste 10 items
          total_hidden: (result as any).data.length - 10
        }
      : 'Data te groot om weer te geven'
  })
}

export async function runAgentLoop(params: {
  messages: ChatMessage[]
  systemPrompt: string
  traininClient: TraininClient
  onEvent: (event: string, data: unknown) => void
}): Promise<AgentResult> {
  const { messages, systemPrompt, traininClient, onEvent } = params
  const aiClients = getAIClients()
  let clientIndex = 0
  let { client: openai, model, name: providerName } = aiClients[clientIndex]
  console.log('[AI] Using provider:', providerName, 'model:', model)

  const toolCalls: ToolCallRecord[] = []
  let totalInputTokens = 0
  let totalOutputTokens = 0

  // Bouw de berichten array op met systeem-prompt
  const workingMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  // Agentic loop: ga door totdat er geen tool calls meer zijn
  for (let iteration = 0; iteration < 10; iteration++) {
    let response
    try {
      response = await openai.chat.completions.create({
        model,
        messages: workingMessages,
        tools: [...TRAININ_TOOLS, ...VERCEL_TOOLS],
        tool_choice: 'auto',
        stream: true,
        max_tokens: 8192,
        stream_options: { include_usage: true }
      })
    } catch (err: any) {
      console.error('[AI] API error on', providerName, ':', err.status, err.message)
      const status = err.status || err.statusCode
      // Probeer volgende provider als die beschikbaar is
      if (clientIndex + 1 < aiClients.length) {
        clientIndex++
        const next = aiClients[clientIndex]
        openai = next.client
        model = next.model
        providerName = next.name
        console.log('[AI] Falling back to:', providerName, model)
        continue
      }
      if (status === 404) {
        throw new Error(`Model '${model}' niet gevonden. Controleer OPENROUTER_MODEL of GEMINI_MODEL in je .env.local bestand.`)
      }
      if (status === 400) {
        throw new Error(`AI-provider fout (400): Waarschijnlijk is de context te groot geworden door te veel data. Probeer een specifiekere vraag te stellen.`)
      }
      throw err
    }

    // Verzamel streaming content
    let textContent = ''
    const pendingToolCalls: Array<{
      id: string
      name: string
      argumentsRaw: string
    }> = []

    let inputTokens = 0
    let outputTokens = 0
    let finishReason = ''

    for await (const chunk of response) {
      const choice = chunk.choices[0]

      // Tokengebruik bijhouden (Gemini stuurt dit vaak in een apart chunk aan het einde)
      if (chunk.usage) {
        inputTokens = chunk.usage.prompt_tokens ?? 0
        outputTokens = chunk.usage.completion_tokens ?? 0
      }

      if (!choice) continue
      finishReason = choice.finish_reason ?? finishReason

      const delta = choice.delta

      // Tekstfragmenten streamen
      if (delta.content) {
        textContent += delta.content
        onEvent('text_delta', { text: delta.content })
      }

      // Tool calls opbouwen
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = tc.index ?? 0
          if (!pendingToolCalls[idx]) {
            pendingToolCalls[idx] = {
              id: tc.id ?? `tool_${idx}`,
              name: tc.function?.name ?? '',
              argumentsRaw: '',
            }
          }
          if (tc.function?.name) {
            pendingToolCalls[idx].name = tc.function.name
          }
          if (tc.function?.arguments) {
            pendingToolCalls[idx].argumentsRaw += tc.function.arguments
          }
        }
      }
    }

    totalInputTokens += inputTokens
    totalOutputTokens += outputTokens

    // Geen tool calls → definitief antwoord
    if (finishReason !== 'tool_calls' || pendingToolCalls.length === 0) {
      onEvent('done', {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
      })
      return {
        finalText: textContent,
        toolCalls,
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
      }
    }

    // Tool calls uitvoeren
    const assistantMessage: OpenAI.Chat.ChatCompletionMessageParam = {
      role: 'assistant',
      content: textContent || null,
      tool_calls: pendingToolCalls.map((tc) => ({
        id: tc.id,
        type: 'function' as const,
        function: { name: tc.name, arguments: tc.argumentsRaw },
      })),
    }
    workingMessages.push(assistantMessage)

    const toolResultMessages: OpenAI.Chat.ChatCompletionMessageParam[] = []

    for (const tc of pendingToolCalls) {
      if (!tc.name) continue

      onEvent('tool_start', { tool: tc.name })

      let args: Record<string, unknown> = {}
      try {
        args = JSON.parse(tc.argumentsRaw || '{}')
      } catch {
        // Behoud lege args
      }

      let result: unknown
      let success = true

      try {
        if (tc.name.startsWith('get_vercel_')) {
          const vercelClient = new VercelClient()
          result = await executeVercelTool(tc.name as VercelToolName, args, vercelClient)
        } else {
          result = await executeTool(tc.name as ToolName, args, traininClient)
        }
      } catch (err) {
        success = false
        if (err instanceof TraininAPIError) {
          let hint = ''
          if (err.status === 401 || err.status === 403) hint = ' Hint: De API key is mogelijk ongeldig of heeft geen rechten. Vraag de gebruiker om de instellingen te controleren.'
          if (err.status === 400) hint = ' Hint: De parameters zijn mogelijk ongeldig (bijv. verkeerd datumformaat). Probeer het met andere of minder parameters.'
          if (err.status === 404) hint = ' Hint: Het gevraagde record of endpoint bestaat niet. Controleer IDs of probeer een lijst-tool.'
          if (err.status === 429) hint = ' Hint: Rate limit bereikt. Wacht even of vraag minder data op (bijv. kleinere perPage of kortere periode).'
          if (err.status === 408) hint = ' Hint: Timeout. Probeer een veel kleinere periode of minder data op te vragen.'
          
          result = { 
            error: err.message, 
            status: err.status,
            self_healing_hint: hint || 'Probeer een alternatieve aanpak of andere parameters.'
          }
        } else {
          result = { error: err instanceof Error ? err.message : 'Onverwachte fout bij het ophalen van data' }
        }
      }

      onEvent('tool_end', { tool: tc.name, success })
      toolCalls.push({ name: tc.name, input: args, result, success })

      // Truncate result before sending to LLM
      const truncatedResult = truncateToolResult(result)

      toolResultMessages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: truncatedResult,
      })
    }

    workingMessages.push(...toolResultMessages)
  }

  // Maximaal aantal iteraties bereikt
  onEvent('done', { inputTokens: totalInputTokens, outputTokens: totalOutputTokens })
  return {
    finalText: 'Ik kon de vraag niet volledig beantwoorden (maximaal aantal stappen bereikt). Probeer het opnieuw met een specifiekere vraag.',
    toolCalls,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
  }
}
