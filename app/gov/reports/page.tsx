import { prisma } from "../../../lib/db"

export default async function GovReportsPage() {
  const reports = await prisma.monthlyReport.findMany({ orderBy: { createdAt: "desc" }, take: 12 })
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">State-Level Reports</h1>
      <div className="mt-4 space-y-3">
        {reports.map((r: typeof reports[number]) => (
          <div key={r.id} className="rounded border p-3">
            <div className="font-medium">{r.month}</div>
            <div className="text-sm text-slate-600">School: {r.schoolId}</div>
            <div className="mt-2 flex gap-2">
              <a className="rounded bg-slate-900 px-3 py-2 text-white" href={`/api/reports/${r.id}/impact`}>Download Impact Report</a>
            </div>
          </div>
        ))}
        {reports.length === 0 && <div>No reports</div>}
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
