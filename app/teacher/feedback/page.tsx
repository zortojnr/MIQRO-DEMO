import { prisma } from "../../../lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

export default async function TeacherFeedbackPage() {
  const session: any = await getServerSession(authOptions as any)
  const user = session?.user as any
  const analyses = await prisma.lessonAnalysis.findMany({ where: { teacherId: user?.id || "" }, orderBy: { createdAt: "desc" }, take: 10 })

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Daily Feedback</h1>
      <div className="space-y-4">
        {analyses.map((a: typeof analyses[number]) => (
          <div key={a.id} className="rounded-lg border p-4">
            <div className="text-sm text-slate-600">Summary</div>
            <div className="font-medium">{a.summary}</div>
            <div className="mt-2 text-sm text-slate-600">Feedback</div>
            <div>{a.feedback}</div>
            <div className="mt-2 text-sm text-slate-600">Syllabus Match: {a.syllabusMatch ? "Yes" : "No"}</div>
            <div className="mt-2 text-sm text-slate-600">Repetition: {a.repetitionDetected ? "Detected" : "Not detected"}</div>
          </div>
        ))}
        {analyses.length === 0 && <div>No feedback yet</div>}
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
