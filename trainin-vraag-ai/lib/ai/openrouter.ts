import OpenAI from 'openai'
import { TraininClient, TraininAPIError } from '@/lib/trainin/client'
import { TRAININ_TOOLS, type ToolName } from '@/lib/trainin/tools'

// OpenAI SDK configureren voor Google Gemini (OpenAI-compatibele endpoint)
function getOpenRouterClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is niet ingesteld')

  return new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey,
  })
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

// ============================================
// Streaming Agentic Loop
// ============================================
// Stuurt SSE events naar de frontend:
// - tool_start: AI gaat data ophalen
// - tool_end: data opgehaald
// - text_delta: tekstfragment van het antwoord
// - done: klaar

export async function runAgentLoop(params: {
  messages: ChatMessage[]
  systemPrompt: string
  traininClient: TraininClient
  onEvent: (event: string, data: unknown) => void
}): Promise<AgentResult> {
  const { messages, systemPrompt, traininClient, onEvent } = params
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
  const openai = getOpenRouterClient()

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
    const response = await openai.chat.completions.create({
      model,
      messages: workingMessages,
      tools: TRAININ_TOOLS,
      tool_choice: 'auto',
      stream: true,
      max_tokens: 8192,
    })

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
      if (!choice) continue

      finishReason = choice.finish_reason ?? finishReason

      // Tokengebruik bijhouden
      if (chunk.usage) {
        inputTokens = chunk.usage.prompt_tokens ?? 0
        outputTokens = chunk.usage.completion_tokens ?? 0
      }

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
        result = await executeTool(tc.name as ToolName, args, traininClient)
      } catch (err) {
        success = false
        if (err instanceof TraininAPIError) {
          result = { error: err.message, status: err.status }
        } else {
          result = { error: 'Onverwachte fout bij het ophalen van data' }
        }
      }

      onEvent('tool_end', { tool: tc.name, success })
      toolCalls.push({ name: tc.name, input: args, result, success })

      toolResultMessages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      })
    }

    workingMessages.push(...toolResultMessages)
  }

  // Maximaal aantal iteraties bereikt
  onEvent('done', { inputTokens: totalInputTokens, outputTokens: totalOutputTokens })
  return {
    finalText: 'Ik kon de vraag niet volledig beantwoorden. Probeer het opnieuw.',
    toolCalls,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
  }
}
