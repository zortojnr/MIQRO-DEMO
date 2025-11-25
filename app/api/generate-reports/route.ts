import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"
import { z } from "zod"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const schema = z.object({ schoolId: z.string().min(1), month: z.string().regex(/^\d{4}-\d{2}$/) })
  const json = await req.json()
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  const { schoolId, month } = parsed.data

  const teachers = await prisma.user.findMany({ where: { role: "teacher", schoolId } })
  const teacherIds = teachers.map(t => t.id)

  const attendance = await prisma.attendance.findMany({ where: { teacherId: { in: teacherIds } } })
  const analyses = await prisma.lessonAnalysis.findMany({ where: { teacherId: { in: teacherIds } } })
  const studentWorks = await prisma.studentWork.findMany({ where: { teacherId: { in: teacherIds } } })

  const present = attendance.filter(a => a.status === "present").length
  const qualityScore = analyses.length === 0 ? 0 : Math.round((analyses.filter(a => a.syllabusMatch && !a.repetitionDetected).length / analyses.length) * 100)

  const teacherReport = {
    teacher_count: teachers.length,
    attendance_present: present,
    attendance_total: attendance.length,
    teaching_quality_score: qualityScore,
    improvement_trend_points: analyses.slice(-10).map(a => ({ createdAt: a.createdAt, score: a.syllabusMatch && !a.repetitionDetected ? 1 : 0 }))
  }

  const studentReport = {
    uploads_total: studentWorks.length,
    images: studentWorks.filter(s => s.type === "image").length,
    videos: studentWorks.filter(s => s.type === "video").length,
    recent_samples: studentWorks.slice(-6).map(s => ({ id: s.id, fileUrl: s.fileUrl, type: s.type, createdAt: s.createdAt }))
  }

  const impactReport = {
    teaching_improvement_rate: qualityScore,
    curriculum_suggestions: analyses.length === 0 ? [] : ["Increase variety of activities", "Reduce repetition of prior topics"],
    trends: {
      analyses: analyses.length,
      attendance: attendance.length
    }
  }

  const saved = await prisma.monthlyReport.create({ data: { schoolId, month, teacherReport, studentReport, impactReport } })
  return NextResponse.json({ ok: true, reportId: saved.id })
}

