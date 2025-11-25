import { NextResponse } from "next/server"
import { prisma } from "../../../../../lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const report = await prisma.monthlyReport.findUnique({ where: { id: params.id } })
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(report.studentReport)
}

