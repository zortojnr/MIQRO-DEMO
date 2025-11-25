import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/db"
import { z } from "zod"
import { hash } from "bcrypt"

export async function POST(req: Request) {
  try {
    const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) })
    const json = await req.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    const { name, email, password } = parsed.data

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

    const hashed = await hash(password, 10)
    await prisma.user.create({ data: { name, email, password: hashed, role: "teacher" } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Registration failed. Please check server configuration." }, { status: 500 })
  }
}
