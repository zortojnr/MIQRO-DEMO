"use client"
import { useState } from "react"
import { Button } from "../../../components/ui/button"

export default function UploadAudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const [analysis, setAnalysis] = useState<{ summary: string; feedback: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append("audio", file)
    const res = await fetch("/api/upload-audio", { method: "POST", body: form })
    const data = await res.json()
    setLoading(false)
    if (data.ok) {
      setResult(`Uploaded: ${data.audioUrl}`)
      try {
        const proc = await fetch("/api/process-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioId: data.audioId })
        })
        const procData = await proc.json()
        if (procData.ok) setAnalysis({ summary: procData.summary, feedback: procData.feedback })
      } catch {}
    }
    else alert("Upload failed")
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Upload Audio</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <input onChange={e => setFile(e.target.files?.[0] ?? null)} type="file" accept=".mp3,.wav,.m4a" />
        <Button disabled={loading} type="submit">{loading ? "Uploading..." : "Upload"}</Button>
      </form>
      {result && <p className="mt-4 text-slate-700">{result}</p>}
      {analysis && (
        <div className="mt-4 rounded border p-4">
          <div className="text-sm text-slate-600">Analysis Summary</div>
          <div className="font-medium">{analysis.summary}</div>
          <div className="mt-2 text-sm text-slate-600">Feedback</div>
          <div>{analysis.feedback}</div>
        </div>
      )}
    </main>
  )
}

