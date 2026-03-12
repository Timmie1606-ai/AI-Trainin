import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { encrypt, decrypt } from '@/lib/encryption/credentials'

const credentialsSchema = z.object({
  apiKey: z.string().min(10, 'API Key te kort'),
  tenantId: z.string().min(1, 'Tenant ID is verplicht'),
})

// GET: controleer of gebruiker credentials heeft (metadata only, geen keys!)
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const { data } = await supabase
    .from('trainin_credentials')
    .select('is_verified, last_verified_at, trainin_account_name, created_at')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ credentials: data ?? null })
}

// POST: sla nieuwe credentials op (versleuteld)
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldig JSON' }, { status: 400 })
  }

  const parsed = credentialsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { apiKey, tenantId } = parsed.data

  const encryptedApiKey = encrypt(apiKey)
  const encryptedTenantId = encrypt(tenantId)

  const serviceClient = createServiceClient()
  const { error } = await serviceClient
    .from('trainin_credentials')
    .upsert({
      user_id: user.id,
      encrypted_api_key: encryptedApiKey.ciphertext,
      api_key_iv: encryptedApiKey.iv,
      encrypted_tenant_id: encryptedTenantId.ciphertext,
      tenant_id_iv: encryptedTenantId.iv,
      is_verified: false,
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('Credentials opslaan mislukt:', error)
    return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// Helper: haal gedecrypteerde credentials op voor interne API routes
export async function getDecryptedCredentials(userId: string): Promise<{ apiKey: string; tenantId: string } | null> {
  const serviceClient = createServiceClient()

  const { data, error } = await serviceClient
    .from('trainin_credentials')
    .select('encrypted_api_key, api_key_iv, encrypted_tenant_id, tenant_id_iv')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null

  try {
    return {
      apiKey: decrypt(data.encrypted_api_key, data.api_key_iv),
      tenantId: decrypt(data.encrypted_tenant_id, data.tenant_id_iv),
    }
  } catch {
    return null
  }
}
