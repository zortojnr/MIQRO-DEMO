 

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold">MIQRO</h1>
        <p className="text-slate-600">Education monitoring MVP</p>
        <div className="flex items-center justify-center gap-3">
          <a className="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2" href="/auth/login" aria-label="Login">Login</a>
        </div>
      </div>
    </main>
  )
}

