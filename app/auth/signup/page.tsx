"use client"
import { useState } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { alert("Passwords do not match") ; return }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      let data: any = null
      try { data = await res.json() } catch {
        const text = await res.text()
        data = { ok: false, error: text || "Unexpected response" }
      }
      setLoading(false)
      if (res.ok && data?.ok) router.push("/auth/login")
      else alert(data?.error || "Registration failed")
    } catch {
      setLoading(false)
      alert("Network error. Please try again.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <label className="sr-only" htmlFor="name">Name</label>
        <Input id="name" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <label className="sr-only" htmlFor="email">Email</label>
        <Input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label className="sr-only" htmlFor="password">Password</label>
        <Input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label className="sr-only" htmlFor="confirm">Confirm Password</label>
        <Input id="confirm" type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        <Button disabled={loading} type="submit" aria-label="Sign Up">{loading ? "Creating..." : "Sign Up"}</Button>
        <p className="text-xs text-slate-600">By creating an account, you agree to our terms.</p>
      </form>
    </main>
  )
}
