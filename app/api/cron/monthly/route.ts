import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/db"

export const runtime = "nodejs"

export async function POST() {
  const teachers = await prisma.user.findMany({ where: { role: "teacher" }, select: { schoolId: true } })
  const schoolIds = Array.from(new Set(teachers.map((t: { schoolId: string | null }) => t.schoolId).filter(Boolean))) as string[]
  const month = new Date().toISOString().slice(0, 7)
  const base = process.env.NEXT_PUBLIC_BASE_URL
  if (!base) return NextResponse.json({ error: "Base URL not configured" }, { status: 500 })
  const tasks = schoolIds.map(schoolId => fetch(`${base}/api/generate-reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ schoolId, month })
  }))
  await Promise.allSettled(tasks)
  return NextResponse.json({ ok: true, month })
}

