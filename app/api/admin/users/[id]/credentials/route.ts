import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption/credentials'
import { checkIsAdmin } from '@/lib/admin'

const schema = z.object({
  apiKey: z.string().min(10, 'API Key te kort'),
  tenantId: z.string().min(1, 'Tenant ID is verplicht'),
})

// POST: credentials instellen voor een gebruiker
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })

  const { id: userId } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldig JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
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
      user_id: userId,
      encrypted_api_key: encryptedApiKey.ciphertext,
      api_key_iv: encryptedApiKey.iv,
      encrypted_tenant_id: encryptedTenantId.ciphertext,
      tenant_id_iv: encryptedTenantId.iv,
      is_verified: false,
    }, { onConflict: 'user_id' })

  if (error) {
    return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
