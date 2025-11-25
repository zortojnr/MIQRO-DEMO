import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"
import { getOpenAI } from "../../../lib/ai"
import { z } from "zod"
import path from "path"
import fs from "fs"

export const runtime = "nodejs"

function toAbsolute(publicUrl: string) {
  return path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""))
}

export async function POST(req: Request) {
  try {
    const schema = z.object({ audioId: z.string().optional(), audioUrl: z.string().optional() }).refine(v => v.audioId || v.audioUrl, { message: "audioId or audioUrl required" })
    const body = await req.json()
    const parsedInput = schema.safeParse(body)
    if (!parsedInput.success) return NextResponse.json({ error: "audioId or audioUrl required" }, { status: 400 })
    const { audioId, audioUrl } = parsedInput.data

    let audio = audioId ? await prisma.classAudio.findUnique({ where: { id: audioId } }) : null
    if (!audio && audioUrl) {
      audio = await prisma.classAudio.findFirst({ where: { audioUrl } })
    }
    if (!audio) return NextResponse.json({ error: "Audio not found" }, { status: 404 })

    const absPath = toAbsolute(audio.audioUrl)
    if (!fs.existsSync(absPath)) return NextResponse.json({ error: "File missing" }, { status: 404 })

    const openai = getOpenAI()
    const transcriptRes = await openai.audio.transcriptions.create({
      file: fs.createReadStream(absPath) as any,
      model: "whisper-1"
    })
    const transcript = (transcriptRes as any).text as string

    const prompt = `You are MIQRO AI. Analyze this classroom transcript and return strict JSON with keys: syllabus_match (boolean), repetition_detected (boolean), strengths (array of short strings), improvements (array of short strings), summary (short string), feedback (short actionable feedback). Transcript: \n${transcript}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are MIQRO AI. Return only valid JSON." },
        { role: "user", content: prompt }
      ]
    })
    const content = completion.choices[0]?.message?.content ?? "{}"
    let aiJson: any
    try { aiJson = JSON.parse(content) } catch { aiJson = {} }

    const analysis = await prisma.lessonAnalysis.create({
      data: {
        teacherId: audio.teacherId,
        audioId: audio.id,
        syllabusMatch: Boolean(aiJson.syllabus_match),
        repetitionDetected: Boolean(aiJson.repetition_detected),
        strengths: Array.isArray(aiJson.strengths) ? aiJson.strengths : [],
        improvements: Array.isArray(aiJson.improvements) ? aiJson.improvements : [],
        summary: String(aiJson.summary || ""),
        feedback: String(aiJson.feedback || "")
      }
    })

    return NextResponse.json({ ok: true, analysisId: analysis.id, summary: analysis.summary, feedback: analysis.feedback })
  } catch (e) {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

