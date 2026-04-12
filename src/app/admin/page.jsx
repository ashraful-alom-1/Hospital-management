"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const router = useRouter()

  const doctors = ["Dr. Ahmed", "Dr. Fatima", "Dr. Rahman"]

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (!loading) fetchAppointments()
  }, [loading])

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setAppointments(data)
  }

  // ✅ Assign Doctor
  const handleDoctor = async (id) => {
    await supabase
      .from("appointments")
      .update({ doctor: selectedDoctor })
      .eq("id", id)

    setEditId(null)
    fetchAppointments()
  }

  // ✅ Complete
  const handleComplete = async (id) => {
    await supabase
      .from("appointments")
      .update({ status: "completed" })
      .eq("id", id)

    setEditId(null)
    fetchAppointments()
  }

  // ✅ Delete
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this appointment?")
    if (!confirmDelete) return

    await supabase.from("appointments").delete().eq("id", id)
    setEditId(null)
    fetchAppointments()
  }

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    router.push("/login")
  }

  if (loading) return <p className="p-10">Checking authentication...</p>

  return (
    <div className="p-10">

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          style={{ background: "red", color: "white", padding: "10px", borderRadius: "6px" }}
        >
          Logout
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr style={{ background: "#ddd" }}>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Doctor</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.email}</td>
              <td className="p-2 border">{item.phone}</td>
              <td className="p-2 border">
                {new Date(item.date).toDateString()}
              </td>

              {/* DOCTOR */}
              <td className="p-2 border">
                {item.doctor || "Not Assigned"}
              </td>

              {/* STATUS */}
              <td className="p-2 border">
                {item.status === "completed" ? "🟢 Completed" : "🟡 Pending"}
              </td>

              {/* ACTION */}
              <td className="p-2 border">

                {editId === item.id ? (
                  <>
                    {/* Doctor Select */}
                    <select
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      style={{ marginRight: "5px" }}
                    >
                      <option>Select Doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc}>{doc}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDoctor(item.id)}
                      style={{ background: "blue", color: "white", marginRight: "5px" }}
                    >
                      Save
                    </button>

                    {item.status !== "completed" && (
                      <button
                        onClick={() => handleComplete(item.id)}
                        style={{ background: "green", color: "white", marginRight: "5px" }}
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ background: "crimson", color: "white", marginRight: "5px" }}
                    >
                      Delete
                    </button>

                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditId(item.id)}
                    style={{ background: "blue", color: "white", padding: "5px" }}
                  >
                    Edit
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}