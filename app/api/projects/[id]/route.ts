import { NextResponse } from 'next/server'
import { requireDashboardSession } from '@/lib/auth/guard'
import { deleteProject, setProjectActive, updateProject } from '@/features/dashboard/data/projects.write'
import { parseProjectInput } from '@/features/dashboard/data/projects.input'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: 'Project id is required.' }, { status: 400 })
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
    await updateProject(id, input)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Lightweight partial update for the dashboard active/inactive toggle.
export async function PATCH(request: Request, context: RouteContext) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: 'Project id is required.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const isActive = (body as { isActive?: unknown })?.isActive
  if (typeof isActive !== 'boolean') {
    return NextResponse.json({ error: 'Expected { isActive: boolean }.' }, { status: 400 })
  }

  try {
    await setProjectActive(id, isActive)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: 'Project id is required.' }, { status: 400 })
  }

  try {
    await deleteProject(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
