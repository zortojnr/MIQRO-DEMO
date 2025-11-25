import { prisma } from "../../../lib/db"

export default async function AdminTeachersPage() {
  const teachers = await prisma.user.findMany({ where: { role: "teacher" }, orderBy: { name: "asc" } })
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Teachers</h1>
      <div className="mt-4 divide-y">
        {teachers.map((t: typeof teachers[number]) => (
          <div key={t.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-slate-600">{t.email}</div>
            </div>
          </div>
        ))}
        {teachers.length === 0 && <div>No teachers</div>}
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
