import { prisma } from "../../../lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

export default async function TeacherDashboard() {
  const session: any = await getServerSession(authOptions as any)
  const user = session?.user as any
  const teacherId = user?.id || ""
  const attendanceCount = await prisma.attendance.count({ where: { teacherId } })
  const latestAudio = await prisma.classAudio.findFirst({ where: { teacherId }, orderBy: { date: "desc" } })
  const latestAnalysis = latestAudio ? await prisma.lessonAnalysis.findFirst({ where: { audioId: latestAudio.id }, orderBy: { createdAt: "desc" } }) : null

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-600">Attendance Records</div>
          <div className="text-3xl font-semibold">{attendanceCount}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-600">Latest Audio</div>
          <div className="text-slate-800">{latestAudio ? latestAudio.audioUrl : "None"}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-600">Latest Analysis Summary</div>
          <div className="text-slate-800">{latestAnalysis ? latestAnalysis.summary : "No analysis yet"}</div>
        </div>
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
