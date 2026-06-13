import { NextResponse } from 'next/server'
import { requireDashboardSession } from '@/lib/auth/guard'
import { deleteCategory, updateCategory } from '@/features/dashboard/data/categories.write'
import { parseCategoryInput } from '@/features/dashboard/data/categories.input'

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
    return NextResponse.json({ error: 'Category id is required.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const input = parseCategoryInput(body)
  if (!input) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }

  try {
    await updateCategory(id, input)
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
    return NextResponse.json({ error: 'Category id is required.' }, { status: 400 })
  }

  try {
    await deleteCategory(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
