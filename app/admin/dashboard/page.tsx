import { prisma } from "../../../lib/db"

export default async function AdminDashboard() {
  const teachers = await prisma.user.findMany({ where: { role: "teacher" } })
  const attendanceTotal = await prisma.attendance.count()
  const analysesTotal = await prisma.lessonAnalysis.count()
  const studentWorkTotal = await prisma.studentWork.count()

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Teachers</div><div className="text-3xl font-semibold">{teachers.length}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Attendance</div><div className="text-3xl font-semibold">{attendanceTotal}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Analyses</div><div className="text-3xl font-semibold">{analysesTotal}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-slate-600">Student Work</div><div className="text-3xl font-semibold">{studentWorkTotal}</div></div>
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
