"use client"
import { useState } from "react"
import { Button } from "../../../components/ui/button"

export default function UploadStudentWorkPage() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState("image")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append("file", file)
    form.append("type", type)
    const res = await fetch("/api/upload-student", { method: "POST", body: form })
    const data = await res.json()
    setLoading(false)
    if (data.ok) setResult(`Uploaded: ${data.fileUrl}`)
    else alert("Upload failed")
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Upload Student Work</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <select value={type} onChange={e => setType(e.target.value)} className="rounded border border-slate-300 px-3 py-2">
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input onChange={e => setFile(e.target.files?.[0] ?? null)} type="file" accept={type === "image" ? ".jpg,.png" : ".mp4"} />
        <Button disabled={loading} type="submit">{loading ? "Uploading..." : "Upload"}</Button>
      </form>
      {result && <p className="mt-4 text-slate-700">{result}</p>}
    </main>
  )
}

