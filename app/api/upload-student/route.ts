import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  const user = session?.user as any
  if (!user?.id || user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const file = form.get("file") as File | null
  const type = form.get("type") as string | null
  if (!file || !type) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const allowedImages = [".jpg", ".png"]
  const allowedVideos = [".mp4"]
  const ext = path.extname((file as any).name || "")
  if (type === "image" && !allowedImages.includes(ext)) return NextResponse.json({ error: "Invalid image" }, { status: 400 })
  if (type === "video" && !allowedVideos.includes(ext)) return NextResponse.json({ error: "Invalid video" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dir = path.join(process.cwd(), "public", "uploads", "student-work")
  await mkdir(dir, { recursive: true })
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(dir, filename)
  await writeFile(filepath, buffer)
  const url = `/uploads/student-work/${filename}`

  const work = await prisma.studentWork.create({ data: { teacherId: user.id, fileUrl: url, type } })
  return NextResponse.json({ ok: true, id: work.id, fileUrl: url })
}

