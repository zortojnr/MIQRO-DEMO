import { prisma } from "../../../lib/db"

export default async function GovDashboard() {
  const analysesTotal = await prisma.lessonAnalysis.count()
  const attendanceTotal = await prisma.attendance.count()
  const latestReport = await prisma.monthlyReport.findFirst({ orderBy: { createdAt: "desc" } })

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Government Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Total Analyses</div><div className="text-3xl font-semibold">{analysesTotal}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Total Attendance</div><div className="text-3xl font-semibold">{attendanceTotal}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Latest Impact Summary</div><div className="text-slate-800">{latestReport ? JSON.stringify(latestReport.impactReport).slice(0, 120) : "No report"}</div></div>
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
