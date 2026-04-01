"use client"

import { supabase } from "../lib/supabase"

export default function Home() {

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const name = formData.get("name")
    const email = formData.get("email")
    const message = formData.get("message")

    const { error } = await supabase
      .from("appointments")
      .insert([
        {
          name,
          email,
          message,
          date: new Date().toISOString(),
        },
      ])

    if (error) {
      alert("Error saving data ❌")
      console.log(error)
    } else {
      alert("Appointment Booked Successfully ✅")
      e.target.reset()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-blue-600">Selyan Care Hospital</h1>
        <div className="space-x-4">
          <button className="text-gray-700">Home</button>
          <button className="text-gray-700">Doctors</button>
          <button className="text-gray-700">Services</button>
          <button className="text-gray-700">Contact</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-100">
        <h2 className="text-4xl font-bold text-blue-800">
          Your Health, Our Priority
        </h2>
        <p className="mt-4 text-gray-600">
          Trusted healthcare services in Lakhipur, Assam
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg">
          Book Appointment
        </button>
      </section>

      {/* Services */}
      <section className="p-10">
        <h3 className="text-2xl font-bold text-center mb-8">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded">
            <h4 className="font-semibold text-lg">General Medicine</h4>
            <p className="text-gray-500 mt-2">Basic health checkups and treatment</p>
          </div>
          <div className="p-6 bg-white shadow rounded">
            <h4 className="font-semibold text-lg">Maternity Care</h4>
            <p className="text-gray-500 mt-2">Safe pregnancy and delivery services</p>
          </div>
          <div className="p-6 bg-white shadow rounded">
            <h4 className="font-semibold text-lg">Emergency Care</h4>
            <p className="text-gray-500 mt-2">24/7 emergency support</p>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="p-10 bg-gray-100">
        <h3 className="text-2xl font-bold text-center mb-8">Our Doctors</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded shadow text-center">
            <img src="https://via.placeholder.com/150" className="mx-auto rounded-full mb-4" />
            <h4 className="font-semibold text-lg">Dr. Ahmed Ali</h4>
            <p className="text-gray-500">General Physician</p>
          </div>

          <div className="bg-white p-6 rounded shadow text-center">
            <img src="https://via.placeholder.com/150" className="mx-auto rounded-full mb-4" />
            <h4 className="font-semibold text-lg">Dr. Fatima Begum</h4>
            <p className="text-gray-500">Gynecologist</p>
          </div>

          <div className="bg-white p-6 rounded shadow text-center">
            <img src="https://via.placeholder.com/150" className="mx-auto rounded-full mb-4" />
            <h4 className="font-semibold text-lg">Dr. Rahman</h4>
            <p className="text-gray-500">Surgeon</p>
          </div>

        </div>
      </section>

      {/* Contact Section (NOW WORKING) */}
      <section className="p-10">
        <h3 className="text-2xl font-bold text-center mb-8">Contact Us</h3>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          
          <input 
            name="name"
            type="text" 
            placeholder="Your Name" 
            className="w-full mb-4 p-2 border rounded"
          />

          <input 
            name="email"
            type="email" 
            placeholder="Your Email" 
            className="w-full mb-4 p-2 border rounded"
          />

          <textarea 
            name="message"
            placeholder="Your Message" 
            className="w-full mb-4 p-2 border rounded"
          ></textarea>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Send Message
          </button>

        </form>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center p-4">
        <p>© 2026 Selyan Care Hospital. All rights reserved.</p>
      </footer>

    </main>
  );
}