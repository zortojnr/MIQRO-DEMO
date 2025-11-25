"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
 
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) router.push("/")
    else alert("Invalid credentials")
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="absolute left-4 top-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 px-4">
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Login</h1>
          <label className="sr-only" htmlFor="email">Email</label>
          <Input id="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="sr-only" htmlFor="password">Password</label>
          <Input id="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button disabled={loading} type="submit" aria-label="Login">{loading ? "Signing in..." : "Login"}</Button>
        </form>

        <div className="rounded-lg border border-brand-500/30 bg-brand-50 p-6">
          <p className="text-sm text-slate-700">First time signing in? <span className="font-medium">Create an account</span></p>
          <a
            href="/auth/signup"
            className="mt-3 inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label="Sign Up"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  )
}
