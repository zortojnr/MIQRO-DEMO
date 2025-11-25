import { prisma } from "../../../lib/db"

export default async function AdminStudentWorkPage() {
  const items = await prisma.studentWork.findMany({ orderBy: { createdAt: "desc" }, take: 50 })
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Student Work</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((i: typeof items[number]) => (
          <div key={i.id} className="rounded border p-2">
            <div className="text-sm text-slate-600">{i.type}</div>
            {i.type === "image" ? (
              <img src={i.fileUrl} className="mt-2 h-40 w-full object-cover" />
            ) : (
              <video src={i.fileUrl} controls className="mt-2 h-40 w-full object-cover" />
            )}
          </div>
        ))}
        {items.length === 0 && <div>No items</div>}
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
