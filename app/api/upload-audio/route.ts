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
  const file = form.get("audio") as File | null
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const ext = path.extname((file as any).name || "") || ".m4a"
  const allowed = [".mp3", ".wav", ".m4a"]
  if (!allowed.includes(ext)) return NextResponse.json({ error: "Invalid type" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dir = path.join(process.cwd(), "public", "uploads", "audio")
  await mkdir(dir, { recursive: true })
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(dir, filename)
  await writeFile(filepath, buffer)
  const url = `/uploads/audio/${filename}`

  const audio = await prisma.classAudio.create({ data: { teacherId: user.id, audioUrl: url } })
  await prisma.attendance.create({ data: { teacherId: user.id, status: "present" } })

  return NextResponse.json({ ok: true, audioId: audio.id, audioUrl: url })
}

