"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // ✅ Check session (safe)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      // 👉 ONLY redirect if real session exists
      if (data.session) {
        router.push("/admin")
      }
    }

    checkSession()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Login failed ❌")
    } else {
      alert("Login successful ✅")
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow rounded space-y-4 w-80"
      >
        <h2 className="text-xl font-bold text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}