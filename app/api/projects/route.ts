import { NextResponse } from 'next/server'
import { requireDashboardSession } from '@/lib/auth/guard'
import { createProject } from '@/features/dashboard/data/projects.write'
import { parseProjectInput } from '@/features/dashboard/data/projects.input'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const input = parseProjectInput(body)
  if (!input) {
    return NextResponse.json(
      { error: 'Project name is required.' },
      { status: 400 },
    )
  }

  try {
    const id = await createProject(input)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
