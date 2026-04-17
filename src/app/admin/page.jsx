"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const router = useRouter()

  const doctors = ["Dr. Ahmed", "Dr. Fatima", "Dr. Rahman"]

  // ✅ Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setAppointments(data)
  }, [])

  // ✅ Auth Check & Initial Load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
      } else {
        setLoading(false)
        fetchAppointments()
      }
    }
    checkUser()
  }, [router, fetchAppointments])

  // ✅ Update Doctor Assignment
  const handleDoctor = async (id) => {
    if (!selectedDoctor) return alert("Select a doctor first")
    await supabase.from("appointments").update({ doctor: selectedDoctor }).eq("id", id)
    setEditId(null)
    fetchAppointments()
  }

  // ✅ Mark as Completed
  const handleComplete = async (id) => {
    await supabase.from("appointments").update({ status: "completed" }).eq("id", id)
    setEditId(null)
    fetchAppointments()
  }

  // ✅ Delete Appointment
  const handleDelete = async (id) => {
    if (!confirm("Delete this appointment?")) return
    await supabase.from("appointments").delete().eq("id", id)
    fetchAppointments()
  }

  // ✅ Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    router.push("/login")
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 font-bold text-blue-600 animate-pulse">
      Abhayapuri Care Admin Panel Loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Admin <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-wide">Abhayapuri Care Management System</p>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="rounded-xl px-8 font-bold shadow-lg shadow-red-100">
            Logout
          </Button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-center">
            <Card className="rounded-[2rem] border-0 shadow-sm p-6 bg-white">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                <h3 className="text-4xl font-black text-slate-900">{appointments.length}</h3>
            </Card>
            <Card className="rounded-[2rem] border-0 shadow-sm p-6 bg-white border-l-8 border-yellow-400">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending Visits</p>
                <h3 className="text-4xl font-black text-slate-900">{appointments.filter(a => a.status !== 'completed').length}</h3>
            </Card>
            <Card className="rounded-[2rem] border-0 shadow-sm p-6 bg-white border-l-8 border-green-500">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                <h3 className="text-4xl font-black text-slate-900">{appointments.filter(a => a.status === 'completed').length}</h3>
            </Card>
        </div>

        {/* APPOINTMENTS TABLE */}
        <Card className="rounded-[2.5rem] border-0 shadow-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-6">Patient Details</th>
                  <th className="p-6">Appointment Date</th>
                  <th className="p-6">Assigned Doctor</th>
                  <th className="p-6">Current Status</th>
                  <th className="p-6 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {appointments.map((item) => (
                    <motion.tr 
                      key={item.id} 
                      layout 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="font-bold text-slate-800 text-lg">{item.name}</div>
                        <div className="text-xs font-bold text-slate-400 tracking-wide">{item.phone}</div>
                      </td>
                      <td className="p-6 text-sm font-semibold text-slate-600">
                        {new Date(item.date).toDateString()}
                      </td>
                      <td className="p-6">
                        <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
                            {item.doctor || "Unassigned"}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full inline-block ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {item.status === 'completed' ? "Completed" : "Awaiting"}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        {editId === item.id ? (
                          <div className="flex gap-2 justify-end items-center animate-in fade-in zoom-in duration-200">
                            <select 
                                onChange={(e) => setSelectedDoctor(e.target.value)} 
                                className="text-xs border-2 border-slate-100 rounded-xl p-2 bg-slate-50 font-bold outline-none focus:border-blue-400"
                            >
                              <option value="">Assign Doctor</option>
                              {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <Button size="sm" onClick={() => handleDoctor(item.id)} className="bg-blue-600 text-[10px] h-8 rounded-lg px-4">Save</Button>
                            <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" onClick={() => setEditId(item.id)} className="h-8 text-[10px] font-black uppercase rounded-lg">Assign</Button>
                            <Button size="sm" variant="outline" onClick={() => handleComplete(item.id)} className="h-8 text-[10px] font-black uppercase rounded-lg text-green-600 border-green-100 hover:bg-green-50">Done</Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 text-[10px] font-black uppercase rounded-lg text-red-400 hover:bg-red-50">Delete</Button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {appointments.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold">
                No appointments found in the system.
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}