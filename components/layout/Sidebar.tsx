import Link from "next/link"

export function Sidebar({ role }: { role: "teacher" | "admin" | "gov" }) {
  const links = role === "teacher"
    ? [
        { href: "/teacher/dashboard", label: "Dashboard" },
        { href: "/teacher/upload-audio", label: "Upload Audio" },
        { href: "/teacher/upload-student", label: "Upload Student Work" },
        { href: "/teacher/feedback", label: "Feedback" }
      ]
    : role === "admin"
    ? [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/teachers", label: "Teachers" },
        { href: "/admin/student-work", label: "Student Work" },
        { href: "/admin/reports", label: "Reports" }
      ]
    : [
        { href: "/gov/dashboard", label: "Overview" },
        { href: "/gov/reports", label: "Reports" }
      ]
  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <div className="p-4 font-semibold">MIQRO</div>
      <nav className="space-y-2 p-2">
        {links.map(l => (
          <Link prefetch={false} key={l.href} className="block rounded px-3 py-2 hover:bg-slate-100" href={l.href}>{l.label}</Link>
        ))}
      </nav>
    </aside>
  )
}

