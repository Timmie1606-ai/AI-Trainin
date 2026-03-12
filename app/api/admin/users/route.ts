import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { checkIsAdmin } from '@/lib/admin'

// GET: alle gebruikers ophalen met credential status
export async function GET() {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })

  const serviceClient = createServiceClient()

  const { data: users, error } = await serviceClient
    .from('user_profiles')
    .select('id, email, display_name, is_admin, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Gebruikers ophalen mislukt' }, { status: 500 })
  }

  const { data: credentials } = await serviceClient
    .from('trainin_credentials')
    .select('user_id, is_verified, trainin_account_name, last_verified_at')

  const credMap = new Map(credentials?.map((c) => [c.user_id, c]) ?? [])

  const result = (users ?? []).map((u) => ({
    ...u,
    credentials: credMap.get(u.id) ?? null,
  }))

  return NextResponse.json({ users: result })
}

const createUserSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(8, 'Wachtwoord minimaal 8 tekens'),
  displayName: z.string().min(1, 'Naam is verplicht'),
})

// POST: nieuw account aanmaken
export async function POST(request: Request) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldig JSON' }, { status: 400 })
  }

  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { email, password, displayName } = parsed.data

  const serviceClient = createServiceClient()
  const { data, error } = await serviceClient.auth.admin.createUser({
    email,
    password,
    user_metadata: { display_name: displayName },
    email_confirm: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: { id: data.user.id, email: data.user.email } })
}
