import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getDecryptedCredentials } from '../route'
import { TraininClient } from '@/lib/trainin/client'

export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const credentials = await getDecryptedCredentials(user.id)
  if (!credentials) {
    return NextResponse.json({ error: 'Geen credentials gevonden' }, { status: 404 })
  }

  const client = new TraininClient(credentials.apiKey, credentials.tenantId)
  const verifyResult = await client.verify()

  const serviceClient = createServiceClient()
  await serviceClient
    .from('trainin_credentials')
    .update({
      is_verified: verifyResult.success,
      last_verified_at: new Date().toISOString(),
      trainin_account_name: verifyResult.accountName ?? null,
    })
    .eq('user_id', user.id)

  if (!verifyResult.success) {
    return NextResponse.json(
      { error: verifyResult.error ?? 'Verificatie mislukt. Controleer je API Key en Tenant ID.' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    accountName: verifyResult.accountName,
  })
}
