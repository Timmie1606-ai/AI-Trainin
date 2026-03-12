import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkIsAdmin } from '@/lib/admin'

// DELETE: gebruiker verwijderen
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })

  const { id: userId } = await params

  const serviceClient = createServiceClient()

  // Verwijder uit Supabase Auth (cascade verwijdert ook alle gerelateerde data)
  const { error } = await serviceClient.auth.admin.deleteUser(userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
